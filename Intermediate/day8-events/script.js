// Event Delegation Example
document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const addForm = document.getElementById('addForm');
    const itemInput = document.getElementById('itemInput');

    // Event delegation for the entire list
    itemList.addEventListener('click', (e) => {
        // Check if the clicked element is a remove button
        if (e.target.classList.contains('remove-btn')) {
            // Find the parent li element and remove it
            const listItem = e.target.closest('.list-item');
            if (listItem) {
                listItem.remove();
            }
        }
    });

    // Add new items
    addForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const itemText = itemInput.value.trim();
        if (itemText) {
            // Create new list item
            const li = document.createElement('li');
            li.className = 'list-item';
            li.innerHTML = `
                ${itemText}
                <button class="remove-btn">Remove</button>
            `;
            
            // Add to list
            itemList.appendChild(li);
            
            // Reset input
            itemInput.value = '';
        }
    });
}); 