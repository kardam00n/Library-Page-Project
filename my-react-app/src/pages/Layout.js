import { Outlet, Link } from "react-router-dom";
import '../css/styles.css';
import logo from '../img/logo-bg.svg';
import profile from '../img/profile.png';

const Layout = () => {
    // const handleProfile = async () => {
    //     try {
    //         const response = await fetch('http://localhost:8000/profile', {
    //             method: 'GET',
    //             credentials: 'include',
    //         });

    //         if (!response.ok) {
    //             console.error('An error occurred during log out:', response.statusText);
    //         }
    //     } catch (error) {
    //         console.error('An error occurred during log out:', error.message);
    //     }
    // };
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
                    <Link to="/rentedBooks">Borrowed</Link>
                </div>
                <div className="menus">
                    <a href="/profile">
                        <div className="profile">
                            <img src={profile} alt="Profile logo" />
                        </div></a>
                    <Link to="/login">Log in</Link>
                    <a href="/signup" className="loginbutton">Sign up</a>
                </div>
            </div>

            <Outlet />
        </>
    );
};

export default Layout;