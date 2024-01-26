import { Outlet, Link } from "react-router-dom";
import '../css/styles.css';
import book from '../img/book.png';
import LogoutButton from "./LogoutButton.js";

const Layout = () => {
    return (
        <>
            <div className="header">
                <div className="menuleft">
                    <Link to="/">
                        <div className="logo">
                            <img src={book} alt="Book Logo" />
                        </div>
                    </Link>
                    <Link to="/login">Login</Link>
                    <LogoutButton />
                </div>
                <Link to="/">
                    <h1>Biblioteka</h1>
                </Link>
                <div className="menus">
                    <Link to="/books">Książki</Link>
                    <Link to="/rentedBooks">Wypożyczone</Link>
                </div>
            </div>

            <Outlet />
        </>
    );
};

export default Layout;