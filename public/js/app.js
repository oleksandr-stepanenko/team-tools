// Socket.io connection
const socket = io();

// DOM Elements - App Selection
const appSelection = document.getElementById('app-selection');
const retrospectiveCard = document.getElementById('retrospective-card');
const planningPokerCard = document.getElementById('planning-poker-card');

// DOM Elements - Retrospective
const showTemplateBtn = document.getElementById('show-template-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomIdInput = document.getElementById('room-id-input');
const currentRoomIdSpan = document.getElementById('current-room-id');
const copyRoomBtn = document.getElementById('copy-room-btn');
const welcomeSection = document.getElementById('welcome-section');
const templateSelectionSection = document.getElementById('template-selection-section');
const templatesContainer = document.querySelector('.templates-container');
const activeRoomSection = document.getElementById('active-room-section');
const retrospectiveBoard = document.getElementById('retrospective-board');
const columnsContainer = document.getElementById('columns-container');
const addStickyBtn = document.getElementById('add-sticky-btn');
const addStickyModal = document.getElementById('add-sticky-modal');
const closeModalBtn = document.querySelector('.close-modal');
const submitStickyBtn = document.getElementById('submit-sticky-btn');
const stickyCategory = document.getElementById('sticky-category');
const stickyContent = document.getElementById('sticky-content');
const roomInfo = document.getElementById('room-info');

// DOM Elements - Planning Poker
const pokerRoomInfo = document.getElementById('poker-room-info');
const pokerWelcomeSection = document.getElementById('poker-welcome-section');
const userNameInput = document.getElementById('user-name-input');
const createPokerRoomBtn = document.getElementById('create-poker-room-btn');
const joinPokerRoomBtn = document.getElementById('join-poker-room-btn');
const pokerRoomIdInput = document.getElementById('poker-room-id-input');
const currentPokerRoomIdSpan = document.getElementById('current-poker-room-id');
const copyPokerRoomBtn = document.getElementById('copy-poker-room-btn');
const activePokerRoomSection = document.getElementById('active-poker-room-section');
const planningPokerBoard = document.getElementById('planning-poker-board');
const pokerCards = document.querySelectorAll('.poker-card');
const participantsList = document.getElementById('participants-list');
const hostControls = document.getElementById('host-controls');
const storyTitleInput = document.getElementById('story-title-input');
const storyDescriptionInput = document.getElementById('story-description-input');
const setStoryBtn = document.getElementById('set-story-btn');
const revealCardsBtn = document.getElementById('reveal-cards-btn');
const resetVotingBtn = document.getElementById('reset-voting-btn');
const currentStoryTitle = document.getElementById('current-story-title');
const currentStoryDescription = document.getElementById('current-story-description');
const pokerResults = document.getElementById('poker-results');
const resultsList = document.getElementById('results-list');
const resultsSummary = document.getElementById('results-summary');

// Common Elements
const notification = document.getElementById('notification');
const currentYearSpan = document.getElementById('current-year');

// State variables - Retrospective
let currentRoomId = null;
let currentTemplate = null;
let availableTemplates = {};
let selectedTemplateId = null;

// State variables - Planning Poker
let currentPokerRoomId = null;
let userName = null;
let isPokerHost = false;
let selectedCard = null;
let participants = {};
let currentStory = { title: null, description: null };
let revealedResults = false;

// App mode tracking
let currentAppMode = null; // 'retrospective' or 'planning-poker'

// Column icons mapping
const columnIcons = {
    'start': 'fa-play',
    'stop': 'fa-stop',
    'continue': 'fa-forward',
    'went-well': 'fa-thumbs-up',
    'to-improve': 'fa-arrows-rotate',
    'ideas': 'fa-lightbulb',
    'liked': 'fa-heart',
    'learned': 'fa-book',
    'lacked': 'fa-minus-circle',
    'longed-for': 'fa-star'
};

// Column titles mapping
const columnTitles = {
    'start': 'Start',
    'stop': 'Stop',
    'continue': 'Continue',
    'went-well': 'What Went Well',
    'to-improve': 'What Could Be Improved',
    'ideas': 'Ideas',
    'liked': 'Liked',
    'learned': 'Learned',
    'lacked': 'Lacked',
    'longed-for': 'Longed For'
};

// Column descriptions
const columnDescriptions = {
    'start': 'New practices to adopt',
    'stop': 'Things to stop doing',
    'continue': 'What worked well and should continue',
    'went-well': 'Positive aspects of the project',
    'to-improve': 'Areas that need attention',
    'ideas': 'Suggestions for future improvements',
    'liked': 'Things you enjoyed about the project',
    'learned': 'New insights and knowledge gained',
    'lacked': 'Missing elements that would have helped',
    'longed-for': 'Wishes and desires for the future'
};

// Initialize footer year
function initFooter() {
    currentYearSpan.textContent = new Date().getFullYear();
}

// Event Listeners - App Selection
retrospectiveCard.addEventListener('click', selectRetrospectiveApp);
planningPokerCard.addEventListener('click', selectPlanningPokerApp);

// Event Listeners - Retrospective
showTemplateBtn.addEventListener('click', showTemplateSelection);
joinRoomBtn.addEventListener('click', joinRoom);
roomIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinRoom();
});
copyRoomBtn.addEventListener('click', copyRoomId);
addStickyBtn.addEventListener('click', openAddStickyModal);
closeModalBtn.addEventListener('click', closeAddStickyModal);
submitStickyBtn.addEventListener('click', submitSticky);

// Event Listeners - Planning Poker
createPokerRoomBtn.addEventListener('click', createPokerRoom);
joinPokerRoomBtn.addEventListener('click', joinPokerRoom);
pokerRoomIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinPokerRoom();
});
copyPokerRoomBtn.addEventListener('click', copyPokerRoomId);
setStoryBtn.addEventListener('click', setStory);
revealCardsBtn.addEventListener('click', revealCards);
resetVotingBtn.addEventListener('click', resetVoting);

// Add event listeners to all poker cards
pokerCards.forEach(card => {
    card.addEventListener('click', () => selectPokerCard(card));
});

// Initialize app
function init() {
    initFooter();
}

// App Selection Functions
function selectRetrospectiveApp() {
    currentAppMode = 'retrospective';
    appSelection.classList.add('hidden');
    roomInfo.classList.remove('hidden');
}

function selectPlanningPokerApp() {
    currentAppMode = 'planning-poker';
    appSelection.classList.add('hidden');
    pokerRoomInfo.classList.remove('hidden');
}

// Retrospective Functions
function showTemplateSelection() {
    welcomeSection.classList.add('hidden');
    templateSelectionSection.classList.remove('hidden');
}

// Function to update column layout class based on number of columns
function updateColumnsLayout() {
    const columns = columnsContainer.querySelectorAll('.column');
    
    if (columns.length === 3) {
        columnsContainer.classList.add('three-columns');
    } else {
        columnsContainer.classList.remove('three-columns');
    }
}

function selectTemplate(templateId) {
    if (selectedTemplateId) {
        const prevSelected = document.querySelector(`.template-card[data-template-id="${selectedTemplateId}"]`);
        if (prevSelected) prevSelected.classList.remove('selected');
    }
    
    selectedTemplateId = templateId;
    const templateCard = document.querySelector(`.template-card[data-template-id="${templateId}"]`);
    if (templateCard) templateCard.classList.add('selected');
    
    // Create a Create Room button if it doesn't exist
    let createRoomBtn = document.querySelector('#create-room-btn');
    if (!createRoomBtn) {
        const templateActions = document.createElement('div');
        templateActions.className = 'template-actions';
        templateActions.innerHTML = `
            <button id="create-room-btn" class="btn primary"><i class="fas fa-plus-circle"></i> Create Room with Template</button>
        `;
        templateSelectionSection.appendChild(templateActions);
        
        createRoomBtn = document.querySelector('#create-room-btn');
        createRoomBtn.addEventListener('click', () => createRoom(selectedTemplateId));
    }
}

function createRoom(templateId) {
    if (!templateId) {
        showNotification('Please select a template', true);
        return;
    }
    
    // Show loading state
    const createRoomBtn = document.querySelector('#create-room-btn');
    const originalContent = createRoomBtn.innerHTML;
    createRoomBtn.innerHTML = '<div class="loading-spinner"></div> Creating...';
    createRoomBtn.disabled = true;
    
    socket.emit('create-room', templateId);
    
    // Reset button after a timeout (in case of network issues)
    setTimeout(() => {
        if (createRoomBtn.innerHTML.includes('Creating')) {
            createRoomBtn.innerHTML = originalContent;
            createRoomBtn.disabled = false;
        }
    }, 5000);
}

function joinRoom() {
    const roomId = roomIdInput.value.trim();
    if (!roomId) {
        showNotification('Please enter a room ID', true);
        return;
    }
    
    // Show loading state
    const originalContent = joinRoomBtn.innerHTML;
    joinRoomBtn.innerHTML = '<div class="loading-spinner"></div> Joining...';
    joinRoomBtn.disabled = true;
    
    socket.emit('join-room', roomId);
    
    // Reset button after a timeout (in case of network issues)
    setTimeout(() => {
        if (joinRoomBtn.innerHTML.includes('Joining')) {
            joinRoomBtn.innerHTML = originalContent;
            joinRoomBtn.disabled = false;
        }
    }, 5000);
}

// Planning Poker Functions
function validateUserName() {
    userName = userNameInput.value.trim();
    if (!userName) {
        showNotification('Please enter your name before joining', true);
        userNameInput.focus();
        return false;
    }
    return true;
}

function createPokerRoom() {
    if (!validateUserName()) {
        return;
    }
    
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
    const votes = Object.values(participants)
        .filter(p => p.vote && p.vote !== '?')
        .map(p => parseInt(p.vote, 10))
        .filter(v => !isNaN(v));
    
    // Skip calculation if no valid votes
    if (votes.length === 0) {
        resultsSummary.innerHTML = '<p>No valid votes yet.</p>';
        return;
    }
    
    // Calculate stats
    const average = votes.reduce((sum, v) => sum + v, 0) / votes.length;
    const sortedVotes = [...votes].sort((a, b) => a - b);
    const median = sortedVotes.length % 2 === 0 
        ? (sortedVotes[sortedVotes.length / 2 - 1] + sortedVotes[sortedVotes.length / 2]) / 2
        : sortedVotes[Math.floor(sortedVotes.length / 2)];
    
    // Find most common vote (mode)
    const voteCounts = votes.reduce((counts, vote) => {
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
}

// Common Functions for Both Apps

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

// Socket event handlers - Retrospective
socket.on('available-templates', (templates) => {
    renderTemplates(templates);
});

socket.on('room-created', (roomId) => {
    roomIdInput.value = roomId;
    socket.emit('join-room', roomId);
});

socket.on('room-joined', (roomId, roomData) => {
    enterRoom(roomId, roomData);
});

socket.on('sticky-added', (sticky) => {
    addStickyToBoard(sticky);
    showNotification('New sticky note added!');
});

socket.on('sticky-voted', (stickyId, votes) => {
    updateStickyVotes(stickyId, votes);
});

// Socket event handlers - Planning Poker
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

// Common Socket event handlers
socket.on('connect', () => {
    init();
});

socket.on('error', (errorMessage) => {
    showNotification(errorMessage, true);
    
    // Reset button states for both apps
    if (currentAppMode === 'retrospective') {
        joinRoomBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Join Room`;
        joinRoomBtn.disabled = false;
        
        const createRoomBtn = document.querySelector('#create-room-btn');
        if (createRoomBtn) {
            createRoomBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Create Room with Template`;
            createRoomBtn.disabled = false;
        }
        
        if (submitStickyBtn.disabled) {
            submitStickyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Add Note';
            submitStickyBtn.disabled = false;
        }
    } else if (currentAppMode === 'planning-poker') {
        joinPokerRoomBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Join Room`;
        joinPokerRoomBtn.disabled = false;
        
        createPokerRoomBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Create Poker Room`;
        createPokerRoomBtn.disabled = false;
    }
});

socket.on('disconnect', () => {
    showNotification('Connection lost. Please refresh the page.', true);
});

function renderTemplates(templates) {
    availableTemplates = templates;
    templatesContainer.innerHTML = '';
    
    Object.entries(templates).forEach(([id, template]) => {
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card';
        templateCard.dataset.templateId = id;
        
        let previewColumns = '';
        template.columns.forEach(column => {
            previewColumns += `<div class="preview-column"></div>`;
        });
        
        // Get a descriptive snippet for the template
        let templateDescription = '';
        if (id === 'start-stop-continue') {
            templateDescription = 'A simple but effective format focusing on actionable changes';
        } else if (id === 'went-well-improve-ideas') {
            templateDescription = 'Classic retrospective format highlighting positives and improvements';
        } else if (id === '4l') {
            templateDescription = 'A deeper reflective format examining the team experience';
        }
        
        templateCard.innerHTML = `
            <h4>${template.name}</h4>
            <p>${templateDescription}</p>
            <p><strong>${template.columns.length} columns</strong></p>
            <div class="template-preview">
                ${previewColumns}
            </div>
        `;
        
        templateCard.addEventListener('click', () => selectTemplate(id));
        templatesContainer.appendChild(templateCard);
    });
}

function renderColumnsForTemplate(templateId) {
    if (!availableTemplates[templateId]) return;
    
    currentTemplate = templateId;
    const template = availableTemplates[templateId];
    columnsContainer.innerHTML = '';
    
    template.columns.forEach(columnId => {
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.category = columnId;
        
        const iconClass = columnIcons[columnId] || 'fa-sticky-note';
        const columnTitle = columnTitles[columnId] || columnId;
        const columnDescription = columnDescriptions[columnId] || '';
        
        column.innerHTML = `
            <h3><i class="fas ${iconClass}"></i> ${columnTitle}</h3>
            ${columnDescription ? `<p class="column-description">${columnDescription}</p>` : ''}
            <div class="sticky-container" id="${columnId}-container"></div>
        `;
        
        columnsContainer.appendChild(column);
    });
    
    // Update columns layout based on the number of columns
    updateColumnsLayout();
    
    // Update the sticky category dropdown
    updateStickyCategories(template.columns);
}

function updateStickyCategories(categories) {
    stickyCategory.innerHTML = '';
    
    categories.forEach(categoryId => {
        const option = document.createElement('option');
        option.value = categoryId;
        option.textContent = columnTitles[categoryId] || categoryId;
        stickyCategory.appendChild(option);
    });
}

function enterRoom(roomId, roomData) {
    currentRoomId = roomId;
    currentRoomIdSpan.textContent = roomId;
    
    // Reset button states
    if (joinRoomBtn.disabled) {
        joinRoomBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Join Room`;
        joinRoomBtn.disabled = false;
    }
    
    const createRoomBtn = document.querySelector('#create-room-btn');
    if (createRoomBtn && createRoomBtn.disabled) {
        createRoomBtn.innerHTML = `<i class="fas fa-plus-circle"></i> Create Room with Template`;
        createRoomBtn.disabled = false;
    }
    
    // Switch UI elements
    welcomeSection.classList.add('hidden');
    templateSelectionSection.classList.add('hidden');
    activeRoomSection.classList.remove('hidden');
    retrospectiveBoard.classList.remove('hidden');
    
    // Render the correct template columns
    if (roomData && roomData.template) {
        renderColumnsForTemplate(roomData.template);
    }
    
    // Add existing stickies if any
    if (roomData && roomData.stickies) {
        Object.values(roomData.stickies).forEach(sticky => {
            addStickyToBoard(sticky);
        });
    }
    
    showNotification(`Joined room: ${roomId}`);
}

function copyRoomId() {
    if (!currentRoomId) return;
    
    navigator.clipboard.writeText(currentRoomId)
        .then(() => {
            showNotification('Room ID copied to clipboard!');
            
            // Visual feedback on the button
            copyRoomBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                copyRoomBtn.innerHTML = '<i class="fas fa-copy"></i> Copy ID';
            }, 2000);
        })
        .catch(err => {
            showNotification('Failed to copy room ID', true);
        });
}

function openAddStickyModal() {
    addStickyModal.classList.remove('hidden');
    stickyContent.focus();
}

function closeAddStickyModal() {
    addStickyModal.classList.add('hidden');
    stickyContent.value = '';
}

function submitSticky() {
    const content = stickyContent.value.trim();
    const category = stickyCategory.value;
    
    if (!content) {
        showNotification('Please enter content for your note', true);
        return;
    }
    
    if (!currentRoomId) {
        showNotification('You are not in a room', true);
        return;
    }
    
    // Show loading state
    const originalContent = submitStickyBtn.innerHTML;
    submitStickyBtn.innerHTML = '<div class="loading-spinner"></div> Adding...';
    submitStickyBtn.disabled = true;
    
    socket.emit('add-sticky', currentRoomId, content, category);
    
    // Reset button after submission or timeout
    setTimeout(() => {
        if (submitStickyBtn.disabled) {
            submitStickyBtn.innerHTML = originalContent;
            submitStickyBtn.disabled = false;
        }
    }, 3000);
}

function addStickyToBoard(sticky) {
    const containerID = `${sticky.category}-container`;
    const container = document.getElementById(containerID);
    
    if (!container) {
        showNotification(`Error: Container not found for category ${sticky.category}`, true);
        return;
    }
    
    // Reset submit button if it was in loading state
    if (submitStickyBtn.disabled) {
        submitStickyBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Add Note';
        submitStickyBtn.disabled = false;
        closeAddStickyModal();
    }
    
    const stickyElement = document.createElement('div');
    stickyElement.className = 'sticky-note';
    stickyElement.dataset.id = sticky.id;
    stickyElement.dataset.category = sticky.category;
    
    const formattedTime = new Date(sticky.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    stickyElement.innerHTML = `
        <div class="sticky-content">${escapeHTML(sticky.content)}</div>
        <div class="sticky-footer">
            <span class="sticky-time">${formattedTime}</span>
            <button class="vote-btn" data-id="${sticky.id}">
                <i class="fas fa-thumbs-up"></i>
                <span class="vote-count">${sticky.votes}</span>
            </button>
        </div>
    `;
    
    // Add vote event listener
    const voteBtn = stickyElement.querySelector('.vote-btn');
    voteBtn.addEventListener('click', () => {
        socket.emit('vote-sticky', currentRoomId, sticky.id);
    });
    
    container.appendChild(stickyElement);
    
    // Add a subtle entrance animation
    setTimeout(() => {
        stickyElement.style.opacity = '0';
        stickyElement.style.transform = 'translateY(20px)';
        stickyElement.offsetHeight; // Force reflow
        stickyElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        stickyElement.style.opacity = '1';
        stickyElement.style.transform = 'translateY(0)';
    }, 10);
}

function updateStickyVotes(stickyId, votes) {
    const stickyElement = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
    if (stickyElement) {
        const voteCount = stickyElement.querySelector('.vote-count');
        if (voteCount) {
            voteCount.textContent = votes;
            
            // Add a little animation to show the vote change
            voteCount.style.transform = 'scale(1.5)';
            setTimeout(() => {
                voteCount.style.transition = 'transform 0.3s ease';
                voteCount.style.transform = 'scale(1)';
            }, 10);
        }
    }
} 