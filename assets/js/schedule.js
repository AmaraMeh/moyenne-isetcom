document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    const token = localStorage.getItem('token');
    if (!token) {
        window.location.href = 'login.html';
        return;
    }

    // Initialiser le calendrier
    initializeCalendar();
    
    // Initialiser les composants
    initializeViewButtons();
    initializeFilters();
    initializeGoogleSync();
    initializeExport();
    
    // Charger les données initiales
    loadScheduleData();
});

// Initialisation du calendrier
function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'timeGridWeek',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'timeGridDay,timeGridWeek,dayGridMonth,listWeek'
        },
        locale: 'fr',
        allDaySlot: false,
        slotMinTime: '08:00:00',
        slotMaxTime: '19:00:00',
        slotDuration: '00:30:00',
        height: 'auto',
        expandRows: true,
        stickyHeaderDates: true,
        nowIndicator: true,
        weekNumbers: true,
        weekNumberCalculation: 'ISO',
        events: fetchEvents,
        eventClick: handleEventClick,
        eventDidMount: function(info) {
            // Ajouter des tooltips
            tippy(info.el, {
                content: `${info.event.title}<br>${info.event.extendedProps.teacher}<br>${info.event.extendedProps.room}`,
                allowHTML: true,
            });
        },
        datesSet: function(info) {
            checkForChanges(info.start, info.end);
        }
    });
    
    calendar.render();
    window.calendar = calendar;
}

// Charger les événements
async function fetchEvents(info, successCallback, failureCallback) {
    try {
        const response = await fetch(`http://localhost:5000/api/schedule?start=${info.startStr}&end=${info.endStr}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const events = await response.json();
        
        // Transformer les événements pour FullCalendar
        const formattedEvents = events.map(event => ({
            id: event._id,
            title: event.module,
            start: event.startTime,
            end: event.endTime,
            backgroundColor: getEventColor(event.type),
            borderColor: getEventColor(event.type),
            extendedProps: {
                type: event.type,
                teacher: event.teacher,
                room: event.room,
                description: event.description
            }
        }));
        
        successCallback(formattedEvents);
    } catch (error) {
        console.error('Erreur:', error);
        failureCallback(error);
    }
}

// Gérer le clic sur un événement
function handleEventClick(info) {
    const event = info.event;
    const modal = document.getElementById('eventModal');
    
    // Remplir les détails
    document.getElementById('eventModule').textContent = event.title;
    document.getElementById('eventTeacher').textContent = event.extendedProps.teacher;
    document.getElementById('eventRoom').textContent = event.extendedProps.room;
    document.getElementById('eventType').textContent = event.extendedProps.type;
    document.getElementById('eventTime').textContent = `${formatTime(event.start)} - ${formatTime(event.end)}`;
    document.getElementById('eventDescription').textContent = event.extendedProps.description || 'Aucune description';
    
    // Afficher la modal
    modal.classList.remove('hidden');
    
    // Gérer le bouton Google Calendar
    const addToGoogleBtn = document.getElementById('addToGoogleBtn');
    addToGoogleBtn.onclick = () => addToGoogleCalendar(event);
    
    // Gérer le bouton de partage
    const shareBtn = document.getElementById('shareBtn');
    shareBtn.onclick = () => shareEvent(event);
}

// Synchronisation avec Google Calendar
async function initializeGoogleSync() {
    const syncBtn = document.getElementById('syncGoogleBtn');
    syncBtn.addEventListener('click', async () => {
        try {
            await gapi.client.init({
                apiKey: 'YOUR_API_KEY',
                clientId: 'YOUR_CLIENT_ID',
                discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
                scope: 'https://www.googleapis.com/auth/calendar.events'
            });

            await gapi.auth2.getAuthInstance().signIn();
            await syncWithGoogle();
            showNotification('Synchronisation réussie avec Google Calendar', 'success');
        } catch (error) {
            console.error('Erreur de synchronisation:', error);
            showNotification('Erreur lors de la synchronisation', 'error');
        }
    });
}

// Exporter l'emploi du temps
function initializeExport() {
    const exportBtn = document.getElementById('exportBtn');
    exportBtn.addEventListener('click', () => {
        const format = prompt('Choisissez le format d\'export (ics/pdf):', 'ics');
        if (format) {
            exportSchedule(format.toLowerCase());
        }
    });
}

// Vérifier les changements
async function checkForChanges(start, end) {
    try {
        const response = await fetch(`http://localhost:5000/api/schedule/changes?start=${start.toISOString()}&end=${end.toISOString()}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        const changes = await response.json();
        
        if (changes.length > 0) {
            showChangesNotification(changes);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonctions utilitaires
function getEventColor(type) {
    const colors = {
        cours: '#3b82f6',
        tp: '#10b981',
        td: '#f59e0b',
        exam: '#ef4444',
        event: '#8b5cf6'
    };
    return colors[type] || '#64748b';
}

function formatTime(date) {
    return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
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

async function exportSchedule(format) {
    try {
        const response = await fetch(`http://localhost:5000/api/schedule/export?format=${format}`, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });
        
        if (format === 'pdf') {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `emploi-du-temps.${format}`;
            a.click();
        } else {
            const text = await response.text();
            const blob = new Blob([text], { type: 'text/calendar' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `emploi-du-temps.${format}`;
            a.click();
        }
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'export', 'error');
    }
}

async function addToGoogleCalendar(event) {
    try {
        const eventDetails = {
            summary: event.title,
            location: event.extendedProps.room,
            description: event.extendedProps.description,
            start: {
                dateTime: event.start.toISOString()
            },
            end: {
                dateTime: event.end.toISOString()
            }
        };

        await gapi.client.calendar.events.insert({
            calendarId: 'primary',
            resource: eventDetails
        });

        showNotification('Événement ajouté à Google Calendar', 'success');
    } catch (error) {
        console.error('Erreur:', error);
        showNotification('Erreur lors de l\'ajout à Google Calendar', 'error');
    }
}

function shareEvent(event) {
    const text = `
        ${event.title}
        ${event.extendedProps.type}
        Prof: ${event.extendedProps.teacher}
        Salle: ${event.extendedProps.room}
        Horaire: ${formatTime(event.start)} - ${formatTime(event.end)}
    `;

    if (navigator.share) {
        navigator.share({
            title: 'Détails du cours',
            text: text
        });
    } else {
        navigator.clipboard.writeText(text);
        showNotification('Détails copiés dans le presse-papier', 'success');
    }
} 