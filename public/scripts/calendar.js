let currentStartTime = '';
let currentEndTime = '';
let minEndTime = '';
let currentDay = '';
let currentSlotColor = '';
let segments = [];

function openEventModal(day, endTime) {
    const [h, m] = endTime.split(':').map(Number);

    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() - 30);

    const startTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    currentStartTime = startTime;
    currentEndTime = endTime;
    minEndTime = endTime;
    currentDay = day;

    const color = window.getComputedStyle(event.target).backgroundColor;
    currentSlotColor = color;

    document.getElementById('modal-start').textContent = startTime;
    document.getElementById('modal-end').textContent = endTime;

    document.getElementById('modal').style.display = 'block';
}

function increaseEndTime() {
    const [h, m] = currentEndTime.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    if(currentEndTime != '23:30')
        date.setMinutes(date.getMinutes() + 30);

    currentEndTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    document.getElementById('modal-end').textContent = currentEndTime;
}

function decreaseEndTime() {
    const [minH, minM] = minEndTime.split(':').map(Number);
    const [currH, currM] = currentEndTime.split(':').map(Number);

    if (currH === minH && currM === minM) {
        return;
    }

    const date = new Date(0, 0, 0, currH, currM);
    date.setMinutes(date.getMinutes() - 30);

    currentEndTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    document.getElementById('modal-end').textContent = currentEndTime;
}

function confirmSegment() {
    const table = document.querySelector('.calendar');
    const headerRow = table.querySelector('thead tr');
    const dayIndex = Array.from(headerRow.querySelectorAll('th')).findIndex(
        th => th.textContent.trim() === currentDay
    );

    if (dayIndex === -1) return;

    const segmentId = Date.now();
    
    segments.push({
        id: segmentId,
        day: currentDay,
        dayIndex: dayIndex,
        startTime: currentStartTime,
        endTime: currentEndTime,
        color: currentSlotColor
    });

    const [startH, startM] = currentStartTime.split(':').map(Number);
    const [endH, endM] = currentEndTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    const rows = table.querySelectorAll('tbody tr');
    let firstButton = null;

    rows.forEach(row => {
        const timeCell = row.querySelector('.time');
        if (! timeCell) return;

        const timeText = timeCell.textContent.trim();
        const [h, m] = timeText.split(':').map(Number);
        const rowMinutes = h * 60 + m;

        if (rowMinutes >= startMinutes && rowMinutes < endMinutes) {
            const cell = row.querySelectorAll('td')[dayIndex];
            if (cell) {
                const button = cell.querySelector('button');
                if (button) {
                    button.style.backgroundColor = currentSlotColor;
                    button.innerHTML = '';
                    button.disabled = true;
                    button.dataset.segmentId = segmentId;
                    button.style.cursor = 'default';
                    
                    // Zapamiętaj pierwszy przycisk
                    if (! firstButton) {
                        firstButton = button;
                    }
                }
            }
        }
    });

    // Dodaj X TYLKO na PIERWSZY przycisk segmentu
    if (firstButton) {
        const closeBtn = document.createElement('span');
        closeBtn.className = 'segment-delete-btn';
        closeBtn.innerHTML = '×';
        closeBtn.style.cursor = 'pointer';
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            deleteSegment(segmentId);
        };
        firstButton.appendChild(closeBtn);
    }

    closeModal();
}

function deleteSegment(segmentId) {
    const segment = segments.find(s => s.id === segmentId);
    if (! segment) return;

    if (! confirm(`Delete segment ${segment.startTime} - ${segment.endTime}?`)) {
        return;
    }

    segments = segments.filter(s => s.id !== segmentId);

    const table = document.querySelector('.calendar');
    const rows = table.querySelectorAll('tbody tr');

    const [startH, startM] = segment.startTime.split(':').map(Number);
    const [endH, endM] = segment.endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;

    rows.forEach(row => {
        const timeCell = row.querySelector('.time');
        if (!timeCell) return;

        const timeText = timeCell.textContent.trim();
        const [h, m] = timeText.split(':').map(Number);
        const rowMinutes = h * 60 + m;

        if (rowMinutes >= startMinutes && rowMinutes < endMinutes) {
            const cell = row.querySelectorAll('td')[segment.dayIndex];
            if (cell) {
                const btn = cell.querySelector('button');
                if (btn && btn.dataset.segmentId === String(segmentId)) {
                    btn.style.backgroundColor = '';
                    btn.innerHTML = '';
                    btn.disabled = false;
                    btn.dataset.segmentId = '';
                    btn.style.cursor = 'pointer';
                    
                    // Przywróć onclick
                    const endHour = String(h + 1).padStart(2, '0') + ':' + String(m).padStart(2, '0');
                    btn.onclick = function() {
                        openEventModal(segment.day, endHour);
                    };
                }
            }
        }
    });
}

function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};