function processBooks(books) {
    books.forEach(book => {
        // Validate properties
        if (!book.title || !book.author || !book.publishDate) {
            console.error(`Missing properties in book: ${JSON.stringify(book)}`);
            return;
        }
        try {
            // Process each book...
        } catch (error) {
            console.error(`Error processing book ${book.title}:`, error);
        }
    });
}