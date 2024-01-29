import React, { useState } from 'react';
import '../css/login.css';
import signin from '../img/signup.jpg';
import logo from '../img/logo-bg.svg';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'username') {
            setUsername(value);
        } else if (name === 'password') {
            setPassword(value);
        } else if (name === 'email') {
            setEmail(value);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('http://localhost:8000/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password, email }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Signup successful:', data);
                setErrorMessage('');
                window.location.href = '/login';
            } else {
                const errorData = await response.json();
                setErrorMessage(`Signup failed. User with this nick already exists`);
                console.error(`Signup failed. User with this nick already exists`);
            }
        } catch (error) {
            setErrorMessage('An error occurred during signup. Please try again later.');
            console.error('An error occurred during signup:', error);
        }
    };

    return (
        <div className="mainPanel">
            <div className="login-content">
                <img src={signin} alt="Sign in" />
                <div className="login-right">
                    <a href="/">
                        <div className="logo">
                            <img src={logo} alt="Logo" />
                        </div>
                    </a>
                    <div className="login-form">
                        <h1>Wellcome to BG AGH!</h1>
                        <form onSubmit={handleSubmit}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" id="email" name="email" /><br />
                            <label htmlFor="username">Username:</label>
                            <input type="text" id="username" name="username" minLength="4" maxLength="20" required onChange={handleChange} /><br />
                            <label htmlFor="password">Password:</label>
                            <input type="password" id="password" name="password" minLength="6" maxLength="20" required onChange={handleChange} /><br />
                            <div className="check">
                                <input type="checkbox" id="myCheckbox" name="myCheckbox" />
                                <p>I do not wish to receive news and promotions from Freepik Company by email.</p>
                            </div>
                            <input type="submit" value="Sign up" />
                        </form>
                        <p className="error">{errorMessage}</p>
                        <div className="sign">
                            <p>Already have an account?</p>
                            <a href="/login">Log in</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;