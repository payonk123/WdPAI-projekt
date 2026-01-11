function openEventModal(day, endTime) {

    // endTime np. "22:30"
    const [h, m] = endTime.split(':').map(Number);

    // oblicz start = end - 30 min
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() - 30);

    const startTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    // wpisz godziny do modala
    document.getElementById('modal-start').textContent = startTime;
    document.getElementById('modal-end').textContent = endTime;

    document.getElementById('modal').style.display = 'block';
}
//po kliknięciu X
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}
//po kliknięciu tła
window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};
