const keepScreenOnCheckbox = document.getElementById('keepScreenOn');

function loadScreenLockPreference() {
    const saved = localStorage.getItem('keepScreenOn');
    if (saved === 'true') {
        keepScreenOnCheckbox.checked = true;
        enableWakeLock();
    }
}

async function enableWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            const wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock enabled - screen will stay on');
            
            document.addEventListener('visibilitychange', async () => {
                if (document.hidden) {
                    wakeLock.release();
                }
            });
        } else {
            console.log('Wake Lock API not supported - using fallback');
        }
    } catch (err) {
        console.error('Failed to enable Wake Lock:', err);
    }
}

function disableWakeLock() {
    console.log('Wake Lock disabled');
}

keepScreenOnCheckbox. addEventListener('change', function() {
    if (this.checked) {
        localStorage.setItem('keepScreenOn', 'true');
        enableWakeLock();
    } else {
        localStorage.setItem('keepScreenOn', 'false');
        disableWakeLock();
    }
});

window.addEventListener('DOMContentLoaded', function() {
    loadScreenLockPreference();
});