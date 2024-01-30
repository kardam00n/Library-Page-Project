import React from 'react';
import '../css/styles.css';
import '../css/booklist.css';

const Basket = ({ basketBooks, rentBooks, returnFromBasket }) => (
    <div className="basket">
        <div className="basket-row">
            <img src="img/basket.png"></img>
            <h1>Basket</h1>
        </div>

        <div className="basketList">
            {basketBooks.length === 0 ? <p>No books in basket</p> : basketBooks.map(book => (
                <div className="basketContainer" key={book.book.id}>
                    <img src={book.book.url} onClick={() => returnFromBasket(book.book.id)} />
                    <p>{book.book.title}</p>
                    <p>{book.no_copies}</p>

                </div>
            ))}
            <button onClick={rentBooks}>Borrow</button>
        </div>
    </div>
);

export default Basket;