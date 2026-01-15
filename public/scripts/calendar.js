function openEventModal(day, endTime) {
    // endTime np. "22:30"
    const [h, m] = endTime.split(':').map(Number);

    // oblicz start = end - 30 min
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() - 30);

    const startTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    // przechowaj zmienne 
    currentStartTime = startTime;
    currentEndTime = endTime;
    minEndTime = endTime; // zapamiętaj minimalny end time

    // wpisz godziny do modala
    document.getElementById('modal-start').textContent = startTime;
    document.getElementById('modal-end').textContent = endTime;

    document.getElementById('modal').style.display = 'block';
}

function increaseEndTime() {
    const [h, m] = currentEndTime.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    if(currentEndTime!='23:30')
        date.setMinutes(date.getMinutes() + 30);

    currentEndTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    document.getElementById('modal-end').textContent = currentEndTime;
}

function decreaseEndTime() {
    const [minH, minM] = minEndTime.split(':').map(Number);
    const [currH, currM] = currentEndTime.split(':').map(Number);

    // sprawdź czy nie spadnie poniżej wartości początkowej
    if (currH === minH && currM === minM) {
        return; // nie zmniejszaj poniżej minimalnej wartości
    }

    const date = new Date(0, 0, 0, currH, currM);
    date.setMinutes(date.getMinutes() - 30);

    currentEndTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    document.getElementById('modal-end').textContent = currentEndTime;
}

// po kliknięciu X
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// po kliknięciu tła
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};