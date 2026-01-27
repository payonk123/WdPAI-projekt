let currentStartTime = '';
let currentEndTime = '';
let minEndTime = '';
let currentDayIndex = 0; // 0=Monday, ...
let currentSlotColor = '';
let segments = [];
let currentWeekStart = new Date(); 

// Set to Monday of current week
function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); 
    return new Date(d.setDate(diff));
}

function initCalendar() {
    currentWeekStart = getMonday(new Date());
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
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)); 
                    const dayIndex = diffDays;

                    // Calculate duration in minutes
                    const durationMs = end - start;
                    const durationMinutes = Math.round(durationMs / 60000);

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
    const start = new Date(currentWeekStart);
    const end = new Date(currentWeekStart);
    end.setDate(end.getDate() + 6);

    const startStr = start.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
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

    // Use event.target properly - assuming this function is called from onclick
    // Note: 'event' is deprecated global, safer if passed, but usually works in inline handlers
    const color = window.getComputedStyle(event.target).backgroundColor;
    currentSlotColor = color;

    document.getElementById('modal-start').textContent = startTime;
    // We will clear End Time text or make it depend on recipe selection? 
    // The prompt says: "end_time = start_time + p_time"
    // But initially no recipe is selected.
    document.getElementById('modal-end').textContent = '...'; 

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
    const select = document.getElementById('recipeDropdown');
    const selectedOption = select.options[select.selectedIndex];
    
    if (!selectedOption.value) {
        alert("Please select a recipe first.");
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
    
    // Save to DB
    // Format for DB: YYYY-MM-DD HH:MM:SS
    const formatDB = (d) => {
        // Adjust to local ISO roughly or use library... simple implementation:
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
            // Visualize on Calendar
            visualizeSegment(currentDayIndex, currentStartTime, durationMinutes, data.id_segment_r, '#DCD0FF', recipeName, pTime);
            closeModal();
        } else {
            alert("Error saving segment: " + (data.error || 'Unknown error'));
        }
    })
    .catch(err => {
        console.error(err);
        alert("Network error");
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
            alert("Delete not implemented fully yet (needs backend)");
            // deleteSegment(segmentId); // calling existing deleteSegment
        };
        firstButton.appendChild(closeBtn);
    }
}


// ... existing deleteSegment ...
function deleteSegment(segmentId) {
    if(confirm("Are you sure you want to delete this segment?")) {
        // TODO: Implement backend delete
        console.log("Delete segment", segmentId);
        // For now, reload to clear (but it won't clear from DB without endpoint)
        // loadSegments(); 
        alert("Backend delete not implemented yet.");
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none'; 
}

window.onclick = function (event) {
    const modal = document.getElementById('modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
};

// Ensure DOM is ready before init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCalendar);
} else {
    initCalendar();
}