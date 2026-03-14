let allBooks = [];

// Load data on page load
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('https://raw.githubusercontent.com/ogsamsa/bbb-digital-archive/main/data.json');
        allBooks = await response.json();
        populateCategoryFilter();
        displayBooks(allBooks);
    } catch (error) {
        console.error('Error loading data:', error);
        document.getElementById('booksContainer').innerHTML = '<p class="no-results">Error loading books. Please check the data.json file.</p>';
    }
});

// Populate category dropdown
function populateCategoryFilter() {
    const categories = [...new Set(allBooks.map(book => book.category))].sort();
    const filterSelect = document.getElementById('categoryFilter');
    
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        filterSelect.appendChild(option);
    });
}

// Search and filter books
document.getElementById('searchBtn').addEventListener('click', performSearch);
document.getElementById('searchInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') performSearch();
});

function performSearch() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;

    let filtered = allBooks.filter(book => {
        const matchesSearch = !searchTerm || 
            book.title.toLowerCase().includes(searchTerm) || 
            book.author.toLowerCase().includes(searchTerm);
        
        const matchesCategory = !categoryFilter || book.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });

    displayBooks(filtered);
}

// Display books
function displayBooks(books) {
    const container = document.getElementById('booksContainer');
    const resultsCount = document.getElementById('resultsCount');
    
    resultsCount.textContent = `Showing ${books.length} result${books.length !== 1 ? 's' : ''}`;

    if (books.length === 0) {
        container.innerHTML = '<p class="no-results">No books found. Try adjusting your search or filters.</p>';
        return;
    }

    container.innerHTML = books.map(book => `
        <div class="book-card">
            <div class="book-title">${escapeHtml(book.title)}</div>
            <div class="book-author">by ${escapeHtml(book.author)}</div>
            <div class="book-category">${escapeHtml(book.category)}</div>
            <a href="${book.url}" target="_blank" class="book-link">Access Book</a>
        </div>
    `).join('');
}

// Escape HTML to prevent injection
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
