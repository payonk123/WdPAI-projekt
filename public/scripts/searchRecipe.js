// Przykładowe dane przepisów
const recipes = [
    {
        id: 1,
        name: 'Spaghetti',
        ingredients: ['Pasta', 'Tomato', 'Garlic', 'Olive oil'],
        instructions: 'Cook pasta, prepare sauce with tomatoes and garlic',
        portions: 4,
        time: '25 min'
    },
    {
        id: 2,
        name: 'Pancakes',
        ingredients: ['Flour', 'Eggs', 'Milk', 'Butter'],
        instructions: 'Mix ingredients, cook on griddle until golden',
        portions: 4,
        time: '20 min'
    },
    {
        id: 3,
        name: 'Dumplings',
        ingredients: ['Flour', 'Water', 'Filling', 'Salt'],
        instructions:  'Prepare dough, fill, and steam or boil',
        portions: 6,
        time: '40 min'
    },
    {
        id: 4,
        name: 'Muffins',
        ingredients: ['Flour', 'Sugar', 'Eggs', 'Butter'],
        instructions: 'Mix dry and wet ingredients, bake at 200°C for 20 min',
        portions: 12,
        time: '35 min'
    },
    {
        id: 5,
        name: 'Tikka masala',
        ingredients: ['Chicken', 'Yogurt', 'Spices', 'Cream'],
        instructions: 'Marinate chicken, cook with sauce',
        portions: 4,
        time: '45 min'
    },
    {
        id: 6,
        name: 'Pizza',
        ingredients: ['Dough', 'Tomato sauce', 'Cheese', 'Toppings'],
        instructions: 'Prepare dough, add toppings, bake at 220°C for 15 min',
        portions: 4,
        time:  '30 min'
    }
];

let recipeToDelete = null;

function renderRecipes() {
    const recipesList = document.getElementById('recipesList');
    
    if (recipes.length === 0) {
        recipesList.innerHTML = `
            <div class="empty-state">
                <p>No recipes yet. Start adding your favorites! </p>
            </div>
        `;
        return;
    }

    recipesList.innerHTML = recipes. map(recipe => `
        <div class="recipe-item">
            <div class="recipe-name" onclick="viewRecipe(${recipe. id})">
                ${recipe. name}
            </div>
            <div class="recipe-actions">
                <button class="btn-edit" onclick="editRecipe(${recipe.id})" title="Edit recipe">
                    ✏️
                </button>
                <button class="btn-delete" onclick="openDeleteModal(${recipe.id}, '${recipe.name}')" title="Delete recipe">
                    🗑️
                </button>
            </div>
        </div>
    `).join('');
}

// View recipe details
function viewRecipe(id) {
    // const recipe = recipes. find(r => r.id === id);
    // console.log('Viewing recipe:', recipe);
    // alert(`Viewing:  ${recipe.name}\n\nIngredients:  ${recipe.ingredients.join(', ')}\n\nInstructions: ${recipe.instructions}\n\nPortions: ${recipe.portions}\n\nTime: ${recipe.time}`);
    window.location.href = `/recipe_detail?id`
}

// Edit recipe
function editRecipe(id) {
    const recipe = recipes.find(r => r. id === id);
    //console.log('Editing recipe:', recipe);
    //alert(`Editing: ${recipe.name}`);
    window.location.href = `/add_recipe?id`;
}

// Open delete modal
function openDeleteModal(id, name) {
    recipeToDelete = id;
    document.getElementById('recipeName').textContent = name;
    document.getElementById('deleteModal').style.display = 'block';
}

// Close delete modal
function closeDeleteModal() {
    document.getElementById('deleteModal').style.display = 'none';
    recipeToDelete = null;
}

// Confirm delete
function confirmDelete() {
    if (recipeToDelete !== null) {
        const index = recipes.findIndex(r => r.id === recipeToDelete);
        if (index > -1) {
            const deletedName = recipes[index].name;
            recipes. splice(index, 1);
            renderRecipes();
            closeDeleteModal();
            console.log(`Deleted: ${deletedName}`);
        }
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('deleteModal');
    if (event.target == modal) {
        closeDeleteModal();
    }
}

// Initial render
renderRecipes();