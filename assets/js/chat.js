document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Initialiser les composants
    initializeChat();
    loadConversations();

    // Websocket pour les messages en temps réel
    initializeWebSocket();
});

// Initialisation du chat
function initializeChat() {
    const messageForm = document.getElementById('messageForm');
    const newMessageBtn = document.querySelector('.new-message-btn');
    const modal = document.getElementById('newMessageModal');
    const closeModal = document.querySelector('.close-modal');
    const searchInput = document.querySelector('.search-input');

    // Gérer l'envoi des messages
    messageForm.addEventListener('submit', handleMessageSubmit);

    // Gérer le nouveau message
    newMessageBtn.addEventListener('click', () => {
        modal.classList.remove('hidden');
        loadContacts();
    });

    // Fermer la modal
    closeModal.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Recherche de conversations
    searchInput.addEventListener('input', debounce(handleSearch, 300));
}

// Charger les conversations
async function loadConversations() {
    try {
        const response = await fetch('http://localhost:5000/api/conversations', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const conversations = await response.json();
        
        const conversationsList = document.querySelector('.conversations-list');
        conversationsList.innerHTML = conversations.map(conv => `
            <div class="conversation-item" data-id="${conv._id}">
                <img src="${conv.participant.profilePhoto || 'assets/img/default-avatar.png'}" 
                     alt="${conv.participant.fullName}">
                <div class="conversation-info">
                    <div class="conversation-name">${conv.participant.fullName}</div>
                    <div class="conversation-preview">${conv.lastMessage || 'Aucun message'}</div>
                </div>
                <div class="conversation-meta">
                    <div class="conversation-time">${formatDate(conv.updatedAt)}</div>
                    ${conv.unreadCount ? `<div class="unread-badge">${conv.unreadCount}</div>` : ''}
                </div>
            </div>
        `).join('');

        // Ajouter les événements click
        document.querySelectorAll('.conversation-item').forEach(item => {
            item.addEventListener('click', () => loadMessages(item.dataset.id));
        });
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des conversations', 'error');
    }
}

// Charger les messages d'une conversation
async function loadMessages(conversationId) {
    try {
        const response = await fetch(`http://localhost:5000/api/conversations/${conversationId}/messages`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const data = await response.json();
        
        // Mettre à jour l'en-tête du chat
        document.getElementById('currentChatName').textContent = data.participant.fullName;
        document.getElementById('currentChatStatus').textContent = 
            data.participant.isOnline ? 'En ligne' : 'Hors ligne';

        // Afficher les messages
        const messagesContainer = document.querySelector('.chat-messages');
        messagesContainer.innerHTML = data.messages.map(msg => `
            <div class="message ${msg.isSent ? 'sent' : 'received'}">
                <img src="${msg.sender.profilePhoto || 'assets/img/default-avatar.png'}" 
                     alt="${msg.sender.fullName}" 
                     class="w-8 h-8 rounded-full">
                <div class="message-content">
                    <div class="message-text">${msg.content}</div>
                    <div class="message-time">${formatDate(msg.createdAt)}</div>
                </div>
            </div>
        `).join('');

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors du chargement des messages', 'error');
    }
}

// Gérer l'envoi d'un message
async function handleMessageSubmit(e) {
    e.preventDefault();
    const input = e.target.querySelector('.message-input');
    const message = input.value.trim();
    
    if (!message) return;

    try {
        const conversationId = getCurrentConversationId();
        const response = await fetch(`http://localhost:5000/api/conversations/${conversationId}/messages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ content: message })
        });

        if (response.ok) {
            input.value = '';
            // Le nouveau message sera ajouté via WebSocket
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'envoi du message', 'error');
    }
}

// WebSocket pour les messages en temps réel
function initializeWebSocket() {
    const ws = new WebSocket('ws://localhost:5000');

    ws.onmessage = function(event) {
        const data = JSON.parse(event.data);
        
        if (data.type === 'message') {
            // Ajouter le nouveau message s'il appartient à la conversation actuelle
            if (data.conversationId === getCurrentConversationId()) {
                appendMessage(data.message);
            }
            // Mettre à jour la liste des conversations
            loadConversations();
        }
    };

    ws.onerror = function(error) {
        console.error('WebSocket error:', error);
    };
}

// Fonctions utilitaires
function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function getCurrentConversationId() {
    const activeConversation = document.querySelector('.conversation-item.active');
    return activeConversation ? activeConversation.dataset.id : null;
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const conversations = document.querySelectorAll('.conversation-item');
    
    conversations.forEach(conv => {
        const name = conv.querySelector('.conversation-name').textContent.toLowerCase();
        conv.style.display = name.includes(searchTerm) ? 'flex' : 'none';
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function appendMessage(message) {
    const messagesContainer = document.querySelector('.chat-messages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${message.isSent ? 'sent' : 'received'}`;
    messageElement.innerHTML = `
        <img src="${message.sender.profilePhoto || 'assets/img/default-avatar.png'}" 
             alt="${message.sender.fullName}" 
             class="w-8 h-8 rounded-full">
        <div class="message-content">
            <div class="message-text">${message.content}</div>
            <div class="message-time">${formatDate(message.createdAt)}</div>
        </div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
} 