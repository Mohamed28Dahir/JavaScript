class BookAPI {
    constructor() {
        this.baseURL = 'https://www.googleapis.com/books/v1/volumes';
        this.searchForm = document.getElementById('searchForm');
        this.searchInput = document.getElementById('searchInput');
        this.resultsDiv = document.getElementById('results');
        this.loadingDiv = document.getElementById('loading');
        this.errorDiv = document.getElementById('error');

        this.setupEventListeners();
    }

    setupEventListeners() {
        this.searchForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.searchBooks();
        });
    }

    async searchBooks() {
        const query = this.searchInput.value.trim();
        if (!query) return;

        this.showLoading();
        this.clearError();

        try {
            const response = await fetch(`${this.baseURL}?q=${encodeURIComponent(query)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            this.displayResults(data.items || []);
        } catch (error) {
            this.showError('Failed to fetch books. Please try again later.');
            console.error('Error:', error);
        } finally {
            this.hideLoading();
        }
    }

    displayResults(books) {
        this.resultsDiv.innerHTML = '';
        
        if (books.length === 0) {
            this.resultsDiv.innerHTML = '<p>No books found.</p>';
            return;
        }

        books.forEach(book => {
            const volumeInfo = book.volumeInfo;
            const bookElement = document.createElement('div');
            bookElement.className = 'book';
            
            const thumbnail = volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/128x192?text=No+Cover';
            const authors = volumeInfo.authors?.join(', ') || 'Unknown Author';
            const categories = volumeInfo.categories || [];
            
            bookElement.innerHTML = `
                <div class="book-info">
                    <div>
                        <img src="${thumbnail}" alt="Book cover" class="book-cover">
                    </div>
                    <div class="book-details">
                        <h3>${volumeInfo.title}</h3>
                        <p><strong>Author:</strong> ${authors}</p>
                        <p><strong>Published:</strong> ${volumeInfo.publishedDate || 'Unknown'}</p>
                        ${volumeInfo.description ? 
                            `<p><strong>Description:</strong> ${this.truncateText(volumeInfo.description, 200)}</p>` 
                            : ''}
                        <div class="categories">
                            ${categories.map(category => `<span class="tag">${category}</span>`).join('')}
                        </div>
                        ${volumeInfo.previewLink ? 
                            `<p><a href="${volumeInfo.previewLink}" target="_blank">Preview on Google Books</a></p>`
                            : ''}
                    </div>
                </div>
            `;
            
            this.resultsDiv.appendChild(bookElement);
        });
    }

    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    }

    showLoading() {
        this.loadingDiv.style.display = 'block';
        this.resultsDiv.innerHTML = '';
    }

    hideLoading() {
        this.loadingDiv.style.display = 'none';
    }

    showError(message) {
        this.errorDiv.textContent = message;
        this.errorDiv.style.display = 'block';
    }

    clearError() {
        this.errorDiv.textContent = '';
        this.errorDiv.style.display = 'none';
    }
}

// Initialize the app
const bookAPI = new BookAPI(); 