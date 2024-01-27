var rentedBooks = [];

function rentBooks() {
  var xhr = new XMLHttpRequest();

  xhr.addEventListener("load", function (evt) {
    var response = JSON.parse(xhr.responseText);
    if (response.error) {
      displayError(response.errorMSG);
    }
    else {
      rentedBooks = []
      response.rentedBooks.forEach((book) => {
        updateBookContainer(book.book);
      });

      updateBasket();
    }
  });

  xhr.addEventListener("error", function (evt) {
    window.alert('There was a problem with this request.');
  });
  xhr.open('POST', "http://localhost:8000/rentBooks", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ "rentedBooks": rentedBooks }));
}

function addBook(id) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", function (evt) {
    var response = JSON.parse(xhr.responseText);
    if (response.error) {
      console.log(response.errorMSG);
      displayError(response.errorMSG);
    }
    else {
      if (rentedBooks.length == 0) {
        var newPos = {
          'book': response.book,
          'no_copies': 1,
        }

        rentedBooks.push(newPos);
      }
      else {
        const foundBook = rentedBooks.find(obj => obj.book.id === response.book.id);
        if (foundBook && response.book.no_copies - foundBook.no_copies > 0) {
          foundBook.no_copies += 1;
        }
        else if (!foundBook) {
          var newPos = {
            'book': response.book,
            'no_copies': 1,
          }

          rentedBooks.push(newPos);
        }
        else {
          msg = "Nie możesz dodać więcej książek tego rodzaju do koszyka"
          displayError(msg);
        }
      }
      updateBasket();
      updateBookContainer(response.book);
    }
  });

  xhr.addEventListener("error", function (evt) {
    window.alert('There was a problem with this request.');
  });
  xhr.open('POST', "http://localhost:8000/addBookToBasket", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ "id": id }));
}

function deleteBook(id) {
  const xhr = new XMLHttpRequest();


  xhr.addEventListener("load", function (evt) {
    var response = JSON.parse(xhr.responseText);
    const foundBook = rentedBooks.find(obj => obj.book.id === response.book.id);
    if (foundBook.no_copies > 1) {
      foundBook.no_copies -= 1;
    }
    else {
      const index = rentedBooks.findIndex(obj => obj === foundBook);
      rentedBooks.splice(index, 1);
    }
    updateBasket();
    updateBookContainer(response.book);
  });

  xhr.addEventListener("error", function (evt) {
    window.alert('There was a problem with this request.');
  });
  xhr.open('POST', "http://localhost:8000/deleteBookFromBasket", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ "id": id }));
}

function returnBook(id) {
  const xhr = new XMLHttpRequest();


  xhr.addEventListener("load", function (evt) {
    var response = JSON.parse(xhr.responseText);
    if (response.error) {
      displayError(response.errorMSG);
    }
    else {
      updateRentedList();
    }
  });

  xhr.addEventListener("error", function (evt) {
    window.alert('There was a problem with this request.');
  });
  xhr.open('POST', "http://localhost:8000/returnBook", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ "id": id }));
}

function truncateText(text, maxLength) {
  if (text.length > maxLength) {
    return text.slice(0, maxLength - 3) + '...';
  }
  return text;
}

function updateBasket() {
  const basketDiv = document.querySelector('.basketList');
  basketDiv.innerHTML = '';

  if (rentedBooks && rentedBooks.length > 0) {
    rentedBooks.forEach((rbook) => {
      const maxLength = 8;
      var basketContainer = document.createElement('div');
      basketContainer.classList.add("basketContainer");
      var basketimg = document.createElement('img');
      var baskettitle = document.createElement('p');
      var basketauthor = document.createElement('p');
      basketimg.src = rbook.book.url;
      baskettitle.innerText = truncateText(rbook.book.title, maxLength);
      basketauthor.innerText = truncateText(rbook.book.author, maxLength);

      basketimg.addEventListener('click', function () {
        deleteBook(rbook.book.id);
      });

      var basketCount = document.createElement('p');
      basketCount.innerText = rbook.no_copies;

      basketContainer.appendChild(basketimg);
      basketContainer.appendChild(baskettitle);
      basketContainer.appendChild(basketauthor);
      basketContainer.appendChild(basketCount);
      basketDiv.appendChild(basketContainer);
    });
    var rentButton = document.createElement('button');
    rentButton.textContent = 'Borrow';
    rentButton.addEventListener('click', () => rentBooks(rentedBooks));
    basketDiv.appendChild(rentButton);
  } else {
    const p = document.createElement('p');
    p.textContent = 'No books in basket';
    basketDiv.appendChild(p);
  }
}

function updateBookContainer(book) {
  const xhr = new XMLHttpRequest();


  xhr.addEventListener("load", function (evt) {
    var foundBookConainter = document.querySelector("#book" + String(book.id));
    var foundBookCopies = foundBookConainter.querySelector(".copies");
    var updatedBook = JSON.parse(xhr.responseText).book;
    if (rentedBooks && rentedBooks.length > 0) {
      var foundBook = rentedBooks.find(obj => obj.book.id === book.id);
      if (foundBook) {
        var leftBooks = book.no_copies - foundBook.no_copies;
        foundBookCopies.innerText = "Liczba wolnych egzemplarzy: " + leftBooks + "/" + updatedBook.no_copies;
      }
      else {
        foundBookCopies.innerText = "Liczba wolnych egzemplarzy: " + updatedBook.no_copies;
      }

      if (leftBooks == 0) {
        foundBookConainter.classList.add('noCopies');
      }
      else {
        foundBookConainter.classList.remove('noCopies');
      }

    }
    else {
      foundBookCopies.innerText = "Liczba wolnych egzemplarzy: " + updatedBook.no_copies;
    }
  });

  xhr.addEventListener("error", function (evt) {
    window.alert('There was a problem with this request.');
  });
  xhr.open('POST', "http://localhost:8000/updateBookContainer", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify({ "id": book.id }));
}

function updateRentedList() {
  const xhr = new XMLHttpRequest();


  xhr.addEventListener("load", function (evt) {
    var response = JSON.parse(xhr.responseText);
    if (response.error) {
      displayError(response.errorMSG);
    }
    else {
      var rentedBooks = response.rentedBooks;
      var bookPanel = document.querySelector(".bookPanel");
      bookPanel.innerHTML = '';
      var h = document.createElement('h1');
      h.innerText = "Books you borrowed:";
      bookPanel.appendChild(h);


      rentedBooks.forEach((rbook) => {
        // Create the book container
        const bookDiv = document.createElement('div');
        bookDiv.setAttribute('id', `book${rbook.book.id}`);
        bookDiv.classList.add('bookContainer');

        // Create the book image element
        const bookImg = document.createElement('img');
        bookImg.classList.add('book');
        bookImg.setAttribute('src', rbook.book.url);
        bookImg.setAttribute('alt', rbook.book.title);

        // Create the info panel
        const infoPanel = document.createElement('div');
        infoPanel.classList.add('infoPanel');

        // Create the book details elements
        const titleParagraph = document.createElement('p');
        titleParagraph.textContent = `Title: ${rbook.book.title}`;

        const authorParagraph = document.createElement('p');
        authorParagraph.textContent = `Author: ${rbook.book.author}`;

        const copiesParagraph = document.createElement('p');
        copiesParagraph.classList.add('copies');
        copiesParagraph.textContent = `Number of copies borrowed: ${rbook.no_copies}`;

        // Create the return button
        const returnButton = document.createElement('button');
        returnButton.setAttribute('type', 'button');
        returnButton.textContent = 'Give back';
        returnButton.addEventListener('click', () => {
          returnBook(rbook.book.id);
        });

        // Append elements to their respective parents
        infoPanel.appendChild(titleParagraph);
        infoPanel.appendChild(authorParagraph);
        infoPanel.appendChild(copiesParagraph);
        infoPanel.appendChild(returnButton);

        bookDiv.appendChild(bookImg);
        bookDiv.appendChild(infoPanel);

        bookPanel.appendChild(bookDiv);
      });
    }
  });

  xhr.addEventListener("error", function (evt) {
    window.alert('There was a problem with this request.');
  });
  xhr.open('POST', "http://localhost:8000/updateRentedList", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send();
}

function displayError(errorMSG) {
  const errorPanel = document.querySelector('.errorPanel');
  var newError = document.createElement('h1');
  newError.innerHTML = errorMSG;
  newError.classList.add('errorPanel');
  errorPanel.appendChild(newError);

  setTimeout(function () {
    newError.style.opacity = '0';
    newError.addEventListener('transitionend', function () {
      errorPanel.removeChild(newError);
    });
  }, 3000);
}