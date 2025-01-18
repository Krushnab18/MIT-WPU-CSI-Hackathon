$(document).ready(function() {
    var startPicker = new Pikaday({
        field: document.getElementById('start-calendar'),
        format: 'DD-MM-YYYY',
        onSelect: function() {
            $('#start-date-btn').text(this.getMoment().format('DD-MM-YYYY'));
            $('#start-calendar-popup').hide();
        }
    });

    var endPicker = new Pikaday({
        field: document.getElementById('end-calendar'),
        format: 'DD-MM-YYYY',
        onSelect: function() {
            $('#end-date-btn').text(this.getMoment().format('DD-MM-YYYY'));
            $('#end-calendar-popup').hide();
        }
    });

    $('#start-date-btn').on('click', function() {
        if (!$('#start-calendar').val()) {
            startPicker.setDate(new Date());
        }
        $('#start-calendar-popup').show();
        startPicker.show();
    });

    $('#end-date-btn').on('click', function() {
        if (!$('#end-calendar').val()) {
            endPicker.setDate(new Date());
        }
        $('#end-calendar-popup').show();
        endPicker.show();
    });

    $('#summarize-btn').on('click', () => {
        const startDate = $('#start-date-btn').text();
        const endDate = $('#end-date-btn').text();
        alert(`Summarizing data from ${startDate} to ${endDate}`);
    });
});
