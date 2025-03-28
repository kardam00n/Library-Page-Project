import React, { useEffect, useState } from 'react';
import '../css/styles.css';
import { useNavigate } from "react-router-dom";

const RentedBooks = () => {
    const [rentedBooks, setRentedBooks] = useState([])
    const error = false; // Set to true if there's an error
    const errorMSG = "Your error message"; // Set your error message

    let navigate = useNavigate();

    const [flag, setFlag] = useState(true)
    const [role, setRole] = useState()

    const checkRole = async () => {
        await fetch('http://localhost:8000/profile', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include credentials for session
        }).then(async (response) => {
            if (response.ok) {
                let data = await response.json();
                setRole(data.role);
                console.log("Setting role: " + data.role)
            } else {
                console.error('An error occurred while fetching the user:', response.statusText);
            }
        });

    }

    const returnBook = async (bookId) => {
        try {
            await fetch(`http://localhost:8000/returnBook`, {
                method: 'POST',
                credentials: 'include', // Include credentials for session
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: bookId }),
            });

            setFlag(!flag);
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    const fetchBooks = async () => {
        try {
            const response = await fetch('http://localhost:8000/rentedBooks', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include credentials for session
            });
            if (response.ok) {
                const data = await response.json();
                setRentedBooks(data.rentedBooks);
            } else {
                const data = await response.json();
                if (data.error === "notSigned") {
                    navigate("/login")
                }
                console.error('An error occurred while fetching the books:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred while fetching the books:', error.message);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [flag]);

    useEffect(() => {
        checkRole();
        fetchBooks();
    }, []);

    return (
        <body>
            <div className="mainPanel">
                {error ? (
                    <h2>{errorMSG}</h2>
                ) : (
                    <div className="errorPanel"></div>
                )}
                <div className="bookPanel">
                    {role === 'user' ?
                        <h2>Books you borrowed:</h2> :
                        <h2>All borrowed books:</h2>
                    }
                    {rentedBooks.map((rbook) => (
                        <div key={`book${rbook.book.id}`} className="bookContainer">
                            <div className="lbook">
                                <img src={rbook.book.url} alt={rbook.book.title}
                                /></div>
                            <div className="infoPanel">
                                {role === 'admin' && (
                                    <p>Student: {rbook.student.username}</p>)}
                                <p>Title: {rbook.book.title}</p>
                                <p>Author: {rbook.book.author}</p>
                                <p className="copies">Number of copies borrowed: {rbook.no_copies}</p>
                                {role === 'user' && (
                                    <button type="button" onClick={() => returnBook(rbook.book.id)}>
                                        Give back
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="stopka">
                <p>Biblioteka Główna Akademii Górniczo-Hutniczej im. Stanisława Staszica w Krakowie</p>
                <p>tel. +48 12 617 32 08</p>
                <p>e-mail: bgagh@bg.agh.edu.pl</p>
            </div>
        </body >
    );
};


export default RentedBooks;