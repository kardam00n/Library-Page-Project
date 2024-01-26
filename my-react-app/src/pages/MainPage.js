import React from 'react';
import book1 from '../img/python.jpeg';
import book2 from '../img/cormen.jpg';
import book3 from '../img/dogbook.jpg';
import book4 from '../img/banish.jpg';

const App = () => {
    const mainBooks = [
        { title: 'Python', url: book1 },
        { title: 'Wprowadzenie do Algorytmów', url: book2 },
        { title: 'Sztuka Programowania', url: book3 },
        { title: 'Wstęp do Linuxa', url: book4 },
    ];

    return (
        <div>

            <div className="mainPanel">
                <h1>Akademia Górniczo Hutnicza</h1>
                <div className="bookPanel">
                    {mainBooks.map((book, index) => (
                        <div key={index} className="bookContainer">
                            <p>{book.title}</p>
                            <img className="book" src={book.url} alt={book.title} />
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

export default App;