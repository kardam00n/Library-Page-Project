import React, { useEffect, useState } from 'react';
import '../css/styles.css';

function Book({ book, addBookToBasket, basketBooks, books }) {

    const [copiesLeft, setCopiesLeft] = useState(book.no_copies)
    const [displayedCopies, setDisplayedCopies] = useState(book.no_copies);


    useEffect(() => {
        var findBook = basketBooks.find(basketBook => basketBook.book.id === book.id);
        if (findBook) {
            setDisplayedCopies(book.no_copies - findBook.no_copies + "/" + book.no_copies);
            setCopiesLeft(book.no_copies - findBook.no_copies);
        }
        else {
            setCopiesLeft(book.no_copies);
            setDisplayedCopies(book.no_copies);
            console.log('refresh')
        }
    }, [basketBooks, books]);
    return (
        <div id={`book${book.id}`} className={`${(book.no_copies === 0 || copiesLeft === 0) ? 'noCopies' : ''} bookContainer`}>
            <div className="lbook">            <img src={book.url} alt={book.title} onClick={() => addBookToBasket(book.id)} /></div>

            <div className="infoPanel">
                <p>Title: {book.title}</p>
                <p>Author: {book.author}</p>
                <p className="copies">Number of available copies: {displayedCopies}</p>
                <p>Faculty: {book.faculty}</p>
                <p>Field of study: {book.major}</p>
            </div>
        </div>
    );
}

export default Book;