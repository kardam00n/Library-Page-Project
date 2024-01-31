import React, { useState } from 'react';
import '../css/login.css';
import login from '../img/login.jpg';
import logo from '../img/logo-bg.svg';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [loginError, setLoginError] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const { username, password } = formData;

        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                crossDomain: true,
                body: JSON.stringify({ username, password }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Login successful:', data);
                setLoginError('');
                // Redirect or handle successful login as needed
                window.location.href = '/';
            } else {
                setLoginError('Login failed. Username or password is not correct.');
                console.error('Login failed. Username or password is not correct.');
            }
        } catch (error) {
            setLoginError('An error occurred during login. Please try again later.');
            console.error('An error occurred during login:', error);
        }
    };

    return (
        <div className="mainPanel">
            <div className="login-content">
                <img src={login} alt="Log in" />
                <div className="login-right">
                    <a href="/">
                        <div className="logo">
                            <img src={logo} alt="Logo" />
                        </div>
                    </a>
                    <div className="login-form">
                        <h1>Welcome to BG AGH!</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="username">Username:</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                minLength="4"
                                maxLength="20"
                                required
                                onChange={handleChange}
                                value={formData.username}
                            />
                            <br />
                            <label htmlFor="password">Password:</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                minLength="6"
                                maxLength="20"
                                required
                                onChange={handleChange}
                                value={formData.password}
                            />
                            <br />
                            <input type="submit" value="Log in" />
                        </form>
                        <p className="error" id="login-error">
                            {loginError}
                        </p>
                        <div className="sign">
                            <p>Don’t you have an account?</p>
                            <a href="/signup">Sign up</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;