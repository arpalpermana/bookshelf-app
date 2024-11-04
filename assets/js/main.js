document.addEventListener("DOMContentLoaded", () => {
  let books = [];
  let booksFound = [];
  const RENDER_EVENT = "render-books";
  const SEARCH_EVENT = "search-books";
  const SAVED_EVENT = "saved-books";
  const LOCAL_STORAGE_KEY = "books-data";

  document.addEventListener(RENDER_EVENT, () => {
    const uncompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    uncompleteBookList.innerHTML = "";
    completeBookList.innerHTML = "";

    for (const book of books) {
      const bookElement = makeBookElement(book);
      if (!book.isComplete) {
        uncompleteBookList.append(bookElement);
      } else {
        completeBookList.append(bookElement);
      }
    }
  });

  document.addEventListener(SAVED_EVENT, () => {
    window.alert("Books Updated!");
  });

  document.addEventListener(SEARCH_EVENT, () => {
    const uncompleteBookList = document.getElementById("incompleteBookList");
    const completeBookList = document.getElementById("completeBookList");

    if (booksFound.length === 0) {
      uncompleteBookList.innerHTML = "<p>Book Not Found</p>";
      completeBookList.innerHTML = "<p>Book Not Found</p>";
    } else {
      uncompleteBookList.innerHTML = "";
      completeBookList.innerHTML = "";
    }

    for (const book of booksFound) {
      const bookElement = makeBookElement(book);
      if (!book.isComplete) {
        uncompleteBookList.append(bookElement);
      } else {
        completeBookList.append(bookElement);
      }
    }
  });

  function checkBrowserCompatibility() {
    return typeof Storage !== undefined ? true : false;
  }

  function loadData() {
    const booksFromLocal = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (booksFromLocal !== null) {
      books = booksFromLocal.map((book) => book);
    } else {
      return books;
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  function saveBook() {
    if (checkBrowserCompatibility()) {
      const booksToLocal = JSON.stringify(books);
      localStorage.setItem(LOCAL_STORAGE_KEY, booksToLocal);
      document.dispatchEvent(new Event(SAVED_EVENT));
    }
  }

  if (checkBrowserCompatibility()) {
    loadData();
  }

  const isCompletedForm = document.getElementById("bookFormIsComplete");
  isCompletedForm.addEventListener("click", () => {
    const isCompletedText = document.getElementById("isCompletedText");
    if (isCompletedForm.checked == true) {
      isCompletedText.innerText = "selesai dibaca";
    } else {
      isCompletedText.innerText = "belum selesai dibaca";
    }
  });

  const addBookForm = document.getElementById("bookForm");
  addBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    addNewBook();
  });

  const searchBookForm = document.getElementById("searchBook");
  const searchBookInput = document.getElementById("searchBookTitle");
  searchBookForm.addEventListener("submit", (e) => {
    e.preventDefault();
    searchBook();
  });

  searchBookInput.addEventListener("input", () => {
    searchBook();
  });

  function searchBook() {
    const bookTitle = searchBookInput.value.toUpperCase();
    booksFound = books.filter((book) =>
      book.title.toUpperCase().includes(bookTitle)
    );

    document.dispatchEvent(new Event(SEARCH_EVENT));
  }

  function addNewBook() {
    const id = genereteID();
    const bookTitle = document.getElementById("bookFormTitle").value;
    const bookAuthor = document.getElementById("bookFormAuthor").value;
    const bookYear = Number(document.getElementById("bookFormYear").value);
    const isComplete = isCompletedForm.checked;
    books.push(makeBookObject(id, bookTitle, bookAuthor, bookYear, isComplete));
    document.getElementById("bookFormTitle").value = "";
    document.getElementById("bookFormAuthor").value = "";
    document.getElementById("bookFormYear").value = "";
    isCompletedForm.checked = false;
    document.getElementById("isCompletedText").innerText =
      "belum selesai dibaca";
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  function makeBookObject(id, title, author, year, isComplete) {
    return {
      id: id,
      title: title,
      author: author,
      year: year,
      isComplete: isComplete,
    };
  }

  function genereteID() {
    const maxID = books.reduce((acc, book) => Math.max(acc, book.id), 0);
    return maxID + 1;
  }

  function makeBookElement(book) {
    const bookTitleElement = document.createElement("h3");
    bookTitleElement.setAttribute("data-testid", "bookItemTitle");
    bookTitleElement.innerText = book.title;

    const bookAuthorElement = document.createElement("p");
    bookAuthorElement.setAttribute("data-testid", "bookItemAuthor");
    bookAuthorElement.innerText = book.author;

    const bookYearElement = document.createElement("p");
    bookYearElement.setAttribute("data-testid", "bookItemYear");
    bookYearElement.innerText = `Tahun : ${book.year}`;

    const bookContainer = document.createElement("div");
    bookContainer.classList.add("bookInfo");
    bookContainer.append(bookTitleElement, bookAuthorElement, bookYearElement);

    const editBookButton = document.createElement("button");
    const editButtonIcon = document.createElement("i");
    editButtonIcon.classList.add("fa-solid", "fa-pen-to-square");
    editBookButton.setAttribute("id", "editButton");
    editBookButton.setAttribute("data-testid", "bookItemEditButton");
    editBookButton.append(editButtonIcon);
    editBookButton.addEventListener("click", () => editBook(book));

    const removeBookButton = document.createElement("button");
    const removeButtonIcon = document.createElement("i");
    removeButtonIcon.classList.add("fa-solid", "fa-trash");
    removeBookButton.setAttribute("id", "deleteButton");
    removeBookButton.setAttribute("data-testid", "bookItemDeleteButton");
    removeBookButton.append(removeButtonIcon);
    removeBookButton.addEventListener("click", () => removeBook(book.id));

    const buttonContainer = document.createElement("div");
    buttonContainer.classList.add("bookButtonGroup");
    buttonContainer.append(editBookButton, removeBookButton);

    const container = document.createElement("div");
    container.setAttribute("data-bookid", book.id);
    container.setAttribute("data-testid", "bookItem");
    container.classList.add("bookItem");
    container.append(bookContainer);

    if (!book.isComplete) {
      const completedButton = document.createElement("button");
      const completedButtonIcon = document.createElement("i");
      completedButtonIcon.classList.add("fa-solid", "fa-square-check");
      completedButton.setAttribute("id", "completeButton");
      completedButton.setAttribute("data-testid", "bookItemIsCompleteButton");
      completedButton.append(completedButtonIcon);
      completedButton.addEventListener("click", () => bookCompleted(book.id));
      buttonContainer.append(completedButton);
    } else {
      const undocompletedButton = document.createElement("button");
      const undocompletedButtonIcon = document.createElement("i");
      undocompletedButtonIcon.classList.add("fa-solid", "fa-arrow-rotate-left");
      undocompletedButton.setAttribute("id", "undoCompleteButton");
      undocompletedButton.setAttribute(
        "data-testid",
        "bookItemIsCompleteButton"
      );
      undocompletedButton.append(undocompletedButtonIcon);
      undocompletedButton.addEventListener("click", () =>
        undoBookCompleted(book.id)
      );

      buttonContainer.append(undocompletedButton);
    }

    container.append(buttonContainer);
    return container;
  }

  function bookCompleted(id) {
    books = books.map((book) =>
      book.id === id ? { ...book, isComplete: true } : book
    );
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  function undoBookCompleted(id) {
    books = books.map((book) =>
      book.id === id ? { ...book, isComplete: false } : book
    );
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  function removeBook(id) {
    books = books.filter((book) => book.id !== id);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveBook();
  }

  function editBook(bookData) {
    const updateModal = document.getElementById("updateBook");
    updateModal.style.display = "flex";

    const closeModalButton = document.getElementById("closeModal");
    closeModalButton.addEventListener("click", () => {
      updateModal.style.display = "none";
    });

    window.addEventListener("click", (e) => {
      if (e.target === updateModal) {
        updateModal.style.display = "none";
      }
    });

    const bookTitleInput = document.getElementById("updateBookTitle");
    bookTitleInput.value = bookData.title;
    const bookAuthorInput = document.getElementById("updateBookAuthor");
    bookAuthorInput.value = bookData.author;
    const bookYearInput = document.getElementById("updateBookYear");
    bookYearInput.value = bookData.year;
    const isCompletedCheckBox = document.getElementById("updateBookIsComplete");
    if (bookData.isComplete) {
      isCompletedCheckBox.checked = bookData.isComplete;
    } else {
      isCompletedCheckBox.checked = bookData.isComplete;
    }

    const updateBookForm = document.getElementById("updateBookForm");
    updateBookForm.addEventListener("submit", (e) => {
      books = books.map((book) =>
        book.id == bookData.id
          ? {
              ...bookData,
              title: bookTitleInput.value,
              author: bookAuthorInput.value,
              year: bookYearInput.value,
              isComplete: isCompletedCheckBox.checked,
            }
          : book
      );
      updateModal.style.display = "none";
      saveBook();
    });
  }
});
