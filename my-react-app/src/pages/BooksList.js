import React, { useEffect, useState } from 'react';
import Book from "./Book.js";
import Basket from "./Basket.js";
import '../css/styles.css';
import '../css/booklist.css'

const BooksList = () => {
    const [books, setBooks] = useState([]); // Initialize books state
    const [basketBooks, setBasketBooks] = useState([]); // Initialize basket state

    useEffect(() => {

    }, [basketBooks]);

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const response = await fetch('http://localhost:8000/books', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', // Include credentials for session
                });
                if (response.ok) {
                    const data = await response.json();
                    setBooks(data.books);
                } else {
                    console.error('An error occurred while fetching the books:', response.statusText);
                }
            } catch (error) {
                console.error('An error occurred while fetching the books:', error.message);
            }
        };

        fetchBooks();

    }, []);

    const rentBooks = async () => {
        fetch("http://localhost:8000/rentBooks", {
            method: "POST",
            "credentials": "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(basketBooks),
        })

            .catch((error) => {
                console.log(error);

            })
    };

    const returnFromBasket = (bookId) => {
        // Return the selected book from the basket
        const alreadyInBasket = basketBooks.find(book => book.book.id === bookId);

        if (alreadyInBasket) {
            if (alreadyInBasket.no_copies === 1) {
                setBasketBooks(basketBooks.filter(book => book.book.id !== bookId));
            }
            else {
                alreadyInBasket.no_copies -= 1;
                setBasketBooks([...basketBooks])
            }

        }
        else {
            console.log("Book not in basket")
        }
    }

    const addBookToBasket = (bookId) => {
        // Add the selected book to the basket
        const selectedBook = books.find(book => book.id === bookId);
        const alreadyInBasket = basketBooks.find(book => book.book.id === bookId);

        if (alreadyInBasket) {
            if (alreadyInBasket.no_copies === alreadyInBasket.book.no_copies) {
                console.log("No more copies left")
            }
            else {
                alreadyInBasket.no_copies += 1;
                setBasketBooks([...basketBooks])
            }

        }
        else {
            if (selectedBook.no_copies === 0) {
                console.log("No more copies left")
            }
            else {
                let multiBook = {
                    "book": selectedBook,
                    "no_copies": 1,
                }
                setBasketBooks(prevBasket => [...prevBasket, multiBook]);
            }
        }
    };

    return (
        <div>
            <div className="mainPanel">
                <div className="errorPanel"></div>
                <div className="bookPanel">
                    {books.map(book => (
                        <Book key={book.id} book={book} addBookToBasket={addBookToBasket} basketBooks={basketBooks} />
                    ))}
                    <Basket basketBooks={basketBooks} rentBooks={rentBooks} returnFromBasket={returnFromBasket} />
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