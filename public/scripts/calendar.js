let currentStartTime = '';
let currentEndTime = '';
let minEndTime = '';
let currentDayIndex = 0;
let currentSlotColor = '';
let segments = [];
let currentWeekStart = new Date();
let currentTab = 'cooking'; // Track which tab is active

// Constants
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const START_HOUR = 8;
const END_HOUR = 24; // 23:30 is last slot
const TIME_INTERVAL = 30; // minutes

// Format time as HH:MM
function formatTime(hours, minutes) {
    return String(hours).padStart(2, '0') + ':' + String(minutes).padStart(2, '0');
}

// Add minutes to time
function addMinutesToTime(timeStr, minutes) {
    const [h, m] = timeStr.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() + minutes);
    return formatTime(date.getHours(), date.getMinutes());
}

// Format date for database
function formatDB(d) {
    const pad = (n) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Build segment date from current selection
function buildSegmentDate() {
    const segmentDate = new Date(currentWeekStart);
    segmentDate.setDate(segmentDate.getDate() + currentDayIndex);
    const [h, m] = currentStartTime.split(':').map(Number);
    segmentDate.setHours(h, m, 0, 0);
    return segmentDate;
}

// Validate segment timing - used by both cooking and eating segments
function validateSegmentTiming(startDate, durationMinutes) {
    const endDate = new Date(startDate.getTime() + durationMinutes * 60000);
    const endH = endDate.getHours();
    const endM = endDate.getMinutes();
    
    // Check if crosses midnight
    if (endDate.getDate() > startDate.getDate() || endDate.getMonth() > startDate.getMonth() || endDate.getFullYear() > startDate.getFullYear()) {
        if (endH !== 0 || endM !== 0) {
            return {valid: false, error: `Cannot add segment: would end at ${formatTime(endH, endM)} the next day. Segments must end by 00:00 (midnight).`, endDate};
        }
    } else {
        // Same day - must end by 23:30
        const endTotalMinutes = endH * 60 + endM;
        const maxAllowedMinutes = 23 * 60 + 30;
        if (endTotalMinutes > maxAllowedMinutes) {
            return {valid: false, error: `Cannot add segment: would end at ${formatTime(endH, endM)}, but segments must end by 23:30.`, endDate};
        }
    }
    return {valid: true, endDate};
}

// Generate all table rows dynamically
function generateCalendarTable() {
    const tbody = document.getElementById('calendar-body');
    tbody.innerHTML = '';
    
    let currentHour = START_HOUR;
    let currentMin = 0;
    
    while (currentHour < END_HOUR || (currentHour === 23 && currentMin < 30)) {
        const timeStr = formatTime(currentHour, currentMin);
        const nextTimeStr = addMinutesToTime(timeStr, TIME_INTERVAL);
        
        const row = document.createElement('tr');
        const timeCell = document.createElement('td');
        timeCell.className = 'time';
        timeCell.textContent = timeStr;
        row.appendChild(timeCell);
        
        for (let dayIndex = 0; dayIndex < 7; dayIndex++) {
            const cell = document.createElement('td');
            const button = document.createElement('button');
            button.className = 'slot-btn';
            button.setAttribute('onclick', `openEventModal('${DAYS[dayIndex]}','${nextTimeStr}')`);
            cell.appendChild(button);
            row.appendChild(cell);
        }
        
        tbody.appendChild(row);
        
        // Increment time by TIME_INTERVAL minutes
        currentMin += TIME_INTERVAL;
        if (currentMin >= 60) {
            currentMin = 0;
            currentHour++;
        }
    }
}

// Set to Monday of current week
function getMonday() {
    var d = new Date(); //current date
    var day = d.getDay(), //day of week (monday=1,...sunday=0)
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // get Monday + adjust when day is sunday (sunday=0)
    d.setDate(diff);
    return d;
}

function initCalendar() {
    generateCalendarTable(); // Generate table rows first
    currentWeekStart = getMonday();
    updateCalendarHeader();
    loadSegments();
}

function clearCalendar() {
    const buttons = document.querySelectorAll('.slot-btn');
    buttons.forEach(btn => {
        btn.style.backgroundColor = '';
        btn.innerHTML = ''; // Clears label and delete btn
        btn.disabled = false;
        btn.dataset.segmentId = '';
        btn.style.cursor = 'pointer';
        
        // Remove all segment classes to reset shape and color
        btn.classList.remove('booked-segment', 'segment-top', 'segment-middle', 'segment-bottom', 'segment-single');
    });
}

function changeWeek(offset) { //when arrow in html is clicked
    currentWeekStart.setDate(currentWeekStart.getDate() + (offset * 7)); // offset is -1 or 1
    updateCalendarHeader(); // new week 
    clearCalendar(); // Clear old segments
    loadSegments(); // load this week's segments
}

function loadSegments() {
    const weekStart = new Date(currentWeekStart);
    weekStart.setHours(0,0,0,0);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    // Load cooking segments
    loadSegmentsGeneric('/get_segments', 'id_segment_r', '#DCD0FF', true, weekStart, weekEnd);
    
    // Load eating segments
    loadSegmentsGeneric('/get_segments_p', 'id_segment_p', '#fed5af', false, weekStart, weekEnd);
}

function loadSegmentsGeneric(endpoint, idField, color, showPTime, weekStart, weekEnd) {
    fetch(endpoint)
        .then(r => r.json())
        .then(segments => {
            if (!Array.isArray(segments)) return;

            segments.forEach(seg => {
                const start = new Date(seg.start_time);
                const end = new Date(seg.end_time);

                if (start >= weekStart && start < weekEnd) {
                    const diffTime = Math.abs(start - weekStart);
                    const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    const durationMinutes = Math.round((end-start) / 60000);
                    
                    const startH = start.getHours();
                    const startM = start.getMinutes();
                    const startTimeStr = formatTime(startH, startM);
                    
                    // Determine segment type: 'r' for cooking, 'p' for eating
                    const segmentType = idField === 'id_segment_r' ? 'r' : 'p';
                    
                    visualizeSegment(dayIndex, startTimeStr, durationMinutes, seg[idField], color, seg.recipe_name, showPTime ? seg.p_time : 0, segmentType);
                }
            });
        })
        .catch(err => console.error(`Error loading ${endpoint}`, err));
}

function updateCalendarHeader() {
    // styles for date formatting
    const options = { month: 'short', day: 'numeric' };
    const yearOptions = { year: 'numeric' };
    
    // names of weekdays
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    // go through table's headers -> set weekdays AND dates
    for (let i = 0; i < 7; i++) {
        const d = new Date(currentWeekStart);
        d.setDate(currentWeekStart.getDate() + i);
        const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        document.getElementById(`th-${i}`).textContent = `${days[i]} ${dateStr}`;
    }

    // Set a new header between arrows (current week)
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);

    const startStr = currentWeekStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const endStr = end.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
    const yearStr = end.toLocaleDateString('en-GB', { year: 'numeric' });

    document.getElementById('calendar-title').textContent = `${startStr} - ${endStr} ${yearStr}`;
}


function openEventModal(dayName, endTime) {
    // Map dayName to index
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const dayIndex = days.indexOf(dayName);
    currentDayIndex = dayIndex;

    // end time is provided as hour:minute, needs to be split
    const [h, m] = endTime.split(':').map(Number);
    // calculating start time by subtracting 30 minutes
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() - 30);
    // formatting start time as HH:MM
    const startTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    currentStartTime = startTime;
    currentEndTime = endTime;
    minEndTime = endTime;

    const color = window.getComputedStyle(event.target).backgroundColor;
    currentSlotColor = color;

    // Reset to cooking tab
    currentTab = 'cooking';
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn')[0].classList.add('active');
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById('cooking-tab').classList.add('active');

    document.getElementById('modal-start').textContent = startTime;
    document.getElementById('modal-end').textContent = '...';
    document.getElementById('modal-start-eating').textContent = startTime;

    loadRecipes();

    document.getElementById('modal').style.display = 'block';
}

function loadRecipes() {
    const select = document.getElementById('recipeDropdown');
    
    // Preserve the first option (placeholder)
    select.innerHTML = '<option value="" disabled selected>Select a recipe</option><option disabled>Loading...</option>';

    fetch('/get_recipes')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            // Clear again to remove "Loading..."
            select.innerHTML = '<option value="" disabled selected>Select a recipe</option>';
            
            if (Array.isArray(data)) {
                data.forEach(recipe => {
                    const option = document.createElement('option');
                    option.value = recipe.id_recipe;
                    option.textContent = recipe.name;
                    // Store p_time in dataset
                    option.dataset.ptime = recipe.p_time; 
                    select.appendChild(option);
                });
            }

            // Add change event listener to update end time
            select.addEventListener('change', updateEndTime);
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            select.innerHTML = '<option value="" disabled selected>Error loading recipes</option>';
        });
}

function updateEndTime() {
    const select = document.getElementById('recipeDropdown');
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
        document.getElementById('modal-end').textContent = '...';
        return;
    }

    const pTime = parseInt(selectedOption.dataset.ptime);
    const durationMinutes = Math.ceil(pTime / 30) * 30;
    
    // Calculate end time
    const [h, m] = currentStartTime.split(':').map(Number);
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() + durationMinutes);
    const endTime = formatTime(date.getHours(), date.getMinutes());
    
    document.getElementById('modal-end').textContent = endTime;
}

function confirmSegment() {
    const btnOk = document.querySelector('.btn-ok');
    if (btnOk) btnOk.disabled = true;

    const select = document.getElementById('recipeDropdown');
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
        alert("Please select a recipe first.");
        if (btnOk) btnOk.disabled = false;
        return;
    }

    const recipeId = selectedOption.value;
    const pTime = parseInt(selectedOption.dataset.ptime);
    const durationMinutes = Math.ceil(pTime / 30) * 30; // p_time <= 30 -> 30, 31-60 -> 60 ...
    const startDateObj = buildSegmentDate();
    
    const validation = validateSegmentTiming(startDateObj, durationMinutes);
    if (!validation.valid) {
        alert(validation.error);
        if (btnOk) btnOk.disabled = false;
        return;
    }

    const payload = {
        id_recipe: recipeId,
        start_time: formatDB(startDateObj),
        end_time: formatDB(validation.endDate)
    };

    fetch('/add_segment', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            closeModal();
            clearCalendar();
            loadSegments();
        } else {
            alert("Error saving segment: " + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error(err);
        alert("Network error");
    })
    .finally(() => {
        if (btnOk) btnOk.disabled = false;
    });
}

function visualizeSegment(dayIndex, startTimeStr, durationMinutes, segmentId, color, recipeName = '', pTime = 0, segmentType = 'r') {
    const [startH, startM] = startTimeStr.split(':').map(Number);
    const startTotalMinutes = startH * 60 + startM;
    const endTotalMinutes = startTotalMinutes + durationMinutes;

    const table = document.querySelector('.calendar');
    const rows = table.querySelectorAll('tbody tr');
    let segmentButtons = [];

    rows.forEach(row => {
        const timeCell = row.querySelector('.time');
        if (! timeCell) return;

        const timeText = timeCell.textContent.trim();
        const [h, m] = timeText.split(':').map(Number);
        const rowMinutes = h * 60 + m;

        // Check if row is within range [start, end)
        if (rowMinutes >= startTotalMinutes && rowMinutes < endTotalMinutes) {
            const cell = row.querySelectorAll('td')[dayIndex + 1]; // +1 because first col is Time
            if (cell) {
                const button = cell.querySelector('button');
                if (button) {
                    segmentButtons.push(button);
                }
            }
        }
    });

    // Apply styles to buttons
    const count = segmentButtons.length;
    segmentButtons.forEach((button, index) => {
        button.style.backgroundColor = color;
        button.disabled = true;
        button.dataset.segmentId = segmentId;
        button.dataset.segmentType = segmentType;
        button.style.cursor = 'default';
        button.title = ''; // Explicitly remove native tooltip
        button.removeAttribute('title'); // Double check

        button.classList.add('booked-segment');
        
        // Remove old classes if re-rendering
        button.classList.remove('segment-top', 'segment-middle', 'segment-bottom', 'segment-single');

        if (count === 1) {
            button.classList.add('segment-single');
        } else {
            if (index === 0) {
                button.classList.add('segment-top');
            } else if (index === count - 1) {
                button.classList.add('segment-bottom');
            } else {
                button.classList.add('segment-middle');
            }
        }
    });

    // Add Label and Delete btn to first button
    if (segmentButtons.length > 0) {
        const firstButton = segmentButtons[0];

        if (recipeName) {
            const label = document.createElement('span');
            label.className = 'recipe-label';
            
            let labelText = recipeName;
            if (pTime) {
                labelText += ` (${pTime} min)`;
            }
            
            label.textContent = labelText;
            firstButton.appendChild(label);
        }

        const closeBtn = document.createElement('span');
        closeBtn.className = 'segment-delete-btn';
        closeBtn.innerHTML = '×';
        closeBtn.style.cursor = 'pointer';
        
        closeBtn.onclick = function(e) {
            e.stopPropagation();
            openDeleteSegmentModal(segmentId, segmentType);
        };
        firstButton.appendChild(closeBtn);
    }
}

let segmentIdToDelete = null;
let segmentTypeToDelete = null;

function openDeleteSegmentModal(segmentId, segmentType = 'r') {
    segmentIdToDelete = segmentId;
    segmentTypeToDelete = segmentType;
    const modal = document.getElementById('deleteSegmentModal');
    if(modal) modal.style.display = 'block';
}

function closeDeleteSegmentModal() {
    segmentIdToDelete = null;
    const modal = document.getElementById('deleteSegmentModal');
    if(modal) modal.style.display = 'none';
}

function confirmDeleteSegment() {
    if(!segmentIdToDelete) {
        console.error("No segment ID to delete");
        return;
    }

    const segmentId = segmentIdToDelete;
    const segmentType = segmentTypeToDelete || 'r';
    
    // Disable button to prevent double-clicks
    const deleteBtn = document.querySelector('.btn-confirm-delete');
    if (deleteBtn) deleteBtn.disabled = true;

    console.log("Deleting segment ID:", segmentId, "Type:", segmentType);

    fetch('/delete_segment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_segment: segmentId, segment_type: segmentType })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log("Delete response:", data);
        if (data.success) {
            console.log("Delete successful, reloading calendar...");
            closeDeleteSegmentModal();
            clearCalendar();
            loadSegments();
            
            // Re-enable button after operation completes
            setTimeout(() => {
                if (deleteBtn) deleteBtn.disabled = false;
            }, 500);
        } else {
            console.error("Delete failed:", data.error);
            alert("Could not delete segment: " + (data.error || "Unknown error"));
            if (deleteBtn) deleteBtn.disabled = false;
        }
    })
    .catch(err => {
        console.error("Delete error:", err);
        alert("Network error: " + err.message);
        if (deleteBtn) deleteBtn.disabled = false;
    });
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; 
}

function switchTab(tab) {
    currentTab = tab;
    
    // Update active tab button
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // Show/hide tab content
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    document.getElementById(tab + '-tab').classList.add('active');
    
    // Load appropriate data
    if (tab === 'eating') {
        loadPrepared();
        document.getElementById('modal-start-eating').textContent = currentStartTime;
    } else {
        loadRecipes();
        document.getElementById('modal-end').textContent = '...';
    }
}

function loadPrepared() {
    const select = document.getElementById('preparedDropdown');
    select.innerHTML = '<option value="" disabled selected>Select a prepared dish</option><option disabled>Loading...</option>';

    // Build full datetime from currentWeekStart, currentDayIndex, and currentStartTime
    const segmentDate = new Date(currentWeekStart);
    segmentDate.setDate(segmentDate.getDate() + currentDayIndex);
    const [h, m] = currentStartTime.split(':').map(Number);
    segmentDate.setHours(h, m, 0, 0);
    
    const formatDB = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };
    const beforeTime = formatDB(segmentDate);

    fetch(`/get_prepared?before_time=${encodeURIComponent(beforeTime)}`)
        .then(response => response.json())
        .then(data => {
            select.innerHTML = '<option value="" disabled selected>Select a prepared dish</option>';
            
            if (Array.isArray(data)) {
                data.forEach(item => {
                    const option = document.createElement('option');
                    option.value = item.id_prepared;
                    option.textContent = `${item.recipe_name} (${item.portions_left} portions)`;
                    option.dataset.segmentId = item.id_segment_r;
                    select.appendChild(option);
                });
                if (data.length === 0) {
                    select.innerHTML = '<option value="" disabled selected>No prepared dishes available</option>';
                }
            }
        })
        .catch(error => {
            console.error('Error fetching prepared:', error);
            select.innerHTML = '<option value="" disabled selected>Error loading prepared</option>';
        });
}

function confirmSegmentWrapper() {
    if (currentTab === 'cooking') {
        confirmSegment();
    } else {
        confirmPreparedSegment();
    }
}

function confirmPreparedSegment() {
    const btnOk = document.querySelector('.btn-ok');
    if (btnOk) btnOk.disabled = true;

    const select = document.getElementById('preparedDropdown');
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
        alert("Please select a prepared dish first.");
        if (btnOk) btnOk.disabled = false;
        return;
    }

    const idPrepared = selectedOption.value;
    const durationMinutes = 30; // Fixed 30 minutes for eating
    const startDateObj = buildSegmentDate();
    
    const validation = validateSegmentTiming(startDateObj, durationMinutes);
    if (!validation.valid) {
        alert(validation.error);
        if (btnOk) btnOk.disabled = false;
        return;
    }

    const payload = {
        id_prepared: idPrepared,
        start_time: formatDB(startDateObj),
        end_time: formatDB(validation.endDate)
    };

    fetch('/add_segment_p', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            closeModal();
            clearCalendar();
            loadSegments();
        } else {
            alert("Error saving segment: " + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error(err);
        alert("Network error");
    })
    .finally(() => {
        if (btnOk) btnOk.disabled = false;
    });
}

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    const deleteModal = document.getElementById('deleteSegmentModal');
    if (event.target === modal) {
        closeModal();
    }
    if (event.target === deleteModal) {
        closeDeleteSegmentModal();
    }
};

initCalendar();