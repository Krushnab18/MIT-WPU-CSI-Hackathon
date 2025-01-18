document.addEventListener('DOMContentLoaded', () => {
    $('#start-calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true,
        height: 'auto',
        titleFormat: 'Start Date',
        dayClick: function(date) {
            $('#start-date-btn').text(`Start Date: ${date.format()}`);
            $('#start-calendar-popup').hide();
        }
    });

    $('#end-calendar').fullCalendar({
        header: {
            left: 'prev,next today',
            center: 'title',
            right: 'month,agendaWeek,agendaDay'
        },
        editable: true,
        droppable: true,
        height: 'auto',
        titleFormat: 'End Date',
        dayClick: function(date) {
            $('#end-date-btn').text(`End Date: ${date.format()}`);
            $('#end-calendar-popup').hide();
        }
    });

    $('#start-date-btn').on('click', () => {
        $('#start-calendar-popup').toggle();
    });

    $('#end-date-btn').on('click', () => {
        $('#end-calendar-popup').toggle();
    });

    $('#summarize-btn').on('click', () => {
        const startDate = $('#start-date-btn').text().replace('Start Date: ', '');
        const endDate = $('#end-date-btn').text().replace('End Date: ', '');
        alert(`Summarizing data from ${startDate} to ${endDate}`);
    });
});
