function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

function getBooks() {
    const booksJSON = localStorage.getItem('books');
    if (booksJSON) {
        return JSON.parse(booksJSON);
    } else {
        return [];
    }
}

function addBook(bookData) {
    const { title, author, year, isComplete, cover } = bookData
    if (isEmpty(title, author, year, isComplete)) {
        showSwal('error', 'Data yang kammu masukkan kosong!')
        return false
    }
    const books = getBooks();
    const id = Date.now();
    const newBook = {
        id: id,
        title: title,
        author: author,
        year: year,
        isComplete: isComplete,
        cover: cover,
    };
    books.push(newBook);
    saveBooks(books);
}

function isEmpty(...params) {
    for (let param of params) {

        if (param === '' || param === null || param === undefined) {
            return true;
        }
    }
    return false;
}

async function findBookByTitle(title) {
    const books = await getBooks();
    const foundBooks = await books.filter(book => book.title.toLowerCase().includes(title.toLowerCase()));
    const completeTotal = findCompleteBook(foundBooks).total;
    const uncompleteTotal = findUnCompleteBook(foundBooks).total;
    return { complete: completeTotal, uncomplete: uncompleteTotal, datas: foundBooks };
}

function findCompleteBook(obj = null) {
    const books = obj ?? getBooks();
    const foundBooks = books.filter(book => (book.isComplete === 'true' || book.isComplete == true));
    return { total: foundBooks.length, datas: foundBooks };
}

function findUnCompleteBook(obj = null) {
    const books = obj ?? getBooks();
    const foundBooks = books.filter(book => (book.isComplete === 'false' || book.isComplete === false));
    return { total: foundBooks.length, datas: foundBooks };
}

function updateBook(id, updatedBookData) {
    id = (typeof id === 'number') ? id : Number(id);
    const books = getBooks();

    const bookIndex = books.findIndex(book => book.id === id);

    if (bookIndex === -1) {
        console.log('Book not found');
        return false;
    }

    books[bookIndex] = {
        ...books[bookIndex],
        ...updatedBookData
    };

    saveBooks(books);
    return true;
}


function deleteBookById(id) {
    id = (typeof id == 'number') ? id : Number(id)
    let books = getBooks();
    books = books.filter(book => book.id !== id);
    saveBooks(books);
}