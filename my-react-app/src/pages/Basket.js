import React from 'react';

const Basket = ({ basketBooks }) => (
    <div>
        <h1>Koszyk</h1>
        <div className="basketList">
            {basketBooks.length === 0 ? <p>No books in basket</p> : basketBooks.map(book => (
                <p key={book.id}>{book.title}</p>
            ))}
        </div>
    </div>
);

export default Basket;