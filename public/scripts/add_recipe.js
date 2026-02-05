let ingredientCount = 1; // Start from 1 since index 0 is the template row
let allIngredients = [];

function setupIngredientSearch(container) {
    const input = container.querySelector('.ingredient-input');
    const list = container.querySelector('.ingredient-list');
    const select = container.querySelector('.ingredient-select');
    
    if (!input || !select) {
        console.error('Missing input or select element');
        return;
    }
    
    // Get all ingredient options from the select
    const options = Array.from(select.querySelectorAll('option'));
    const ingredients = options
        .filter(opt => opt.value !== '') // Skip empty option
        .map(opt => ({
            id: opt.value,
            name: opt.textContent.trim()
        }));
    
    console.log('Ingredients found:', ingredients); // Debug
    
    function renderList(filter = '') {
        const searchTerm = filter.toLowerCase().trim();
        let filtered = ingredients;
        
        if (searchTerm.length > 0) {
            // Filter by startsWith for typing
            filtered = ingredients.filter(ing => 
                ing.name.toLowerCase().includes(searchTerm)
            );
        }
        
        list.innerHTML = '';
        if (filtered.length > 0) {
            filtered.forEach(ing => {
                const li = document.createElement('li');
                li.textContent = ing.name;
                li.dataset.id = ing.id;
                li.addEventListener('click', function(e) {
                    e.stopPropagation();
                    input.value = ing.name;
                    select.value = ing.id;
                    list.style.display = 'none';
                    input.focus();
                });
                list.appendChild(li);
            });
            list.style.display = 'block';
        } else {
            list.style.display = 'none';
        }
    }
    
    // Input event - filter and show list
    input.addEventListener('input', function() {
        renderList(this.value);
    });
    
    // Focus event - show all ingredients
    input.addEventListener('focus', function() {
        renderList(this.value);
    });
    
    // Blur event - hide list after selection
    input.addEventListener('blur', function() {
        setTimeout(() => {
            list.style.display = 'none';
        }, 200);
    });
}

function addIngredient() {
    const container = document.getElementById('ingredients-container');
    // Get the first row to use as a template (it contains the populated selects)
    const firstRow = container.querySelector('.ingredient-row');
    
    if (!firstRow) {
        console.error("No template row found!");
        return;
    }

    const newRow = firstRow.cloneNode(true);
    
    // Update names and clear values
    const elements = newRow.querySelectorAll('input, select');
    elements.forEach(el => {
        // Update name: ingredients[0][field] -> ingredients[newIndex][field]
        if (el.name) {
            el.name = el.name.replace(/\[\d+\]/, `[${ingredientCount}]`);
        }
        // Reset value
        el.value = "";
    });

    container.appendChild(newRow);
    setupIngredientSearch(newRow);
    ingredientCount++;
}

function removeIngredient(button) {
    const rows = document.querySelectorAll('.ingredient-row');
    if (rows.length > 1) {
        button.closest('.ingredient-row').remove();
    } else {
        alert('You must have at least one ingredient!');
    }
}

let d = 0, myVar, elapsed = 0;

function start(){
    elapsed = 0
    d = Date.now();
    clearInterval(myVar);
    myVar = setInterval(updateTimer, 1000);
}
function stop(){
    clearInterval(myVar);
    elapsed += Date.now() - d;
}

function continue_time(){
    d = Date.now();
    clearInterval(myVar);
    myVar = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const time = elapsed + (Date.now() - d);
  const seconds = Math.floor(time / 1000) % 60;
  const minutes = Math.floor(time / 60000);

  document.getElementById("demo").innerHTML =
    String(minutes).padStart(2, "0") + ":" +
    String(seconds).padStart(2, "0");
}

// Initialize ingredient search on page load
document.addEventListener('DOMContentLoaded', function() {
    const firstRow = document.querySelector('.ingredient-row');
    if (firstRow) {
        setupIngredientSearch(firstRow);
    }
});