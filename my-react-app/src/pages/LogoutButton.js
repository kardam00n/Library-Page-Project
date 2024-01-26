import React from 'react';
import { Link } from 'react-router-dom';

const LogoutButton = () => {
    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:8000/logout', {
                method: 'GET',
                credentials: 'include',  // Додаємо цей параметр для передачі креденцій (кукіси) разом із запитом
            });

            if (response.ok) {
                // Логіка виходу пройшла успішно, перенаправлення на сторінку входу
                window.location.href = '/login';
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('An error occurred during logout:', error);
        }
    };

    return <Link to="#" onClick={handleLogout}>Logout</Link>;
};

export default LogoutButton;