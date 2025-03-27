// Socket.io connection
const socket = io();

// DOM Elements
const pokerRoomInfo = document.getElementById('poker-room-info');
const pokerWelcomeSection = document.getElementById('poker-welcome-section');
const userNameInput = document.getElementById('user-name-input');
const createPokerRoomBtn = document.getElementById('create-poker-room-btn');
const joinPokerRoomBtn = document.getElementById('join-poker-room-btn');
const pokerRoomIdInput = document.getElementById('poker-room-id-input');
const currentPokerRoomIdSpan = document.getElementById('current-poker-room-id');
const copyPokerRoomBtn = document.getElementById('copy-poker-room-btn');
const sharePokerRoomBtn = document.getElementById('share-poker-room-btn');
const activePokerRoomSection = document.getElementById('active-poker-room-section');
const planningPokerBoard = document.getElementById('planning-poker-board');
const pokerCards = document.querySelectorAll('.poker-card');
const participantsList = document.getElementById('participants-list');
const revealCardsBtn = document.getElementById('reveal-cards-btn');
const resetVotingBtn = document.getElementById('reset-voting-btn');
const pokerResults = document.getElementById('poker-results');
const resultsList = document.getElementById('results-list');
const resultsSummary = document.getElementById('results-summary');
const notification = document.getElementById('notification');
const currentYearSpan = document.getElementById('current-year');

// Share dialog elements
const shareDialog = document.getElementById('share-dialog');
const closeShareDialogBtn = document.getElementById('close-share-dialog');
const shareLinkInput = document.getElementById('share-link');
const copyShareLinkBtn = document.getElementById('copy-share-link-btn');

// State variables
let currentPokerRoomId = null;
let userName = null;
let isPokerHost = false;
let selectedCard = null;
let participants = {};
let revealedResults = false;

// Initialize footer year
function initFooter() {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Event Listeners
createPokerRoomBtn.addEventListener('click', createPokerRoom);
joinPokerRoomBtn.addEventListener('click', joinPokerRoom);
pokerRoomIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinPokerRoom();
});
copyPokerRoomBtn.addEventListener('click', copyPokerRoomId);
sharePokerRoomBtn.addEventListener('click', openShareDialog);
closeShareDialogBtn.addEventListener('click', closeShareDialog);
copyShareLinkBtn.addEventListener('click', copyShareLink);
revealCardsBtn.addEventListener('click', revealCards);
resetVotingBtn.addEventListener('click', resetVoting);

// Add event listeners to all poker cards
pokerCards.forEach(card => {
    card.addEventListener('click', () => selectPokerCard(card));
});

// Check URL parameters on load
window.addEventListener('DOMContentLoaded', checkURLParams);

// Initialize app
function init() {
    initFooter();
    
    // Create confetti canvas if it doesn't exist
    if (!document.getElementById('confetti-canvas')) {
        const confettiCanvas = document.createElement('canvas');
        confettiCanvas.id = 'confetti-canvas';
        document.body.appendChild(confettiCanvas);
    }
}

// Functions
function validateUserName() {
    userName = userNameInput.value.trim();
    if (!userName) {
        showNotification('Please enter your name before joining', true);
        userNameInput.focus();
        return false;
    }
    return true;
}

// Check for room ID in URL parameters
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    
    if (roomId) {
        pokerRoomIdInput.value = roomId;
        // Focus on name input if a room ID is provided
        userNameInput.focus();
        
        // Auto-join if name exists in local storage
        const savedName = localStorage.getItem('planning-poker-name');
        if (savedName) {
            userNameInput.value = savedName;
            // Small delay to ensure the DOM is fully loaded
            setTimeout(() => {
                joinPokerRoom();
            }, 500);
        }
    }
}

function createPokerRoom() {
    if (!validateUserName()) {
        return;
    }
    
    // Save name to local storage
    localStorage.setItem('planning-poker-name', userName);
    
    // Show loading state
    const originalContent = createPokerRoomBtn.innerHTML;
    createPokerRoomBtn.innerHTML = '<div class="loading-spinner"></div> Creating...';
    createPokerRoomBtn.disabled = true;
    
    isPokerHost = true;
    socket.emit('create-poker-room', userName);
    
    // Reset button after a timeout (in case of network issues)
    setTimeout(() => {
        if (createPokerRoomBtn.innerHTML.includes('Creating')) {
            createPokerRoomBtn.innerHTML = originalContent;
            createPokerRoomBtn.disabled = false;
        }
    }, 5000);
}

function joinPokerRoom() {
    if (!validateUserName()) return;
    
    // Save name to local storage
    localStorage.setItem('planning-poker-name', userName);
    
    const roomId = pokerRoomIdInput.value.trim();
    if (!roomId) {
        showNotification('Please enter a room ID', true);
        return;
    }
    
    // Show loading state
    const originalContent = joinPokerRoomBtn.innerHTML;
    joinPokerRoomBtn.innerHTML = '<div class="loading-spinner"></div> Joining...';
    joinPokerRoomBtn.disabled = true;
    
    socket.emit('join-poker-room', roomId, userName);
    
    // Reset button after a timeout (in case of network issues)
    setTimeout(() => {
        if (joinPokerRoomBtn.innerHTML.includes('Joining')) {
            joinPokerRoomBtn.innerHTML = originalContent;
            joinPokerRoomBtn.disabled = false;
        }
    }, 5000);
}

function copyPokerRoomId() {
    if (!currentPokerRoomId) return;
    
    navigator.clipboard.writeText(currentPokerRoomId)
        .then(() => {
            showNotification('Room ID copied to clipboard!');
            
            // Visual feedback on the button
            copyPokerRoomBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyPokerRoomBtn.innerHTML = '<i class="fas fa-copy"></i> Copy ID';
            }, 2000);
        })
        .catch(err => {
            showNotification('Failed to copy room ID', true);
        });
}

function openShareDialog() {
    if (!currentPokerRoomId) return;
    
    // Generate shareable link
    const url = new URL(window.location.href);
    // Clear existing parameters
    url.search = '';
    // Add room parameter
    url.searchParams.set('room', currentPokerRoomId);
    
    // Set the link in the input field
    shareLinkInput.value = url.toString();
    
    // Show dialog
    shareDialog.classList.add('show');
    
    // Select the link text for easy copying
    setTimeout(() => {
        shareLinkInput.select();
    }, 100);
}

function closeShareDialog() {
    shareDialog.classList.remove('show');
}

function copyShareLink() {
    const link = shareLinkInput.value;
    
    navigator.clipboard.writeText(link)
        .then(() => {
            showNotification('Shareable link copied to clipboard!');
            
            // Visual feedback on the button
            copyShareLinkBtn.classList.add('copied');
            copyShareLinkBtn.innerHTML = '<i class="fas fa-check"></i>';
            
            setTimeout(() => {
                copyShareLinkBtn.classList.remove('copied');
                copyShareLinkBtn.innerHTML = '<i class="fas fa-copy"></i>';
            }, 2000);
        })
        .catch(err => {
            showNotification('Failed to copy link', true);
        });
}

function enterPokerRoom(roomId, roomData) {
    currentPokerRoomId = roomId;
    currentPokerRoomIdSpan.textContent = roomId;
    
    // Reset button states
    if (joinPokerRoomBtn.disabled) {
        joinPokerRoomBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Join Room`;
        joinPokerRoomBtn.disabled = false;
    }
    
    if (createPokerRoomBtn.disabled) {
        createPokerRoomBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Create Poker Room`;
        createPokerRoomBtn.disabled = false;
    }
    
    // Switch UI elements
    pokerWelcomeSection.classList.add('hidden');
    activePokerRoomSection.classList.remove('hidden');
    planningPokerBoard.classList.remove('hidden');
    
    // Show control buttons for everyone
    document.querySelector('.poker-controls-buttons').classList.remove('hidden');
    
    // Update participants list
    if (roomData.participants) {
        participants = roomData.participants;
        updateParticipantsList();
    }
    
    // Update voting status
    if (roomData.revealedResults) {
        revealedResults = true;
        displayResults(roomData.results);
    }
    
    showNotification(`Joined poker room: ${roomId}`);
}

function selectPokerCard(card) {
    // Don't allow new voting if results are revealed
    if (revealedResults) return;
    
    // Remove selected class from previously selected card
    if (selectedCard) {
        selectedCard.classList.remove('selected');
    }
    
    // Check if we're clicking the same card (deselect)
    if (selectedCard === card) {
        selectedCard = null;
        socket.emit('poker-vote', currentPokerRoomId, null);
        return;
    }
    
    // Set new selected card
    selectedCard = card;
    card.classList.add('selected');
    
    // Send vote to server
    const value = card.dataset.value;
    socket.emit('poker-vote', currentPokerRoomId, value);
}

function resetVotingUI() {
    // Hide results
    pokerResults.classList.add('hidden');
    
    // Reset selected card
    if (selectedCard) {
        selectedCard.classList.remove('selected');
        selectedCard = null;
    }
    
    // Reset results revealed flag
    revealedResults = false;
}

function revealCards() {
    socket.emit('reveal-poker-cards', currentPokerRoomId);
}

function resetVoting() {
    socket.emit('reset-poker-voting', currentPokerRoomId);
}

function updateParticipantsList() {
    participantsList.innerHTML = '';
    
    // Check if all participants have voted to auto-reveal
    let allVoted = true;
    let participantCount = 0;
    
    Object.entries(participants).forEach(([id, participant]) => {
        const hasVoted = participant.hasVoted === true;
        const isCurrentUser = id === socket.id;
        participantCount++;
        
        if (!hasVoted) {
            allVoted = false;
        }
        
        const participantElement = document.createElement('div');
        participantElement.className = 'participant-item';
        
        participantElement.innerHTML = `
            <span class="participant-status ${hasVoted ? 'voted' : 'not-voted'}"></span>
            <span class="participant-name">${escapeHTML(participant.name)}${isCurrentUser ? ' (You)' : ''}</span>
            <div class="participant-card ${revealedResults ? 'face-up' : 'face-down'}">${revealedResults && participant.vote ? participant.vote : ''}</div>
        `;
        
        participantsList.appendChild(participantElement);
    });
    
    // Auto-reveal cards if everyone has voted and there are at least 2 participants
    if (allVoted && participantCount >= 2 && !revealedResults) {
        socket.emit('reveal-poker-cards', currentPokerRoomId);
    }
}

function displayResults(results) {
    if (!results) return;
    
    resultsList.innerHTML = '';
    resultsSummary.innerHTML = '';
    
    // Show the results section
    pokerResults.classList.remove('hidden');
    
    // Process votes and calculate stats
    const voteValues = Object.values(participants)
        .filter(p => p.vote)
        .map(p => p.vote);
    
    const numericVotes = voteValues
        .filter(v => v !== '?' && v !== 'coffee')
        .map(v => parseInt(v, 10))
        .filter(v => !isNaN(v));
    
    // Check for consensus (everyone voted the same)
    const uniqueVotes = new Set(voteValues);
    const hasConsensus = uniqueVotes.size === 1 && voteValues.length > 1;
    
    // Skip calculation if no valid numeric votes
    if (numericVotes.length === 0) {
        resultsSummary.innerHTML = '<p>No numeric votes yet.</p>';
        
        // We still need to check for consensus on non-numeric votes (like coffee)
        if (hasConsensus) {
            showConfetti();
            showNotification(`Consensus! Everyone selected ${voteValues[0]}!`);
            
            // Add consensus highlight to all result items
            setTimeout(() => {
                document.querySelectorAll('.result-item').forEach(item => {
                    item.classList.add('consensus-match');
                });
            }, 100);
        }
        
        return;
    }
    
    // Calculate stats for numeric votes
    const average = numericVotes.reduce((sum, v) => sum + v, 0) / numericVotes.length;
    const sortedVotes = [...numericVotes].sort((a, b) => a - b);
    const median = sortedVotes.length % 2 === 0 
        ? (sortedVotes[sortedVotes.length / 2 - 1] + sortedVotes[sortedVotes.length / 2]) / 2
        : sortedVotes[Math.floor(sortedVotes.length / 2)];
    
    // Find most common vote (mode)
    const voteCounts = numericVotes.reduce((counts, vote) => {
        counts[vote] = (counts[vote] || 0) + 1;
        return counts;
    }, {});
    
    let mode = null;
    let maxCount = 0;
    
    for (const [vote, count] of Object.entries(voteCounts)) {
        if (count > maxCount) {
            mode = parseInt(vote, 10);
            maxCount = count;
        }
    }
    
    // Populate results list (individual votes)
    Object.entries(participants).forEach(([id, participant]) => {
        if (!participant.vote) return;
        
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        resultItem.innerHTML = `
            <span class="result-name">${escapeHTML(participant.name)}</span>
            <span class="result-value">${participant.vote}</span>
        `;
        
        resultsList.appendChild(resultItem);
    });
    
    // Populate results summary
    resultsSummary.innerHTML = `
        <p class="summary-title">Consensus Analysis</p>
        <div class="summary-stats">
            <div class="summary-stat">
                <div class="stat-value">${average.toFixed(1)}</div>
                <div class="stat-label">Average</div>
            </div>
            <div class="summary-stat">
                <div class="stat-value">${median}</div>
                <div class="stat-label">Median</div>
            </div>
            <div class="summary-stat">
                <div class="stat-value">${mode !== null ? mode : '-'}</div>
                <div class="stat-label">Mode</div>
            </div>
        </div>
    `;
    
    // Show confetti and highlight if everyone voted the same
    if (hasConsensus) {
        showConfetti();
        showNotification(`Consensus! Everyone selected ${voteValues[0]}!`);
        
        // Add consensus highlight to all result items
        setTimeout(() => {
            document.querySelectorAll('.result-item').forEach(item => {
                item.classList.add('consensus-match');
            });
        }, 100);
    }
}

// Function to show confetti animation
function showConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const myConfetti = confetti.create(canvas, { resize: true });
    
    // Colorful confetti burst
    myConfetti({
        particleCount: 200,
        spread: 160,
        origin: { y: 0.6 },
        colors: ['#4f46e5', '#16a34a', '#ea580c', '#fde047', '#d946ef']
    });
    
    // Add some delayed bursts for more excitement
    setTimeout(() => {
        myConfetti({
            particleCount: 50,
            angle: 60,
            spread: 80,
            origin: { x: 0 },
            colors: ['#4f46e5', '#16a34a', '#ea580c']
        });
    }, 500);
    
    setTimeout(() => {
        myConfetti({
            particleCount: 50,
            angle: 120,
            spread: 80,
            origin: { x: 1 },
            colors: ['#fde047', '#d946ef', '#16a34a']
        });
    }, 900);
}

function showNotification(message, isError = false) {
    notification.textContent = message;
    notification.classList.remove('hidden', 'error', 'show');
    
    // Force a reflow to restart the animation if the notification is already visible
    void notification.offsetWidth;
    
    if (isError) {
        notification.classList.add('error');
    }
    
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Helper function to safely escape HTML
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Socket event handlers
socket.on('poker-room-created', (roomId) => {
    pokerRoomIdInput.value = roomId;
    socket.emit('join-poker-room', roomId, userName);
});

socket.on('poker-room-joined', (roomId, roomData) => {
    enterPokerRoom(roomId, roomData);
});

socket.on('poker-participant-joined', (participant) => {
    if (!participants[participant.id]) {
        showNotification(`${participant.name} has joined the room`);
    }
    participants[participant.id] = participant;
    updateParticipantsList();
});

socket.on('poker-participant-left', (participantId) => {
    if (participants[participantId]) {
        showNotification(`${participants[participantId].name} has left the room`);
        delete participants[participantId];
        updateParticipantsList();
    }
});

socket.on('poker-vote-updated', (participantId, hasVoted) => {
    if (participants[participantId]) {
        participants[participantId].hasVoted = hasVoted;
        updateParticipantsList();
    }
});

socket.on('poker-cards-revealed', (results) => {
    revealedResults = true;
    
    // Update participants to show votes
    Object.entries(results).forEach(([id, vote]) => {
        if (participants[id]) {
            participants[id].vote = vote;
        }
    });
    
    updateParticipantsList();
    displayResults(results);
    showNotification('Votes have been revealed');
});

socket.on('poker-voting-reset', () => {
    Object.keys(participants).forEach(id => {
        if (participants[id]) {
            delete participants[id].vote;
            delete participants[id].hasVoted;
        }
    });
    
    resetVotingUI();
    updateParticipantsList();
    showNotification('Voting has been reset');
    
    // Clear selected card for current user
    if (selectedCard) {
        selectedCard.classList.remove('selected');
        selectedCard = null;
    }
});

socket.on('connect', () => {
    init();
});

socket.on('error', (errorMessage) => {
    showNotification(errorMessage, true);
    
    // Reset button states
    joinPokerRoomBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Join Room`;
    joinPokerRoomBtn.disabled = false;
    
    createPokerRoomBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Create Poker Room`;
    createPokerRoomBtn.disabled = false;
});

socket.on('disconnect', () => {
    showNotification('Connection lost. Please refresh the page.', true);
}); 