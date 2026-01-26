// Keep screen on
const keepScreenOnCheckbox = document.getElementById('keepScreenOn');
        
keepScreenOnCheckbox.addEventListener('change', function() {
    if (this.checked) {
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen')
                .then(() => console.log('Screen lock acquired'))
                .catch(err => console.error('Failed to acquire screen lock:', err));
        }
    }
});
