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
        <body>
            <div className="back-header">
                <h1>Biblioteka Główna AGH</h1>
                <a href="/books" className="loginbutton">See books</a>
            </div>
            <div className="stopka">
                <p>Biblioteka Główna Akademii Górniczo-Hutniczej im. Stanisława Staszica w Krakowie</p>
                <p>tel. +48 12 617 32 08</p>
                <p>e-mail: bgagh@bg.agh.edu.pl</p>
            </div>
        </body>
    );
};

export default App;