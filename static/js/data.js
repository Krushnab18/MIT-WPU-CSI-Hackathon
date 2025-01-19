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

    $('#summarize-btn').on('click', function() {
        const startDate = $('#start-date-btn').text();
        const endDate = $('#end-date-btn').text();
        
        // Hide previous content and errors
        $('#error-message').hide();
        $('#summary-content').hide();

        // Check if both dates are selected
        if (startDate === 'Select Start Date' || endDate === 'Select End Date') {
            $('#error-message').text('Please select both start and end dates').show();
            return;
        }

        // Convert dates for comparison
        const start = moment(startDate, 'DD-MM-YYYY');
        const end = moment(endDate, 'DD-MM-YYYY');

        // Validate date range
        if (end.isBefore(start)) {
            $('#error-message').text('End date cannot be earlier than start date').show();
            return;
        }

        // Fetch and display content from sum.txt
        fetch('/static/sum.txt')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to load summary content');
                }
                return response.text();
            })
            .then(content => {
                $('#summary-content').html(content).show();
            })
            .catch(error => {
                $('#error-message').text('Error loading summary content: ' + error.message).show();
            });
    });
});