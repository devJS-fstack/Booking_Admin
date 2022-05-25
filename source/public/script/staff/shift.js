const idStore = location.href.split('?idStore=')[1];

var calendarEl = document.getElementById('calendar');
var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay'
    },
    events: [],
});


regisShift.forEach(obj => {
    addEvent({
        title: `${obj.SurName} ${obj.NameStaff}`,
        start: `${obj.DateRegis}`,
    })
})

function addEvent(data) {
    calendar.addEvent(data);
    calendar.render();
}
