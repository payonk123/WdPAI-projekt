let ingredientCount = 1;

function addIngredient() {
    const container = document.getElementById('ingredients-container');
    const index = ingredientCount;
    ingredientCount++;

    const newRow = document.createElement('div');
    newRow.className = 'ingredient-row';
    newRow.innerHTML = `
                <div class="ingredient-field">
                    <label>Ingredient</label>
                    <select name="ingredients[${index}][id_in]" class="ingredient-select" required>
                        <option value="">Select ingredient</option>
                        <?php if(isset($ingredients)): ?>
                            <?php foreach($ingredients as $ingredient): ?>
                                <option value="<?php echo htmlspecialchars($ingredient['id_in']); ?>">
                                    <?php echo htmlspecialchars($ingredient['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>

                <div class="ingredient-field">
                    <label>Unit</label>
                    <select name="ingredients[${index}][id_unity]" class="unity-select" required>
                        <option value="">Select unit</option>
                        <?php if(isset($units)): ?>
                            <?php foreach($units as $unit): ?>
                                <option value="<?php echo htmlspecialchars($unit['id_unity']); ?>">
                                    <?php echo htmlspecialchars($unit['name']); ?>
                                </option>
                            <?php endforeach; ?>
                        <?php endif; ?>
                    </select>
                </div>

                <div class="ingredient-field">
                    <label>Amount</label>
                    <input type="number" 
                           name="ingredients[${index}][amount]" 
                           class="amount-input" 
                           step="0.01" 
                           min="0.01" 
                           required>
                </div>

                <button type="button" class="remove-ingredient-btn" onclick="removeIngredient(this)" title="Remove ingredient">
                    ✕
                </button>
            `;

    container.appendChild(newRow);
}

function removeIngredient(button) {
    const rows = document.querySelectorAll('.ingredient-row');
    if (rows.length > 1) {
        button.parentElement.remove();
    } else {
        alert('You must have at least one ingredient!');
    }
}