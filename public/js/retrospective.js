// Socket.io connection
const socket = io();

// DOM Elements
const showTemplateBtn = document.getElementById('show-template-btn');
const joinRoomBtn = document.getElementById('join-room-btn');
const roomIdInput = document.getElementById('room-id-input');
const currentRoomIdSpan = document.getElementById('current-room-id');
const copyRoomBtn = document.getElementById('copy-room-btn');
const shareRoomBtn = document.getElementById('share-room-btn');
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
const notification = document.getElementById('notification');
const currentYearSpan = document.getElementById('current-year');

// Share dialog elements
const shareDialog = document.getElementById('share-dialog');
const closeShareDialogBtn = document.getElementById('close-share-dialog');
const shareLinkInput = document.getElementById('share-link');
const copyShareLinkBtn = document.getElementById('copy-share-link-btn');

// State variables
let currentRoomId = null;
let currentTemplate = null;
let availableTemplates = {};
let selectedTemplateId = null;

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

// Event Listeners
showTemplateBtn.addEventListener('click', showTemplateSelection);
joinRoomBtn.addEventListener('click', joinRoom);
roomIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') joinRoom();
});
copyRoomBtn.addEventListener('click', copyRoomId);
shareRoomBtn.addEventListener('click', openShareDialog);
closeShareDialogBtn.addEventListener('click', closeShareDialog);
copyShareLinkBtn.addEventListener('click', copyShareLink);
addStickyBtn.addEventListener('click', openAddStickyModal);
closeModalBtn.addEventListener('click', closeAddStickyModal);
submitStickyBtn.addEventListener('click', submitSticky);

// Initialize app
function init() {
    initFooter();
    checkURLParams();
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

function showTemplateSelection() {
    welcomeSection.classList.add('hidden');
    templateSelectionSection.classList.remove('hidden');
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

function openShareDialog() {
    if (!currentRoomId) return;
    
    // Generate shareable link
    const url = new URL(window.location.href);
    // Clear existing parameters
    url.search = '';
    // Add room parameter
    url.searchParams.set('room', currentRoomId);
    
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

// Add this function to check for room ID in URL parameters
function checkURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    const roomId = urlParams.get('room');
    
    if (roomId) {
        roomIdInput.value = roomId;
        // Auto join if room ID is in URL
        joinRoom();
    }
}

// Socket event handlers
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

socket.on('connect', () => {
    init();
});

socket.on('error', (errorMessage) => {
    showNotification(errorMessage, true);
    
    // Reset button states
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
});

socket.on('disconnect', () => {
    showNotification('Connection lost. Please refresh the page.', true);
}); 