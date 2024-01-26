import React from 'react';

const Book = ({ book, addBookToBasket }) => (
    <div id={`book${book.id}`} className={book.no_copies === 0 ? 'noCopies' : ''}>
        <img src={book.url} alt={book.title} onClick={() => addBookToBasket(book.id)} />
        <div className="infoPanel">
            <p>Tytuł: {book.title}</p>
            <p>Autor: {book.author}</p>
            <p className="copies">Liczba wolnych egzemplarzy: {book.no_copies}</p>
            <p>Wydział: {book.faculty}</p>
            <p>Kierunek studiów: {book.major}</p>
        </div>
    </div>
);

export default Book;