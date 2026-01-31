const keepScreenOnCheckbox = document.getElementById('keepScreenOn');
var sentinel;
        
keepScreenOnCheckbox.addEventListener('change', function() {
    if (this.checked) {
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen')
                .then(lock => {
                 console.log('Screen lock acquired');
                 sentinel = lock;  
                })
                .catch(err => console.error('Failed to acquire screen lock:', err));
        }
    }
    else{
        if ('wakeLock' in navigator) {
            if (sentinel) {
                sentinel.release()
                    .then(() => {
                        console.log('Screen lock released');
                        sentinel = null;
                    })
                    .catch(err => console.error('Failed to release screen lock:', err));
            }
        }
    }
});
