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

            <div className="back-header">
                <h1>Biblioteka Główna AGH</h1>
                <a href="/books" className="loginbutton">See books</a>
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