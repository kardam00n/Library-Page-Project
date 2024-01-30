import React, {useEffect, useState} from 'react';
import '../css/styles.css';

function Book({ book, addBookToBasket, basketBooks}) {

    const [copiesLeft, setCopiesLeft] = useState(book.no_copies)
    const [displayedCopies, setDisplayedCopies] = useState(book.no_copies);


    useEffect(() => {
        var findBook = basketBooks.find(basketBook => basketBook.book.id === book.id);
        if(findBook) {
            setDisplayedCopies(book.no_copies - findBook.no_copies + "/" + book.no_copies);
            setCopiesLeft(book.no_copies - findBook.no_copies);
        }
        else{
            setCopiesLeft(book.no_copies);
            setDisplayedCopies(book.no_copies);
        }
    }, [basketBooks]);
    return (
        <div id={`book${book.id}`} className={`${(book.no_copies === 0 || copiesLeft === 0) ? 'noCopies' : ''} bookContainer` }>
            <img src={book.url} alt={book.title} onClick={() => addBookToBasket(book.id)} />
            <div className="infoPanel">
                <p>Tytuł: {book.title}</p>
                <p>Autor: {book.author}</p>
                <p className="copies">Liczba wolnych egzemplarzy: {displayedCopies}</p>
                <p>Wydział: {book.faculty}</p>
                <p>Kierunek studiów: {book.major}</p>
            </div>
        </div>
    );
}

export default Book;