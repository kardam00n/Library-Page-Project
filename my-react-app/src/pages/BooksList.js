import React, { useState } from 'react';
import Book from "./Book.js";
import Basket from "./Basket.js";

const BooksList = () => {
    const [books, setBooks] = useState([]); // Initialize books state
    const [basketBooks, setBasketBooks] = useState([]); // Initialize basket state

    const addBookToBasket = (bookId) => {
        // Add the selected book to the basket
        const selectedBook = books.find(book => book.id === bookId);
        setBasketBooks(prevBasket => [...prevBasket, selectedBook]);
    };

    return (
        <div>
            <div className="mainPanel">
                <div className="errorPanel"></div>
                <div className="bookPanel">

                </div>
            </div>
            <div className="stopka">
                <p>Biblioteka Główna Akademii Górniczo-Hutniczej im. Stanisława Staszica w Krakowie</p>
                <p>tel. +48 12 617 32 08</p>
                <p>e-mail: bgagh@bg.agh.edu.pl</p>
            </div>
        </div>
    );
};

export default BooksList;