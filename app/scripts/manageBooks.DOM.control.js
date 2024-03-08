class bookCard {
    constructor(parentElement, bookCardDatas) {
        this.parentElement = parentElement
        this.bookCardDatas = bookCardDatas
    }

    makeBookcard() {
        let bookCard = document.createElement('div')
        const { id, title, author, year, cover } = this.bookCardDatas
        const bookCardInnerHtml = `
                <div class="book-card rounded-2 m-2 p-2 d-flex flex-column row-gap-2">
                    <div class="d-flex">
                        <figcaption class="w-25 m-1 rounded-1  bg-body-tertiary ">
                            <img src="${cover !== '' ? cover : './app/assets/default.png'}"
                                alt="Cover buku ${title}" class="w-100" onerror="this.src = './app/assets/default.png'">
                        </figcaption>
                        <div class="m-1 flex-grow-1 px-1 ">
                            <h5 class="m-0 mb-1 ">${title}</h5>
                            <i class="m-0">Ditulis oleh: ${author}</i>
                            <p class="m-0">Terbit tahun: ${year}</p>
                        </div>
                    </div>
                    <div class="d-flex gap-2 justify-content-end ">
                        <button type="button" class="btn btn-sm btn-warning" data-bs-toggle="modal"
                            data-bs-target="#update-book-modal"
                            data-book-json='${JSON.stringify(this.bookCardDatas)}'
                            onclick="setupUpdateModal(this)">
                            <i class="bi bi-pencil-square"></i>
                            <span>Ubah</span>
                        </button>
                        <button type="button" class="btn btn-sm btn-danger " data-toggle="modal"
                            data-target="#delete-modal" data-book-id="${id}">
                            <i class="bi bi-trash"></i>
                            <span>Hapus</span>
                        </button>
                    </div>
                </div>
        `
        bookCard.innerHTML = bookCardInnerHtml
        this.parentElement.appendChild(bookCard)
    }

    init() {
        this.makeBookcard();
    }
}