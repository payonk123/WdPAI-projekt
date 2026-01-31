let recipeIdToDelete = null;

        function viewRecipe(id) {
            window.location.href = `/recipe_detail?id=` + id;
        }

        function openDeleteModal(id, name) {
            recipeIdToDelete = id;
            const nameElem = document.getElementById('recipeName');
            if(nameElem) nameElem.textContent = name;
            const modal = document.getElementById('deleteModal');
            if(modal) modal.style.display = 'block';
        }

        function closeDeleteModal() {
            recipeIdToDelete = null;
            const modal = document.getElementById('deleteModal');
            if(modal) modal.style.display = 'none';
        }

        function confirmDelete() {
            if (!recipeIdToDelete) return;

            fetch('/delete_recipe', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_recipe: recipeIdToDelete })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert("Could not delete recipe: " + (data.error || "Unknown error"));
                }
            })
            .catch(err => {
                console.error(err);
                alert("Network error");
            });
        }

        window.onclick = function(event) {
            const modal = document.getElementById('deleteModal');
            if (event.target == modal) {
                closeDeleteModal();
            }
        }
