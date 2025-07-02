const RETROSPECTIVE_CONFIG = {
    // Socket events
    SOCKET_EVENTS: {
        // Client to Server
        CREATE_ROOM: 'create-room',
        JOIN_ROOM: 'join-room',
        LEAVE_ROOM: 'leave-room',
        ADD_STICKY: 'add-sticky',
        VOTE_STICKY: 'vote-sticky',
        DELETE_STICKY: 'delete-sticky',
        MOVE_STICKY: 'move-sticky',
        
        // Server to Client
        AVAILABLE_TEMPLATES: 'available-templates',
        ROOM_CREATED: 'room-created',
        ROOM_JOINED: 'room-joined',
        ACTIVE_USERS_UPDATED: 'active-users-updated',
        STICKY_ADDED: 'sticky-added',
        STICKY_VOTED: 'sticky-voted',
        STICKY_DELETED: 'sticky-deleted',
        STICKY_MOVED: 'sticky-moved',
        CONNECT: 'connect',
        DISCONNECT: 'disconnect',
        ERROR: 'error'
    },

    // Timeouts
    TIMEOUTS: {
        BUTTON_RESET: 5000,
        NOTIFICATION_DISPLAY: 3000,
        STICKY_SUBMISSION_RESET: 3000,
        STICKY_REMOVAL_ANIMATION: 300,
        HOT_TOPICS_UPDATE_DELAY: 500,
        HOT_TOPICS_UPDATE_AFTER_DELETE: 350,
        VOTE_UPDATE_DELAY: 50
    },

    // UI Classes
    CSS_CLASSES: {
        HIDDEN: 'hidden',
        SELECTED: 'selected',
        DRAGGING: 'dragging',
        DRAG_OVER: 'drag-over',
        SHOW: 'show',
        ERROR: 'error',
        THREE_COLUMNS: 'three-columns',
        COPIED: 'copied'
    },

    // Hot topics configuration
    HOT_TOPICS: {
        MAX_DISPLAY_COUNT: 5,
        CONTENT_TRUNCATE_LENGTH: 60
    }
};

// Column configuration
const COLUMN_CONFIG = {
    // Column icons mapping (FontAwesome classes)
    ICONS: {
        // Start, Stop, Continue Template Icons
        'start': 'fa-play',
        'stop': 'fa-stop',
        'continue': 'fa-forward',
        // Went Well, To Improve, Ideas Template Icons
        'went-well': 'fa-thumbs-up',
        'to-improve': 'fa-arrows-rotate',
        'ideas': 'fa-lightbulb',
        // 4L Template Icons
        'liked': 'fa-heart',
        'learned': 'fa-book',
        'lacked': 'fa-minus-circle',
        'longed-for': 'fa-star',
        // DAKI Template Icons
        'drop': 'fa-trash',
        'add': 'fa-plus',
        'keep': 'fa-check',
        'improve': 'fa-arrow-up',
        // FLAP Template Icons
        'future-considerations': 'fa-clock',
        'lessons-learned': 'fa-graduation-cap',
        'accomplishments': 'fa-trophy',
        'problems': 'fa-exclamation-triangle',
        // Mountain Climber Template Icons
        'boulders': 'fa-mountain',
        'climbing-equipment': 'fa-tools',
        'inclement-weather': 'fa-cloud-rain',
        'summit': 'fa-flag-checkered'
    },

    // Column display titles
    TITLES: {
        'start': 'Start',
        'stop': 'Stop',
        'continue': 'Continue',
        'went-well': 'What Went Well',
        'to-improve': 'What Could Be Improved',
        'ideas': 'Ideas',
        'liked': 'Liked',
        'learned': 'Learned',
        'lacked': 'Lacked',
        'longed-for': 'Longed For',
        // DAKI Template Titles
        'drop': 'Drop',
        'add': 'Add',
        'keep': 'Keep',
        'improve': 'Improve',
        // FLAP Template Titles
        'future-considerations': 'Future Considerations',
        'lessons-learned': 'Lessons Learned',
        'accomplishments': 'Accomplishments',
        'problems': 'Problems',
        // Mountain Climber Template Titles
        'boulders': 'Boulders',
        'climbing-equipment': 'Climbing Equipment',
        'inclement-weather': 'Inclement Weather',
        'summit': 'The Summit'
    },

    // Column descriptions
    DESCRIPTIONS: {
        'start': 'New practices to adopt',
        'stop': 'Things to stop doing',
        'continue': 'What worked well and should continue',
        'went-well': 'Positive aspects of the project',
        'to-improve': 'Areas that need attention',
        'ideas': 'Suggestions for future improvements',
        'liked': 'Things you enjoyed about the project',
        'learned': 'New insights and knowledge gained',
        'lacked': 'Missing elements that would have helped',
        'longed-for': 'Wishes and desires for the future',
        // DAKI Template Descriptions
        'drop': 'What should we remove from our process?',
        'add': 'What should we add to our process?',
        'keep': 'What should we continue doing?',
        'improve': 'Which areas need improvement?',
        // FLAP Template Descriptions
        'future-considerations': 'What should we consider for the next sprint?',
        'lessons-learned': 'What are our top takeaways from the last sprint?',
        'accomplishments': 'What were the high points of the last sprint?',
        'problems': 'What were the low points of the last sprint?',
        // Mountain Climber Template Descriptions
        'boulders': 'What obstacles did we face during the last sprint?',
        'climbing-equipment': 'What helped us on the climb towards our goal?',
        'inclement-weather': 'What posed a delay, setback, or disruption?',
        'summit': 'Did we reach our sprint goal?'
    }
};

// Template descriptions
const TEMPLATE_DESCRIPTIONS = {
    'start-stop-continue': 'A simple but effective format focusing on actionable changes',
    'went-well-improve-ideas': 'Classic retrospective format highlighting positives and improvements',
    '4l': 'A deeper reflective format examining the team experience',
    'daki': 'A two-by-two grid focusing on what to drop, add, keep, and improve',
    'flap': 'An acronym-based approach examining future considerations, lessons, accomplishments, and problems',
    'mountain-climber': 'A visually engaging template using mountain climbing metaphors to discuss sprint challenges and successes'
};

const DEFAULT_TEMPLATE_DESCRIPTION = 'Retrospective template for team reflection';

// ============================================================================
// UTILITY FUNCTIONS SECTION
// ============================================================================

/**
 * Safely escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML text
 */
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show notification to user
 * @param {string} message - Message to display
 * @param {boolean} isError - Whether this is an error notification
 */
function showNotification(message, isError = false) {
    const notificationElement = document.getElementById('notification');
    if (!notificationElement) return;
    
    notificationElement.textContent = message;
    notificationElement.classList.remove(
        RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN, 
        RETROSPECTIVE_CONFIG.CSS_CLASSES.ERROR, 
        RETROSPECTIVE_CONFIG.CSS_CLASSES.SHOW
    );
    
    if (isError) {
        notificationElement.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.ERROR);
    }
    
    notificationElement.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.SHOW);
    
    setTimeout(() => {
        notificationElement.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.SHOW);
    }, RETROSPECTIVE_CONFIG.TIMEOUTS.NOTIFICATION_DISPLAY);
}

/**
 * Set button loading state
 * @param {HTMLElement} button - Button element
 * @param {boolean} isLoading - Whether to show loading state
 * @param {string} loadingText - Text to show while loading
 * @param {string} originalText - Original button text
 */
function setButtonLoadingState(button, isLoading, loadingText = 'Loading...', originalText = '') {
    if (!button) return;
    
    if (isLoading) {
        button.dataset.originalContent = button.innerHTML;
        button.innerHTML = `<div class="loading-spinner"></div> ${loadingText}`;
        button.disabled = true;
    } else {
        button.innerHTML = originalText || button.dataset.originalContent || button.innerHTML;
        button.disabled = false;
        delete button.dataset.originalContent;
    }
}

/**
 * Reset button state after timeout
 * @param {HTMLElement} button - Button element
 * @param {string} checkText - Text to check if button is still in loading state
 * @param {string} resetText - Text to reset to
 * @param {number} timeout - Timeout in milliseconds
 */
function resetButtonAfterTimeout(button, checkText, resetText, timeout = RETROSPECTIVE_CONFIG.TIMEOUTS.BUTTON_RESET) {
    setTimeout(() => {
        if (button?.innerHTML?.includes(checkText)) {
            button.innerHTML = resetText;
            button.disabled = false;
        }
    }, timeout);
}

/**
 * Check URL parameters for room ID
 * @returns {string|null} Room ID from URL or null
 */
function getRoomIdFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('room');
}

/**
 * Generate shareable room URL
 * @param {string} roomId - Room ID
 * @returns {string} Shareable URL
 */
function generateShareableURL(roomId) {
    const url = new URL(window.location.href);
    // Clear existing parameters
    url.search = '';
    // Add room parameter
    url.searchParams.set('room', roomId);
    return url.toString();
}

/**
 * Format timestamp for display
 * @param {string|Date} timestamp - Timestamp to format
 * @returns {string} Formatted time string
 */
function formatTime(timestamp) {
    return new Date(timestamp).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

/**
 * Copy text to clipboard with visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLElement} button - Button element for visual feedback
 * @param {string} successIcon - Success icon HTML
 * @param {string} originalIcon - Original icon HTML
 * @param {function} notificationCallback - Callback for showing notification
 */
function copyToClipboard(text, button, successIcon, originalIcon, notificationCallback) {
    navigator.clipboard.writeText(text)
        .then(() => {
            if (notificationCallback) {
                notificationCallback('Copied to clipboard!');
            }
            
            if (button) {
                const originalContent = button.innerHTML;
                button.innerHTML = successIcon;
                button.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.COPIED);
                
                setTimeout(() => {
                    button.innerHTML = originalIcon || originalContent;
                    button.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.COPIED);
                }, 2000);
            }
        })
        .catch(err => {
            if (notificationCallback) {
                notificationCallback('Failed to copy', true);
            }
        });
}

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
function truncateText(text, maxLength = RETROSPECTIVE_CONFIG.HOT_TOPICS.CONTENT_TRUNCATE_LENGTH) {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + '...' : text;
}

/**
 * Local Storage utilities for tracking user's stickies
 */
const LocalStorageUtils = {
    STORAGE_KEY: 'retro-board-my-stickies',
    
    /**
     * Get all saved sticky IDs for all rooms
     * @returns {Object} Object with roomId as key and array of stickyIds as value
     */
    getAllMyStickies() {
        try {
            const data = localStorage.getItem(this.STORAGE_KEY);
            return data ? JSON.parse(data) : {};
        } catch (error) {
            console.error('Error reading my stickies from localStorage:', error);
            return {};
        }
    },
    
    /**
     * Get saved sticky IDs for a specific room
     * @param {string} roomId - Room ID
     * @returns {Array} Array of sticky IDs
     */
    getMyStickiesForRoom(roomId) {
        const allStickies = this.getAllMyStickies();
        return allStickies[roomId] || [];
    },
    
    /**
     * Save a sticky ID for a specific room
     * @param {string} roomId - Room ID
     * @param {string} stickyId - Sticky ID to save
     */
    saveMySticky(roomId, stickyId) {
        try {
            const allStickies = this.getAllMyStickies();
            
            if (!allStickies[roomId]) {
                allStickies[roomId] = [];
            }
            
            if (!allStickies[roomId].includes(stickyId)) {
                allStickies[roomId].push(stickyId);
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allStickies));
            }
        } catch (error) {
            console.error('Error saving sticky to localStorage:', error);
        }
    },
    
    /**
     * Remove a sticky ID from a specific room (when deleted)
     * @param {string} roomId - Room ID
     * @param {string} stickyId - Sticky ID to remove
     */
    removeMySticky(roomId, stickyId) {
        try {
            const allStickies = this.getAllMyStickies();
            
            if (allStickies[roomId]) {
                allStickies[roomId] = allStickies[roomId].filter(id => id !== stickyId);
                
                // Clean up empty room entries
                if (allStickies[roomId].length === 0) {
                    delete allStickies[roomId];
                }
                
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allStickies));
            }
        } catch (error) {
            console.error('Error removing sticky from localStorage:', error);
        }
    },
    
    /**
     * Clean up stickies that no longer exist in the room
     * @param {string} roomId - Room ID
     * @param {Array} existingStickyIds - Array of sticky IDs that currently exist
     */
    cleanupStickies(roomId, existingStickyIds) {
        try {
            const myStickies = this.getMyStickiesForRoom(roomId);
            const validStickies = myStickies.filter(id => existingStickyIds.includes(id));
            
            if (validStickies.length !== myStickies.length) {
                const allStickies = this.getAllMyStickies();
                if (validStickies.length === 0) {
                    delete allStickies[roomId];
                } else {
                    allStickies[roomId] = validStickies;
                }
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(allStickies));
            }
        } catch (error) {
            console.error('Error cleaning up stickies in localStorage:', error);
        }
    }
};

// ============================================================================
// HELPER CLASSES SECTION
// ============================================================================

// Hot Topics Manager Class
class HotTopicsManager {
    constructor(hotTopicsListElement, hotTopicsSectionElement) {
        this.hotTopicsList = hotTopicsListElement;
        this.hotTopicsSection = hotTopicsSectionElement;
    }
    
    updateHotTopics() {
        // Collect all sticky notes
        const stickies = [];
        const stickyElements = document.querySelectorAll('.sticky-note');
        
        stickyElements.forEach(element => {
            const id = element.dataset.id;
            const category = element.dataset.category;
            const voteCountElement = element.querySelector('.vote-count');
            const voteCount = voteCountElement ? parseInt(voteCountElement.textContent) || 0 : 0;
            const contentElement = element.querySelector('.sticky-content');
            const content = contentElement ? contentElement.textContent : '';
            
            stickies.push({ id, category, voteCount, content });
        });
        
        // Sort by vote count in descending order
        stickies.sort((a, b) => b.voteCount - a.voteCount);
        
        // Take the top 5
        const topStickies = stickies.slice(0, RETROSPECTIVE_CONFIG.HOT_TOPICS.MAX_DISPLAY_COUNT);
        
        this.renderHotTopics(topStickies);
    }
    
    renderHotTopics(topStickies) {
        // Ensure hot topics section is visible
        this.hotTopicsSection?.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
        
        if (!this.hotTopicsList) {
            console.error('hotTopicsList element not found');
            return;
        }
        
        this.hotTopicsList.innerHTML = '';
        
        // If no sticky notes with votes, show empty message
        if (topStickies.length === 0 || (topStickies.length > 0 && topStickies[0].voteCount === 0)) {
            this.hotTopicsList.innerHTML = '<div class="hot-topics-empty">Vote on sticky notes to see hot topics</div>';
            return;
        }
        
        // Create elements for each hot topic
        topStickies.forEach(sticky => {
            // Skip items with 0 votes
            if (sticky.voteCount === 0) return;
            
            const topicElement = document.createElement('div');
            topicElement.className = 'hot-topic-item';
            topicElement.dataset.id = sticky.id;
            
            const truncatedContent = truncateText(sticky.content);
            const categoryTitle = COLUMN_CONFIG.TITLES[sticky.category] || sticky.category;
            
            topicElement.innerHTML = `
                <div class="hot-topic-votes">${sticky.voteCount}</div>
                <span class="hot-topic-content">${escapeHTML(truncatedContent)}</span>
                <span class="hot-topic-category" data-category="${sticky.category}">${categoryTitle}</span>
            `;
            
            // Add click handler to jump to the sticky note
            topicElement.addEventListener('click', () => this.highlightSticky(sticky.id));
            
            this.hotTopicsList.appendChild(topicElement);
        });
    }
    
    highlightSticky(stickyId) {
        const targetSticky = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
        if (targetSticky) {
            targetSticky.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Add a highlight effect
            targetSticky.style.transform = 'scale(1.05)';
            targetSticky.style.boxShadow = 'var(--shadow-lg)';
            
            setTimeout(() => {
                targetSticky.style.transition = 'transform 0.5s ease, box-shadow 0.5s ease';
                targetSticky.style.transform = '';
                targetSticky.style.boxShadow = '';
            }, 1500);
        }
    }
}

// Drag and Drop Manager Class
class DragDropManager {
    constructor(socket, appState, hotTopicsManager) {
        this.socket = socket;
        this.state = appState;
        this.hotTopicsManager = hotTopicsManager;
    }
    
    initDragAndDrop() {
        const stickyContainers = document.querySelectorAll('.sticky-container');
        
        stickyContainers.forEach(container => {
            container.addEventListener('dragover', (e) => this.handleDragOver(e));
            container.addEventListener('dragenter', (e) => this.handleDragEnter(e));
            container.addEventListener('dragleave', (e) => this.handleDragLeave(e));
            container.addEventListener('drop', (e) => this.handleDrop(e));
        });
    }
    
    setupStickyDragEvents(stickyElement) {
        stickyElement.draggable = true;
        stickyElement.addEventListener('dragstart', (e) => this.handleDragStart(e));
        stickyElement.addEventListener('dragend', (e) => this.handleDragEnd(e));
    }
    
    handleDragStart(e) {
        this.state.currentDraggedSticky = e.target;
        
        e.target.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.DRAGGING);
        
        // Set ghost drag image
        const dragIcon = document.createElement('div');
        dragIcon.className = 'drag-ghost';
        dragIcon.textContent = '📝';
        document.body.appendChild(dragIcon);
        e.dataTransfer.setDragImage(dragIcon, 25, 25);
        
        setTimeout(() => document.body.removeChild(dragIcon), 0);
        
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', e.target.dataset.id);
        
        e.target.style.opacity = '0.6';
    }
    
    handleDragEnd(e) {
        e.target.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.DRAGGING);
        e.target.style.opacity = '1';
        
        this.state.currentDraggedSticky = null;
        
        // Remove drop target highlights from all containers
        document.querySelectorAll('.sticky-container').forEach(container => {
            container.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.DRAG_OVER);
        });
        
        this.hotTopicsManager.updateHotTopics();
    }
    
    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        return false;
    }
    
    handleDragEnter(e) {
        e.target.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.DRAG_OVER);
    }
    
    handleDragLeave(e) {
        e.target.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.DRAG_OVER);
    }
    
    handleDrop(e) {
        e.preventDefault();
        
        const stickyId = e.dataTransfer.getData('text/plain');
        const stickyElement = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
        
        if (stickyElement && e.target.dataset.category) {
            const originalCategory = stickyElement.dataset.category;
            const newCategory = e.target.dataset.category;
            
            if (originalCategory !== newCategory) {
                this.moveSticky(stickyId, newCategory);
            } else {
                e.target.appendChild(stickyElement);
            }
        }
        
        e.target.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.DRAG_OVER);
        return false;
    }
    
    moveSticky(stickyId, newCategory) {
        this.socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.MOVE_STICKY, this.state.currentRoomId, stickyId, newCategory);
        
        const stickyElement = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
        if (stickyElement) {
            stickyElement.dataset.category = newCategory;
            
            const newContainer = document.getElementById(`${newCategory}-container`);
            if (newContainer) {
                newContainer.appendChild(stickyElement);
                
                // Show animation
                stickyElement.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    stickyElement.style.transition = 'transform 0.3s ease';
                    stickyElement.style.transform = 'scale(1)';
                }, 10);
            }
        }
    }
}

// Sticky Note Manager Class
class StickyNoteManager {
    constructor(socket, state, hotTopicsManager) {
        this.socket = socket;
        this.state = state;
        this.hotTopicsManager = hotTopicsManager;
    }
    
    createStickyNote(sticky, dragDropManager) {
        const containerID = `${sticky.category}-container`;
        const container = document.getElementById(containerID);
        
        if (!container) {
            console.error(`Container not found for category ${sticky.category}`);
            return null;
        }
        
        const stickyElement = document.createElement('div');
        stickyElement.className = 'sticky-note';
        stickyElement.dataset.id = sticky.id;
        stickyElement.dataset.category = sticky.category;
        
        // Check if this sticky was created by the current user
        // Either in current session (createdBy matches socket.id) or in previous sessions (saved in localStorage)
        const isMySticky = (sticky.createdBy && sticky.createdBy === this.socket.id) || 
                          (this.state.currentRoomId && LocalStorageUtils.getMyStickiesForRoom(this.state.currentRoomId).includes(sticky.id));
        
        if (isMySticky) {
            stickyElement.classList.add('my-sticky');
            
            // Save to localStorage if it was created in current session
            if (sticky.createdBy && sticky.createdBy === this.socket.id && this.state.currentRoomId) {
                LocalStorageUtils.saveMySticky(this.state.currentRoomId, sticky.id);
            }
        }
        
        const formattedTime = formatTime(sticky.timestamp);
        
        stickyElement.innerHTML = `
            <div class="sticky-content">${escapeHTML(sticky.content)}</div>
            <div class="sticky-footer">
                <span class="sticky-time">${formattedTime}</span>
                <div class="sticky-actions">
                    <button class="vote-btn" data-id="${sticky.id}">
                        <i class="fas fa-thumbs-up"></i>
                        <span class="vote-count">${sticky.votes}</span>
                    </button>
                    <button class="delete-btn" data-id="${sticky.id}" title="Delete note">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
            <div class="drag-handle" title="Drag to move"><i class="fas fa-grip-lines"></i></div>
        `;
        
        // Setup event listeners
        this.setupStickyEvents(stickyElement, sticky.id);
        
        // Setup drag and drop
        if (dragDropManager) {
            dragDropManager.setupStickyDragEvents(stickyElement);
        }
        
        container.appendChild(stickyElement);
        
        // Add entrance animation
        this.animateEntranceSticky(stickyElement);
        
        return stickyElement;
    }
    
    setupStickyEvents(stickyElement, stickyId) {
        // Vote button
        const voteBtn = stickyElement.querySelector('.vote-btn');
        voteBtn.addEventListener('click', () => {
            this.socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.VOTE_STICKY, this.state.currentRoomId, stickyId);
            
            // Optimistic update
            const currentVotes = parseInt(voteBtn.querySelector('.vote-count').textContent) || 0;
            voteBtn.querySelector('.vote-count').textContent = currentVotes + 1;
            
            setTimeout(() => this.hotTopicsManager.updateHotTopics(), RETROSPECTIVE_CONFIG.TIMEOUTS.VOTE_UPDATE_DELAY);
        });
        
        // Delete button
        const deleteBtn = stickyElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => this.deleteSticky(stickyId));
    }
    
    deleteSticky(stickyId) {
        if (confirm('Are you sure you want to delete this note?')) {
            this.socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.DELETE_STICKY, this.state.currentRoomId, stickyId);
            
            // Show pending deletion state
            const stickyElement = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
            if (stickyElement) {
                stickyElement.style.opacity = '0.5';
                stickyElement.style.transform = 'scale(0.95)';
            }
        }
    }
    
    removeSticky(stickyId) {
        const stickyElement = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
        
        if (stickyElement) {
            stickyElement.style.opacity = '0';
            stickyElement.style.transform = 'scale(0.8)';
            
            setTimeout(() => {
                stickyElement.remove();
                
                // Remove from localStorage when deleted
                if (this.state.currentRoomId) {
                    LocalStorageUtils.removeMySticky(this.state.currentRoomId, stickyId);
                }
            }, RETROSPECTIVE_CONFIG.TIMEOUTS.STICKY_REMOVAL_ANIMATION);
        }
    }
    
    /**
     * Clean up localStorage for the current room by removing stickies that no longer exist
     */
    cleanupLocalStorage() {
        if (!this.state.currentRoomId) return;
        
        // Get all existing sticky IDs in the current room
        const existingStickyIds = Array.from(document.querySelectorAll('.sticky-note')).map(element => element.dataset.id);
        
        // Clean up localStorage
        LocalStorageUtils.cleanupStickies(this.state.currentRoomId, existingStickyIds);
    }
    
    updateStickyVotes(stickyId, votes) {
        const stickyElement = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
        if (stickyElement) {
            const voteCount = stickyElement.querySelector('.vote-count');
            if (voteCount) {
                voteCount.textContent = votes;
                
                // Add animation to show the vote change
                voteCount.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    voteCount.style.transition = 'transform 0.3s ease';
                    voteCount.style.transform = 'scale(1)';
                }, 10);
            }
        }
    }
    
    animateEntranceSticky(stickyElement) {
        setTimeout(() => {
            stickyElement.style.opacity = '0';
            stickyElement.style.transform = 'translateY(20px)';
            stickyElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            stickyElement.style.opacity = '1';
            stickyElement.style.transform = 'translateY(0)';
        }, 10);
    }
}

// ============================================================================
// MAIN APPLICATION SECTION
// ============================================================================

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
const activeUsersCount = document.getElementById('active-users-count');
const hotTopicsSection = document.getElementById('hot-topics-section');
const hotTopicsList = document.getElementById('hot-topics-list');

// Share dialog elements
const shareDialog = document.getElementById('share-dialog');
const closeShareDialogBtn = document.getElementById('close-share-dialog');
const shareLinkInput = document.getElementById('share-link');
const copyShareLinkBtn = document.getElementById('copy-share-link-btn');

// Application state
const appState = {
    currentRoomId: null,
    currentTemplate: null,
    availableTemplates: {},
    selectedTemplateId: null,
    currentDraggedSticky: null
};

// Initialize manager classes
const hotTopicsManager = new HotTopicsManager(hotTopicsList, hotTopicsSection);
const dragDropManager = new DragDropManager(socket, appState, hotTopicsManager);
const stickyNoteManager = new StickyNoteManager(socket, appState, hotTopicsManager);

// ============================================================================
// EVENT LISTENERS
// ============================================================================

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

// ============================================================================
// CORE APPLICATION FUNCTIONS
// ============================================================================

// Initialize app
function init() {
    checkURLParams();
    
    // Add unload event handler to handle user leaving the page
    window.addEventListener('beforeunload', handlePageUnload);
}

// Handle page unload to notify server that user is leaving
function handlePageUnload() {
    if (appState.currentRoomId) {
        socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.LEAVE_ROOM, appState.currentRoomId);
    }
}

// Function to update column layout class based on number of columns
function updateColumnsLayout() {
    const columns = columnsContainer.querySelectorAll('.column');
    
    if (columns.length === 3) {
        columnsContainer.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.THREE_COLUMNS);
    } else {
        columnsContainer.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.THREE_COLUMNS);
    }
}

function showTemplateSelection() {
    welcomeSection.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    templateSelectionSection.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
}

function selectTemplate(templateId) {
    if (appState.selectedTemplateId) {
        const prevSelected = document.querySelector(`.template-card[data-template-id="${appState.selectedTemplateId}"]`);
        if (prevSelected) prevSelected.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.SELECTED);
    }
    
    appState.selectedTemplateId = templateId;
    const templateCard = document.querySelector(`.template-card[data-template-id="${templateId}"]`);
    if (templateCard) templateCard.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.SELECTED);
    
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
        createRoomBtn.addEventListener('click', () => createRoom(appState.selectedTemplateId));
    }
}

function createRoom(templateId) {
    if (!templateId) {
        showNotification('Please select a template', true);
        return;
    }
    
    const createRoomBtn = document.querySelector('#create-room-btn');
    setButtonLoadingState(createRoomBtn, true, 'Creating...');
    
    socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.CREATE_ROOM, templateId);
    
    // Reset button after timeout
    resetButtonAfterTimeout(createRoomBtn, 'Creating', '<i class="fas fa-plus-circle"></i> Create Room with Template');
}

function joinRoom() {
    const roomId = roomIdInput.value.trim();
    if (!roomId) {
        showNotification('Please enter a room ID', true);
        return;
    }
    
    setButtonLoadingState(joinRoomBtn, true, 'Joining...');
    
    socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.JOIN_ROOM, roomId);
    
    // Reset button after timeout
    resetButtonAfterTimeout(joinRoomBtn, 'Joining', '<i class="fas fa-sign-in-alt"></i> Join Room');
}

function copyRoomId() {
    if (!appState.currentRoomId) return;
    
    copyToClipboard(
        appState.currentRoomId,
        copyRoomBtn,
        '<i class="fas fa-check"></i> Copied!',
        '<i class="fas fa-copy"></i> Copy',
        showNotification
    );
}

function openShareDialog() {
    if (!appState.currentRoomId) return;
    
    const shareableURL = generateShareableURL(appState.currentRoomId);
    shareLinkInput.value = shareableURL;
    
    shareDialog.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.SHOW);
    
    // Select the link text for easy copying
    setTimeout(() => shareLinkInput.select(), 100);
}

function closeShareDialog() {
    shareDialog.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.SHOW);
}

function copyShareLink() {
    const link = shareLinkInput.value;
    
    copyToClipboard(
        link,
        copyShareLinkBtn,
        '<i class="fas fa-check"></i>',
        '<i class="fas fa-copy"></i>',
        (message) => showNotification('Shareable link copied to clipboard!')
    );
}

function openAddStickyModal() {
    addStickyModal.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    stickyContent.focus();
}

function closeAddStickyModal() {
    addStickyModal.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    stickyContent.value = '';
}

function submitSticky() {
    const content = stickyContent.value.trim();
    const category = stickyCategory.value;
    
    if (!content) {
        showNotification('Please enter content for your note', true);
        return;
    }
    
    if (!appState.currentRoomId) {
        showNotification('You are not in a room', true);
        return;
    }
    
    setButtonLoadingState(submitStickyBtn, true, 'Adding...');
    
    socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.ADD_STICKY, appState.currentRoomId, content, category);
    
    // Reset button after timeout
    setTimeout(() => {
        if (submitStickyBtn.disabled) {
            setButtonLoadingState(submitStickyBtn, false, '', '<i class="fas fa-paper-plane"></i> Add Note');
        }
    }, RETROSPECTIVE_CONFIG.TIMEOUTS.STICKY_SUBMISSION_RESET);
}

function renderTemplates(templates) {
    appState.availableTemplates = templates;
    templatesContainer.innerHTML = '';
    
    Object.entries(templates).forEach(([id, template]) => {
        const templateCard = document.createElement('div');
        templateCard.className = 'template-card';
        templateCard.dataset.templateId = id;
        
        let previewColumns = '';
        template.columns.forEach(column => {
            previewColumns += `<div class="preview-column"></div>`;
        });
        
        const templateDescription = TEMPLATE_DESCRIPTIONS[id] || DEFAULT_TEMPLATE_DESCRIPTION;
        
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
    if (!appState.availableTemplates[templateId]) return;
    
    appState.currentTemplate = templateId;
    const template = appState.availableTemplates[templateId];
    columnsContainer.innerHTML = '';
    
    template.columns.forEach(columnId => {
        const column = document.createElement('div');
        column.className = 'column';
        column.dataset.category = columnId;
        
        const iconClass = COLUMN_CONFIG.ICONS[columnId] || 'fa-sticky-note';
        const columnTitle = COLUMN_CONFIG.TITLES[columnId] || columnId;
        const columnDescription = COLUMN_CONFIG.DESCRIPTIONS[columnId] || '';
        
        column.innerHTML = `
            <h3><i class="fas ${iconClass}"></i> ${columnTitle}</h3>
            ${columnDescription ? `<p class="column-description">${columnDescription}</p>` : ''}
            <div class="sticky-container" id="${columnId}-container" data-category="${columnId}"></div>
        `;
        
        columnsContainer.appendChild(column);
    });
    
    // Initialize drag and drop for all sticky containers
    dragDropManager.initDragAndDrop();
    
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
        option.textContent = COLUMN_CONFIG.TITLES[categoryId] || categoryId;
        stickyCategory.appendChild(option);
    });
}

function enterRoom(roomId, roomData) {
    appState.currentRoomId = roomId;
    currentRoomIdSpan.textContent = roomId;
    
    // Reset button states
    setButtonLoadingState(joinRoomBtn, false, '', '<i class="fas fa-sign-in-alt"></i> Join Room');
    
    const createRoomBtn = document.querySelector('#create-room-btn');
    if (createRoomBtn) {
        setButtonLoadingState(createRoomBtn, false, '', '<i class="fas fa-plus-circle"></i> Create Room with Template');
    }
    
    // Switch UI elements
    welcomeSection.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    templateSelectionSection.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    roomInfo.classList.add(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    activeRoomSection.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    retrospectiveBoard.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    hotTopicsSection.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    
    // Show the floating Add Note button
    addStickyBtn.classList.remove(RETROSPECTIVE_CONFIG.CSS_CLASSES.HIDDEN);
    
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
    
    // Clean up localStorage after all stickies are loaded
    setTimeout(() => {
        stickyNoteManager.cleanupLocalStorage();
        hotTopicsManager.updateHotTopics();
    }, RETROSPECTIVE_CONFIG.TIMEOUTS.HOT_TOPICS_UPDATE_DELAY);
    
    showNotification(`Joined room: ${roomId}`);
}

function addStickyToBoard(sticky) {
    // Reset submit button if it was in loading state
    if (submitStickyBtn.disabled) {
        setButtonLoadingState(submitStickyBtn, false, '', '<i class="fas fa-paper-plane"></i> Add Note');
        closeAddStickyModal();
    }
    
    stickyNoteManager.createStickyNote(sticky, dragDropManager);
}

function updateActiveUsersCount(count) {
    activeUsersCount.textContent = count;
    
    // Add animation to highlight the change
    activeUsersCount.style.transform = 'scale(1.2)';
    setTimeout(() => {
        activeUsersCount.style.transition = 'transform 0.3s ease';
        activeUsersCount.style.transform = 'scale(1)';
    }, 10);
}

// Add this function to check for room ID in URL parameters
function checkURLParams() {
    const roomId = getRoomIdFromURL();
    
    if (roomId) {
        roomIdInput.value = roomId;
        // Auto join if room ID is in URL
        joinRoom();
    }
}

// ============================================================================
// SOCKET EVENT HANDLERS
// ============================================================================

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.AVAILABLE_TEMPLATES, (templates) => {
    renderTemplates(templates);
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.ROOM_CREATED, (roomId) => {
    roomIdInput.value = roomId;
    socket.emit(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.JOIN_ROOM, roomId);
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.ROOM_JOINED, (roomId, roomData) => {
    enterRoom(roomId, roomData);
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.ACTIVE_USERS_UPDATED, (count) => {
    updateActiveUsersCount(count);
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.STICKY_ADDED, (sticky) => {
    addStickyToBoard(sticky);
    showNotification('New sticky note added!');
    hotTopicsManager.updateHotTopics();
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.STICKY_VOTED, (stickyId, votes) => {
    stickyNoteManager.updateStickyVotes(stickyId, votes);
    hotTopicsManager.updateHotTopics();
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.STICKY_DELETED, (stickyId) => {
    stickyNoteManager.removeSticky(stickyId);
    showNotification('Note has been deleted');
    setTimeout(() => hotTopicsManager.updateHotTopics(), RETROSPECTIVE_CONFIG.TIMEOUTS.HOT_TOPICS_UPDATE_AFTER_DELETE);
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.STICKY_MOVED, (stickyId, newCategory) => {
    // Update the UI to reflect the move
    const stickyElement = document.querySelector(`.sticky-note[data-id="${stickyId}"]`);
    if (stickyElement) {
        // Update the data attribute
        stickyElement.dataset.category = newCategory;
        
        // Find the correct container
        const newContainer = document.getElementById(`${newCategory}-container`);
        if (newContainer && !newContainer.contains(stickyElement)) {
            // If the sticky isn't already in the container, move it
            newContainer.appendChild(stickyElement);
            
            // Show a notification
            showNotification('Sticky note moved to a different column');
            
            // Update hot topics after a category change
            hotTopicsManager.updateHotTopics();
        }
    }
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.CONNECT, () => {
    init();
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.ERROR, (errorMessage) => {
    showNotification(errorMessage, true);
    
    // Reset button states
    setButtonLoadingState(joinRoomBtn, false, '', '<i class="fas fa-sign-in-alt"></i> Join Room');
    
    const createRoomBtn = document.querySelector('#create-room-btn');
    if (createRoomBtn) {
        setButtonLoadingState(createRoomBtn, false, '', '<i class="fas fa-plus-circle"></i> Create Room with Template');
    }
    
    if (submitStickyBtn.disabled) {
        setButtonLoadingState(submitStickyBtn, false, '', '<i class="fas fa-paper-plane"></i> Add Note');
    }
});

socket.on(RETROSPECTIVE_CONFIG.SOCKET_EVENTS.DISCONNECT, () => {
    showNotification('Connection lost. Please refresh the page.', true);
});