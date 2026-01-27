let ingredientCount = 1; // Start from 1 since index 0 is the template row

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