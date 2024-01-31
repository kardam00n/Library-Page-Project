import { Outlet, Link } from "react-router-dom";
import '../css/styles.css';
import logo from '../img/logo-bg.svg';
import profile from '../img/profile.png';
import { useEffect, useState } from "react";

const Layout = () => {
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

    useEffect(() => {
        checkRole();
    }, []);

    return (
        <>
            <div className="header">
                <div className="menuleft">
                    <Link to="/">
                        <div className="logo">
                            <img src={logo} alt="Book logo" />
                        </div>
                    </Link>

                    <Link to="/books">Books</Link>
                    {role === 'admin' ?
                        <Link to="/rentedBooks">Library Manager</Link> :
                        <Link to="/rentedBooks">Borrowed</Link>
                    }
                </div>
                <div className="menus">
                    {role === '' ?
                        <div>
                            <Link to="/login">Log in</Link>
                            <a href="/signup" className="loginbutton">Sign up</a>
                        </div> :
                        <a href="/profile">
                            <div className="profile">
                                <img src={profile} alt="Profile logo" />
                            </div></a>}
                </div>
            </div>

            <Outlet />
        </>
    );
};

export default Layout;