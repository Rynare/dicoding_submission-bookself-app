window.addEventListener('DOMContentLoaded', () => {
    let currentSearchQuery = getQueryParameter('search-book')


    window.addEventListener('popstate', () => window.location.reload())

    runNewBookSubmitEvent()
    runSearchBarEvent()
    runUpdateBookSubmitEvent()

    if (!isEmpty(currentSearchQuery)) {
        document.querySelector('form #search-book').value = currentSearchQuery
        document.querySelector('header button#search-book-btn').click()
    }

})

function runNewBookSubmitEvent() {
    const newBookForm = document.querySelector('#add-book-form');
    const newBookFormSubmitBtn = newBookForm.querySelector('button[type=submit]');
    newBookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(newBookForm, newBookFormSubmitBtn)
        const { title, author, year, isComplete, cover } = getAllFormData(formData);

        if (!isImageUrl(cover)) {
            if (!confirm('Data yang kamu masukkan bukan sebuah gambar.\nKLIK "OK" untuk tetap menyimpan URL')) {
                return
            }
        }

        addBook({
            'title': sanitizeInput(title),
            'author': sanitizeInput(author),
            'year': sanitizeInput(year),
            'isComplete': sanitizeInput(isComplete),
            'cover': sanitizeInput(cover),
        })

        newBookForm.querySelector('button[type=reset]').click()
    })
}

function runSearchBarEvent() {
    const searchBar = document.querySelector('header input[type=search]')
    const searchBtn = document.querySelector('header button#search-book-btn')
    const searchForm = document.querySelector('header form')

    searchForm.addEventListener('submit', (event) => {
        event.preventDefault()
        const newUrl = window.location.origin + window.location.pathname + '?search-book=' + sanitizeInput(searchBar.value);
        window.history.pushState({ path: newUrl }, '', newUrl);
    })

    searchBar.addEventListener('search', (event) => {
        event.preventDefault()
        // sessionStorage.setItem('after-refresh', false);
        searchBtn.click()
    })

    searchBtn.addEventListener('click', () => {
        if (isEmpty(searchBar.value)) {
            return
        }
        const input = sanitizeInput(searchBar.value)
        const unCompleteBookself = document.querySelector('.uncomplete-book-container')
        const CompleteBookself = document.querySelector('.complete-book-container')

        const unCompleteValue = document.querySelector('#uncomplete-book-value')
        const CompleteValue = document.querySelector('#complete-book-value')

        unCompleteBookself.innerHTML = ''
        CompleteBookself.innerHTML = ''

        unCompleteValue.innerText = '0'
        CompleteValue.innerText = '0'

        findBookByTitle(input).then((datas) => {
            const results = datas.datas

            if (results.length <= 0) {
                alert(`Kami tidak dapat menemukan data yang kamu cari!!!`)
            } else {
                unCompleteValue.innerText = datas.uncomplete
                CompleteValue.innerText = datas.complete
                results.forEach(data => {
                    if (data.isComplete === 'true') {
                        new bookCard(CompleteBookself, data).init()
                    } else {
                        new bookCard(unCompleteBookself, data).init()
                    }
                });
                if (datas.complete >= 1) {
                    if (document.querySelector('.accordion-button.collapsed #complete-value')) {
                        CompleteValue.click()
                    }
                } else if (datas.uncomplete >= 1) {
                    if (document.querySelector('.accordion-button.collapsed #uncomplete-value')) {
                        unCompleteValue.click()
                    }
                }
            }
        })

    })
}

function runUpdateBookSubmitEvent() {
    const updateBookForm = document.querySelector('#update-book-form');
    const updateBookFormSubmitBtn = updateBookForm.querySelector('button[type=submit]');
    updateBookForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const formData = new FormData(updateBookForm, updateBookFormSubmitBtn)
        const { id, title, author, year, isComplete, cover } = getAllFormData(formData);

        if (!isImageUrl(cover)) {
            if (!confirm('Data yang kamu masukkan bukan sebuah gambar.\nKLIK "OK" untuk tetap menyimpan URL')) {
                return
            }
        }

        updateBook(id, {
            'title': sanitizeInput(title),
            'author': sanitizeInput(author),
            'year': sanitizeInput(year),
            'isComplete': sanitizeInput(isComplete),
            'cover': sanitizeInput(cover),
        })
        updateBookForm.querySelector('button[type=reset]').click()
        window.location.reload()
    })
}

function getAllFormData(form_data) {
    let datas = {}
    form_data.forEach((value, key) => {
        datas[key] = value
    })
    return datas;
}

function setupUpdateModal(element) {
    const updateForm = document.querySelector(`${element.getAttribute('data-bs-target')} form`);
    const datas = JSON.parse(element.getAttribute('data-book-json'))

    updateForm.querySelector('[name=id]').value = datas.id
    updateForm.querySelector('[name=title]').value = datas.title
    updateForm.querySelector('[name=author]').value = datas.author
    updateForm.querySelector('[name=year]').value = datas.year
    updateForm.querySelector('[name=cover]').value = datas.cover ?? ''
    updateForm.querySelector('[name=isComplete]').value = datas.isComplete
}

function sanitizeInput(inputValue) {
    let trimmedValue = inputValue.trim();
    let valueWithoutOverSpace = trimmedValue.replace('  ', ' ');
    if (valueWithoutOverSpace.includes('  ')) {
        return sanitizeInput(valueWithoutOverSpace);
    } else {
        return cleanText(valueWithoutOverSpace);
    }
}

function cleanText(inputText) {
    // Membersihkan kode HTML - source W3School
    let cleanedHTML = inputText.replace(/<[^>]*>/g, '');
    // Membersihkan kode JavaScript - source stackovverflow
    let cleanedJS = cleanedHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    // Membersihkan kode CSS - source stackoverflow
    let cleanedCSS = cleanedJS.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    return cleanedCSS;
}

function isImageUrl(url) {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp'];
    const urlExtension = url.split('.').pop().toLowerCase();
    return imageExtensions.includes('.' + urlExtension);
}

function getQueryParameter(parameterName) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(parameterName);
}