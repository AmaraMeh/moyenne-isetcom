document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Initialiser les composants
    initializeNotifications();
    initializeCalendar();
    loadGrades();
    loadUpcomingEvents();

    // Mettre à jour le nom d'utilisateur
    updateUserInfo();
});

// Gestion des notifications
function initializeNotifications() {
    const notifButton = document.getElementById('notificationButton');
    const notifDropdown = document.querySelector('.notification-dropdown');
    const markAllRead = document.querySelector('.mark-all-read');

    // Toggle dropdown
    notifButton.addEventListener('click', () => {
        notifDropdown.classList.toggle('hidden');
        loadNotifications();
    });

    // Fermer le dropdown en cliquant ailleurs
    document.addEventListener('click', (e) => {
        if (!notifButton.contains(e.target)) {
            notifDropdown.classList.add('hidden');
        }
    });

    // Marquer toutes les notifications comme lues
    markAllRead.addEventListener('click', async () => {
        try {
            await fetch('http://localhost:5000/api/notifications/mark-all-read', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            loadNotifications();
            updateNotificationBadge(0);
        } catch (error) {
            console.error('Erreur:', error);
        }
    });
}

// Charger les notifications
async function loadNotifications() {
    const notifList = document.querySelector('.notification-list');
    try {
        const response = await fetch('http://localhost:5000/api/notifications', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const notifications = await response.json();
        
        notifList.innerHTML = notifications.map(notif => `
            <div class="notification-item ${notif.read ? '' : 'unread'}">
                <div class="flex items-center">
                    <i class="fas ${getNotificationIcon(notif.type)} mr-3 text-blue-500"></i>
                    <div>
                        <p class="font-medium">${notif.title}</p>
                        <p class="text-sm text-gray-600">${notif.message}</p>
                        <span class="text-xs text-gray-500">${formatDate(notif.date)}</span>
                    </div>
                </div>
            </div>
        `).join('');

        updateNotificationBadge(notifications.filter(n => !n.read).length);
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Initialiser le calendrier
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        locale: 'fr',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: fetchCalendarEvents,
        eventClick: function(info) {
            // Afficher les détails de l'événement
            showEventDetails(info.event);
        }
    });
    calendar.render();
}

// Charger les notes
async function loadGrades() {
    try {
        const response = await fetch('http://localhost:5000/api/grades', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const grades = await response.json();
        
        const tbody = document.getElementById('gradesTableBody');
        tbody.innerHTML = grades.map(grade => `
            <tr>
                <td>${grade.module}</td>
                <td>${grade.coefficient}</td>
                <td>${grade.cc || '-'}</td>
                <td>${grade.exam || '-'}</td>
                <td class="font-medium">${grade.average}</td>
                <td>
                    <span class="status-badge status-${getStatusClass(grade.status)}">
                        ${grade.status}
                    </span>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Charger les événements à venir
async function loadUpcomingEvents() {
    try {
        const response = await fetch('http://localhost:5000/api/events/upcoming', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const events = await response.json();
        
        const container = document.getElementById('upcomingEvents');
        container.innerHTML = events.map(event => `
            <div class="event-item ${event.type}">
                <div class="flex justify-between items-start">
                    <div>
                        <h3 class="font-medium">${event.title}</h3>
                        <p class="text-sm text-gray-600">${event.description}</p>
                    </div>
                    <span class="text-sm text-gray-500">${formatDate(event.date)}</span>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonctions utilitaires
function getNotificationIcon(type) {
    const icons = {
        exam: 'fa-file-alt',
        course: 'fa-book',
        deadline: 'fa-clock',
        grade: 'fa-star',
        default: 'fa-bell'
    };
    return icons[type] || icons.default;
}

function getStatusClass(status) {
    const statusMap = {
        'Validé': 'validated',
        'En attente': 'pending',
        'Non validé': 'failed'
    };
    return statusMap[status] || 'pending';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    }).format(date);
}

function updateNotificationBadge(count) {
    const badge = document.querySelector('.notification-badge');
    badge.textContent = count;
    badge.style.display = count > 0 ? 'block' : 'none';
}

async function updateUserInfo() {
    try {
        const response = await fetch('http://localhost:5000/api/user/info', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const user = await response.json();
        document.getElementById('userName').textContent = user.fullName;
    } catch (error) {
        console.error('Erreur:', error);
    }
}

function showEventDetails(event) {
    // Implémenter l'affichage des détails de l'événement
    // Par exemple, dans une modale
}

async function fetchCalendarEvents(info, successCallback, failureCallback) {
    try {
        const response = await fetch(`http://localhost:5000/api/events?start=${info.startStr}&end=${info.endStr}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const events = await response.json();
        successCallback(events);
    } catch (error) {
        failureCallback(error);
    }
} 