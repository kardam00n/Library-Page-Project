import { Outlet, Link } from "react-router-dom";
import '../css/styles.css';
import logo from '../img/logo-bg.svg';
import LogoutButton from "./LogoutButton.js";

const Layout = () => {
    return (
        <>
            <div className="header">
                <div className="menuleft">
                    <Link to="/">
                        <div className="logo">
                            <img src={logo} alt="Book Logo" />
                        </div>
                    </Link>

                    <Link to="/books">Books</Link>
                    <Link to="/rentedBooks">Borrowed</Link>
                </div>
                <div className="menus">
                    <Link to="/login">Log in</Link>
                    <a href="/signup" className="loginbutton">Sign up</a>
                    {/* <LogoutButton /> */}
                </div>
            </div>

            <Outlet />
        </>
    );
};

export default Layout;