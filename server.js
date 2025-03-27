const express = require('express');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const { v4: uuidv4 } = require('uuid');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route for the retrospective page
app.get('/retrospective', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'retrospective.html'));
});

// Route for the planning poker page
app.get('/planning-poker', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'planning-poker.html'));
});

// Route for the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Define retrospective templates
const TEMPLATES = {
  'start-stop-continue': {
    name: 'Start, Stop, Continue',
    columns: ['start', 'stop', 'continue']
  },
  'went-well-improve-ideas': {
    name: 'What Went Well, What Could Be Improved, Ideas',
    columns: ['went-well', 'to-improve', 'ideas']
  },
  '4l': {
    name: 'Liked, Learned, Lacked, Longed For',
    columns: ['liked', 'learned', 'lacked', 'longed-for']
  }
};

// Store rooms data
const rooms = {};

// Store planning poker rooms
const pokerRooms = {};

// Helper function to generate a room ID
function generateRoomId() {
  return uuidv4().substring(0, 6);
}

io.on('connection', (socket) => {
  // Send available templates
  socket.emit('available-templates', TEMPLATES);

  // -------------------------- //
  // Retrospective Functionality
  // -------------------------- //

  // Create a new room
  socket.on('create-room', (templateId) => {
    if (!TEMPLATES[templateId]) {
      socket.emit('error', 'Invalid template selection');
      return;
    }

    const roomId = generateRoomId();
    rooms[roomId] = {
      stickies: {},
      votes: {},
      template: templateId
    };
    socket.emit('room-created', roomId);
  });

  // Join an existing room
  socket.on('join-room', (roomId) => {
    if (!rooms[roomId]) {
      socket.emit('error', 'Room does not exist');
      return;
    }
    
    socket.join(roomId);
    socket.emit('room-joined', roomId, rooms[roomId]);
  });

  // Add a sticky note
  socket.on('add-sticky', (roomId, content, category) => {
    if (!rooms[roomId]) {
      socket.emit('error', 'Room does not exist');
      return;
    }
    
    const stickyId = uuidv4();
    const sticky = {
      id: stickyId,
      content,
      category,
      votes: 0,
      timestamp: Date.now()
    };
    
    if (!rooms[roomId].stickies) {
      rooms[roomId].stickies = {};
    }
    
    rooms[roomId].stickies[stickyId] = sticky;
    io.to(roomId).emit('sticky-added', sticky);
  });

  // Vote for a sticky note
  socket.on('vote-sticky', (roomId, stickyId) => {
    if (!rooms[roomId] || !rooms[roomId].stickies || !rooms[roomId].stickies[stickyId]) {
      socket.emit('error', 'Invalid room or sticky note');
      return;
    }
    
    // Track votes per user to limit them
    if (!rooms[roomId].votes) {
      rooms[roomId].votes = {};
    }
    
    if (!rooms[roomId].votes[socket.id]) {
      rooms[roomId].votes[socket.id] = new Set();
    }
    
    // Check if user has already voted for this sticky
    if (rooms[roomId].votes[socket.id].has(stickyId)) {
      // Remove vote if already voted
      rooms[roomId].votes[socket.id].delete(stickyId);
      rooms[roomId].stickies[stickyId].votes--;
    } else {
      // Add vote if not voted yet
      rooms[roomId].votes[socket.id].add(stickyId);
      rooms[roomId].stickies[stickyId].votes++;
    }
    
    io.to(roomId).emit('sticky-voted', stickyId, rooms[roomId].stickies[stickyId].votes);
  });

  // -------------------------- //
  // Planning Poker Functionality
  // -------------------------- //

  // Create a new poker room
  socket.on('create-poker-room', (userName) => {
    const roomId = generateRoomId();
    
    pokerRooms[roomId] = {
      participants: {},
      votes: {},
      revealedResults: false,
    };
    
    socket.emit('poker-room-created', roomId);
  });

  // Join an existing poker room
  socket.on('join-poker-room', (roomId, userName) => {
    if (!pokerRooms[roomId]) {
      socket.emit('error', `Room ${roomId} does not exist`);
      return;
    }
    
    // Join the socket.io room
    socket.join(roomId);
    
    // Add participant to the room
    pokerRooms[roomId].participants[socket.id] = {
      id: socket.id,
      name: userName,
      hasVoted: false
    };
    
    // Send room data to the user
    socket.emit('poker-room-joined', roomId, {
      participants: pokerRooms[roomId].participants,
      revealedResults: pokerRooms[roomId].revealedResults,
      results: pokerRooms[roomId].revealedResults ? pokerRooms[roomId].votes : null
    });
    
    // Notify others about the new participant
    socket.to(roomId).emit('poker-participant-joined', {
      id: socket.id,
      name: userName,
      hasVoted: false
    });
  });

  // Submit vote for current story
  socket.on('poker-vote', (roomId, vote) => {
    if (!pokerRooms[roomId]) return;
    
    // Check if results are already revealed
    if (pokerRooms[roomId].revealedResults) {
      socket.emit('error', 'Voting is closed for this round');
      return;
    }
    
    // Record the vote
    if (vote === null) {
      // If vote is null, the user is retracting their vote
      delete pokerRooms[roomId].votes[socket.id];
      pokerRooms[roomId].participants[socket.id].hasVoted = false;
    } else {
      pokerRooms[roomId].votes[socket.id] = vote;
      pokerRooms[roomId].participants[socket.id].hasVoted = true;
    }
    
    // Notify everyone about the vote status update
    io.to(roomId).emit('poker-vote-updated', socket.id, vote !== null);
    
    // Check if all participants have voted, if so auto-reveal
    const participants = Object.values(pokerRooms[roomId].participants);
    if (participants.length >= 2 && participants.every(p => p.hasVoted)) {
      revealPokerCards(roomId);
    }
  });

  // Reveal all votes
  socket.on('reveal-poker-cards', (roomId) => {
    revealPokerCards(roomId);
  });

  // Reset voting for next round
  socket.on('reset-poker-voting', (roomId) => {
    if (!pokerRooms[roomId]) return;
    
    // Reset all votes and reveal status
    pokerRooms[roomId].votes = {};
    pokerRooms[roomId].revealedResults = false;
    
    // Reset vote status for all participants
    Object.values(pokerRooms[roomId].participants).forEach(participant => {
      participant.hasVoted = false;
    });
    
    // Notify all clients about the reset
    io.to(roomId).emit('poker-voting-reset');
  });

  // Disconnect handling
  socket.on('disconnect', () => {
    // Clean up retrospective room votes
    Object.keys(rooms).forEach(roomId => {
      if (rooms[roomId].votes && rooms[roomId].votes[socket.id]) {
        delete rooms[roomId].votes[socket.id];
      }
    });
    
    // Clean up poker rooms
    Object.keys(pokerRooms).forEach(roomId => {
      // Remove participant
      if (pokerRooms[roomId].participants && pokerRooms[roomId].participants[socket.id]) {
        const leavingParticipant = pokerRooms[roomId].participants[socket.id];
        delete pokerRooms[roomId].participants[socket.id];
        
        // Remove vote
        if (pokerRooms[roomId].votes && pokerRooms[roomId].votes[socket.id]) {
          delete pokerRooms[roomId].votes[socket.id];
        }
        
        // Notify remaining participants
        io.to(roomId).emit('poker-participant-left', socket.id);
        
        // Check if room is empty
        if (Object.keys(pokerRooms[roomId].participants).length === 0) {
          delete pokerRooms[roomId];
        }
      }
    });
  });
});

// Helper function to reveal poker cards
function revealPokerCards(roomId) {
  if (!pokerRooms[roomId]) return;
  
  // Set revealed flag
  pokerRooms[roomId].revealedResults = true;
  
  // Send results to all participants
  io.to(roomId).emit('poker-cards-revealed', pokerRooms[roomId].votes);
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  // Server is running
}); 