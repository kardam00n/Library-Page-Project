import React, { useState } from 'react';
import '../css/login.css';


const LoginForm = () => {
    const [loginData, setLoginData] = useState({
        username: '',
        password: '',
    });

    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLoginData({
            ...loginData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(loginData),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                setErrorMessage('Login successful!');
                window.location.href = '/main';
            } else {
                setErrorMessage('Login failed. Username or password is not correct.');
                console.error('Login failed. Username or password is not correct.');
            }
        } catch (error) {
            setErrorMessage('An error occurred during login.');
            console.error('An error occurred during login:', error);
        }
    };


    return (
        <div className="login-form">
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <label>
                    Email:
                    <input
                        type="username"
                        name="username"
                        value={loginData.username}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Password:
                    <input
                        type="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleChange}
                        required
                    />
                </label>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginForm;