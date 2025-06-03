// Day 22: Arrays and Loops Combined
// ==============================

// Sample product data
const products = [
    { id: 1, name: 'Laptop', price: 999.99, category: 'Electronics' },
    { id: 2, name: 'Smartphone', price: 699.99, category: 'Electronics' },
    { id: 3, name: 'Headphones', price: 199.99, category: 'Electronics' },
    { id: 4, name: 'Running Shoes', price: 89.99, category: 'Sports' },
    { id: 5, name: 'Yoga Mat', price: 29.99, category: 'Sports' },
    { id: 6, name: 'Water Bottle', price: 19.99, category: 'Sports' },
    { id: 7, name: 'Novel', price: 14.99, category: 'Books' },
    { id: 8, name: 'Cookbook', price: 24.99, category: 'Books' },
    { id: 9, name: 'Dictionary', price: 19.99, category: 'Books' },
    { id: 10, name: 'Coffee Maker', price: 79.99, category: 'Home' }
];

// 1. Basic Array Display with For Loop
function displayProducts(productArray) {
    const productList = document.getElementById('productList');
    productList.innerHTML = '';
    
    for (let i = 0; i < productArray.length; i++) {
        const product = productArray[i];
        const productCard = document.createElement('div');
        productCard.className = 'card';
        
        productCard.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price: $${product.price}</p>
            <p>Category: ${product.category}</p>
        `;
        
        productList.appendChild(productCard);
    }
}

// 2. Pagination Implementation
class ProductPagination {
    constructor(items, itemsPerPage = 3) {
        this.items = items;
        this.itemsPerPage = itemsPerPage;
        this.currentPage = 1;
        this.totalPages = Math.ceil(items.length / itemsPerPage);
        
        this.initialize();
    }
    
    initialize() {
        this.displayPage(1);
        this.setupPaginationControls();
    }
    
    displayPage(pageNumber) {
        const start = (pageNumber - 1) * this.itemsPerPage;
        const end = start + this.itemsPerPage;
        const pageItems = this.items.slice(start, end);
        
        displayProducts(pageItems);
        this.currentPage = pageNumber;
        this.updatePaginationButtons();
    }
    
    setupPaginationControls() {
        const paginationContainer = document.getElementById('pagination');
        paginationContainer.innerHTML = '';
        
        // Previous button
        const prevButton = document.createElement('button');
        prevButton.textContent = 'Previous';
        prevButton.addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.displayPage(this.currentPage - 1);
            }
        });
        
        // Next button
        const nextButton = document.createElement('button');
        nextButton.textContent = 'Next';
        nextButton.addEventListener('click', () => {
            if (this.currentPage < this.totalPages) {
                this.displayPage(this.currentPage + 1);
            }
        });
        
        // Page numbers
        const pageNumbers = document.createElement('span');
        pageNumbers.style.margin = '0 10px';
        
        paginationContainer.appendChild(prevButton);
        paginationContainer.appendChild(pageNumbers);
        paginationContainer.appendChild(nextButton);
        
        this.pageNumbers = pageNumbers;
    }
    
    updatePaginationButtons() {
        this.pageNumbers.textContent = `Page ${this.currentPage} of ${this.totalPages}`;
    }
}

// 3. Category Filtering
function filterByCategory(category) {
    if (category === 'All') {
        return products;
    }
    
    const filtered = [];
    for (let i = 0; i < products.length; i++) {
        if (products[i].category === category) {
            filtered.push(products[i]);
        }
    }
    return filtered;
}

// 4. Price Range Filtering
function filterByPriceRange(min, max) {
    const filtered = [];
    for (const product of products) {
        if (product.price >= min && product.price <= max) {
            filtered.push(product);
        }
    }
    return filtered;
}

// 5. Search Implementation
function searchProducts(query) {
    query = query.toLowerCase();
    const results = [];
    
    products.forEach(product => {
        if (product.name.toLowerCase().includes(query) || 
            product.category.toLowerCase().includes(query)) {
            results.push(product);
        }
    });
    
    return results;
}

// 6. Sorting Implementation
function sortProducts(criteria) {
    const sortedProducts = [...products];
    
    switch (criteria) {
        case 'name':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'price-low':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
        case 'category':
            sortedProducts.sort((a, b) => a.category.localeCompare(b.category));
            break;
    }
    
    return sortedProducts;
}

// 7. Initialize the Product Display
function initializeProductDisplay() {
    // Create category buttons
    const categories = ['All', ...new Set(products.map(p => p.category))];
    const productList = document.getElementById('productList');
    
    const categoryButtons = document.createElement('div');
    categoryButtons.style.marginBottom = '20px';
    
    categories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.addEventListener('click', () => {
            const filtered = filterByCategory(category);
            pagination.items = filtered;
            pagination.totalPages = Math.ceil(filtered.length / pagination.itemsPerPage);
            pagination.displayPage(1);
        });
        categoryButtons.appendChild(button);
    });
    
    productList.parentElement.insertBefore(categoryButtons, productList);
    
    // Initialize pagination
    const pagination = new ProductPagination(products);
}

// Initialize the display
initializeProductDisplay();

// That's it for Day 22! You've learned:
// 1. How to combine arrays and loops
// 2. How to implement pagination
// 3. How to filter arrays
// 4. How to search through arrays
// 5. How to sort arrays
// 6. How to display data dynamically
// 7. How to handle user interactions with arrays 