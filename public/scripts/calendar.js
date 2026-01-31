let currentStartTime = '';
let currentEndTime = '';
let minEndTime = '';
let currentDayIndex = 0;
let currentSlotColor = '';
let segments = [];
let currentWeekStart = new Date(); 

// Set to Monday of current week
function getMonday() {
    var d = new Date();
    var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday (sunday=0)
    d.setDate(diff);
    return d;
}

function initCalendar() {
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

function changeWeek(offset) {
    currentWeekStart.setDate(currentWeekStart.getDate() + (offset * 7));
    updateCalendarHeader();
    clearCalendar(); // Clear old segments
    loadSegments();
}

function loadSegments() {
    fetch('/get_segments')
        .then(r => r.json())
        .then(segments => {
            if (!Array.isArray(segments)) return;

            // Determine visible range (Monday 00:00 to Sunday 24:00)
            const weekStart = new Date(currentWeekStart);
            weekStart.setHours(0,0,0,0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekEnd.getDate() + 7);

            segments.forEach(seg => {
                const start = new Date(seg.start_time);
                const end = new Date(seg.end_time);

                // Check if segment overlaps with current week view
                if (start >= weekStart && start < weekEnd) {
                    
                    // Calculate relative day index (0-6)
                    // If start time is Monday, diff in days from weekStart
                    const diffTime = Math.abs(start - weekStart);
                    const dayIndex = Math.floor(diffTime / (1000 * 60 * 60 * 24)); // z milisekund na doby

                    // Calculate duration in minutes
                    const durationMinutes = Math.round((end-start) / 60000);

                    // Format HH:MM from start time
                    const startH = start.getHours();
                    const startM = start.getMinutes();
                    const startTimeStr = String(startH).padStart(2, '0') + ':' + String(startM).padStart(2, '0');

                    visualizeSegment(dayIndex, startTimeStr, durationMinutes, seg.id_segment_r, '#DCD0FF', seg.recipe_name, seg.p_time);
                }
            });
        })
        .catch(err => console.error("Error loading segments", err));
}

function updateCalendarHeader() {
    const options = { month: 'short', day: 'numeric' };
    const yearOptions = { year: 'numeric' };
    
    // Header cells
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    
    for (let i = 0; i < 7; i++) {
        const d = new Date(currentWeekStart);
        d.setDate(currentWeekStart.getDate() + i);
        const dateStr = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        document.getElementById(`th-${i}`).textContent = `${days[i]} ${dateStr}`;
    }

    // Title
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

    const [h, m] = endTime.split(':').map(Number);
    // ... logic for startTime string ...
    const date = new Date(0, 0, 0, h, m);
    date.setMinutes(date.getMinutes() - 30);
    const startTime =
        String(date.getHours()).padStart(2, '0') + ':' +
        String(date.getMinutes()).padStart(2, '0');

    currentStartTime = startTime;
    currentEndTime = endTime;
    minEndTime = endTime;

    const color = window.getComputedStyle(event.target).backgroundColor;
    currentSlotColor = color;

    document.getElementById('modal-start').textContent = startTime;
    document.getElementById('modal-end').textContent = '...'; //end time depends on chosen recipe

    loadRecipes(); // Fetch recipes via AJAX

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
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            select.innerHTML = '<option value="" disabled selected>Error loading recipes</option>';
        });
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
    const recipeName = selectedOption.textContent;
    const pTime = parseInt(selectedOption.dataset.ptime); 
    
    // Calculate Duration
    // p_time <= 30 -> 30, 31-60 -> 60 ...
    const durationMinutes = Math.ceil(pTime / 30) * 30;
    
    // Calculate Dates
    // Start Date
    const segmentDate = new Date(currentWeekStart);
    segmentDate.setDate(segmentDate.getDate() + currentDayIndex);
    
    const [startH, startM] = currentStartTime.split(':').map(Number);
    const startDateObj = new Date(segmentDate);
    startDateObj.setHours(startH, startM, 0, 0);

    // End Date
    const endDateObj = new Date(startDateObj.getTime() + durationMinutes * 60000);
    
    // Validate: segment must end by 11:30 PM (23:30)
    // Check if it crosses into the next day OR ends after 23:30 on the same day
    if (endDateObj.getDate() > startDateObj.getDate() || endDateObj.getMonth() > startDateObj.getMonth() || endDateObj.getFullYear() > startDateObj.getFullYear()) {
        // Segment crosses into next day - not allowed
        const endH = endDateObj.getHours();
        const endM = endDateObj.getMinutes();
        alert(`Cannot add segment: This recipe would end at ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')} the next day. Segments must end by 23:30 (11:30 PM) on the same day.`);
        if (btnOk) btnOk.disabled = false;
        return;
    }
    
    const endH = endDateObj.getHours();
    const endM = endDateObj.getMinutes();
    const endTotalMinutes = endH * 60 + endM;
    const maxAllowedMinutes = 23 * 60 + 30; // 11:30 PM = 1410 minutes
    
    if (endTotalMinutes > maxAllowedMinutes) {
        alert(`Cannot add segment: This recipe would end at ${String(endH).padStart(2, '0')}:${String(endM).padStart(2, '0')}, but segments must end by 23:30 (11:30 PM).`);
        if (btnOk) btnOk.disabled = false;
        return;
    }
    
    // Save to DB
    // Format for DB: YYYY-MM-DD HH:MM:SS
    const formatDB = (d) => {
        const pad = (n) => String(n).padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
    };

    const payload = {
        id_recipe: recipeId,
        start_time: formatDB(startDateObj),
        end_time: formatDB(endDateObj)
    };

    fetch('/add_segment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(response => response.json())
    .then(data => {
        if(data.success) {
            // Close modal first
            closeModal();
            // Reload segments from database to ensure everything is synchronized
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

function visualizeSegment(dayIndex, startTimeStr, durationMinutes, segmentId, color, recipeName = '', pTime = 0) {
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
            openDeleteSegmentModal(segmentId);
        };
        firstButton.appendChild(closeBtn);
    }
}

let segmentIdToDelete = null;

function openDeleteSegmentModal(segmentId) {
    segmentIdToDelete = segmentId;
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
    
    // Disable button to prevent double-clicks
    const deleteBtn = document.querySelector('.btn-confirm-delete');
    if (deleteBtn) deleteBtn.disabled = true;

    console.log("Deleting segment ID:", segmentId);

    fetch('/delete_segment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_segment: segmentId })
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