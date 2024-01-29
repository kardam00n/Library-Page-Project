import React from 'react';

const RentedBooks = () => {
    const rentedBooks = [/* your rentedBooks data */];
    const error = false; // Set to true if there's an error
    const errorMSG = "Your error message"; // Set your error message

    return (
        <div>
            <div className="mainPanel">
                {error ? (
                    <h2>{errorMSG}</h2>
                ) : (
                    <div className="errorPanel"></div>
                )}
                <div className="bookPanel">
                    <h1>Wypożyczone przez ciebie książki</h1>
                    {rentedBooks.map((rbook) => (
                        <div key={`book${rbook.book.id}`} className="bookContainer">
                            <img className="book" src={rbook.book.url} alt={rbook.book.title} />
                            <div className="infoPanel">
                                <p>Tytuł: {rbook.book.title}</p>
                                <p>Autor: {rbook.book.author}</p>
                                <p className="copies">Liczba wypożyczonych egzemplarzy: {rbook.no_copies}</p>
                                <button type="button" onClick={() => returnBook(rbook.book.id)}>
                                    Oddaj
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stopka">
                <p>Kontakt</p>
                <p>Telefon: 123 456 789</p>
                <p>Adres mailowy: biblio@agh.edu.pl</p>
            </div>
        </div>
    );
};

// Dummy function, replace with your actual returnBook function
const returnBook = (bookId) => {
    console.log(`Returning book with ID: ${bookId}`);
};

export default RentedBooks;