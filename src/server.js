import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import bodyParser from 'body-parser';
import db from './database.js';
import cors from 'cors';

import bcrypt from 'bcrypt';
import session from 'express-session';

/* *************************** */
/* Configuring the application */
/* *************************** */
const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', __dirname + '/views'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug'); // Use the 'Pug' template system
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment
app.use(express.urlencoded({ extended: false }));
/* ************************************************ */

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(session({ secret: "Your secret key" }));
app.use(cors());

const firstname = "Jan"
const lastname = "Kowalski"

/* ******** */
/* "Routes" */
/* ******** */

// app.get('/', async function (request, response, next) {
//     var docs = await db.all("SELECT * FROM books WHERE id < 5", []);
//     response.sendFile(path.join(__dirname, 'views', 'mainPage.html'));
// });

let users = [
    { id: 1, username: 'test', password: bcrypt.hashSync("test", 10), role: 'user' },
    { id: 2, username: 'admin', password: bcrypt.hashSync("admin", 10), role: 'admin' }
];

app.get('/login', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'views', 'login.html'));
});

app.post('/login', async function (req, res, next) {
    const { username, password } = req.body;

    const user = users.find(
        (u) => u.username === username
    );

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ msg: 'Bad username or password' });
    }
    req.session.user = user;
    // Passwords match, login is successful
    // You can create a session or JWT token here if needed
    res.json({ token: 'your_access_token' });
});

function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        return res.redirect('login'); // Redirect directly if not logged in
    }
}

app.get('/logout', function (req, res) {
    // Clear the user session
    req.session.user = null;

    // Redirect to the login page or any other destination
    res.redirect('/login');
});

app.get('/profile', checkSignIn, async function (request, response, next) {
    response.render('profile', { "username": request.session.user.username, "role": request.session.user.role });
});

app.get('/', async function (request, response, next) {
    var docs = await db.all("SELECT * FROM books WHERE id < 5", []);
    response.render('mainPage', { 'mainBooks': docs, 'user': request.session.user }); // Render the 'index' view
});

app.get('/books', checkSignIn, async function (request, response, next) {
    var books = await db.all("SELECT * FROM books", []);
    response.render('booksList', { 'books': books, "role": request.session.user.role });
});

app.post('/updateBookContainer', async function (request, response, next) {
    var book = await db.get("SELECT * FROM books WHERE id = ?", [request.body.id]);
    response.send({ "book": book });
});

app.post('/rentBooks', async function (request, response, next) {

    var rentedBooks = request.body.rentedBooks;
    var error = false;
    var errorMSG = '';

    var student = await db.get("SELECT * FROM students WHERE firstname = ? AND lastname = ?", [firstname, lastname]);
    if (student) {
        for (const rbook of rentedBooks) {
            var book = rbook.book;
            for (var i = 0; i < rbook.no_copies; i++) {
                await db.run("INSERT INTO rentals (book_id, student_id) VALUES (?, ?)", [book.id, student.id]);
            }
            await db.run("UPDATE books SET no_copies = ? WHERE id = ?", [book.no_copies - rbook.no_copies, book.id]);
        }
    }
    response.send({ "rentedBooks": rentedBooks, "error": error, "errorMSG": errorMSG });

});

app.post('/addBookToBasket', async function (request, response, next) {

    const id = parseInt(request.body.id);

    var error = false;
    var errorMSG = '';
    var book = null;

    var student = await db.get("SELECT * FROM students WHERE firstname = ? AND lastname = ?", [firstname, lastname]);
    if (!student) {
        error = true;
        errorMSG = "The given student does not exist in the database";
    }
    else {
        var found = await db.get("SELECT * FROM books WHERE id = ?", [id]);
        book = found;
        if (!found) {
            error = true;
            errorMSG = "The specified book does not exist in the database";
        }
        else {
            if (found.no_copies <= 0) {
                error = true;
                errorMSG = "No copies available for loan";
            }
            else if (!error) {
                errorMSG = "Found: " + String(found.id);
            }
        }
    }
    var bookArgs = {
        'error': error,
        'errorMSG': errorMSG,
        'book': book,
    }
    response.json(bookArgs);
});

app.post('/deleteBookFromBasket', async function (request, response, next) {
    var bookID = request.body.id;
    var book = await db.get("SELECT * FROM books WHERE id = ?", [bookID]);
    response.send({ 'book': book });
});

app.get('/rentedBooks', checkSignIn, async function (request, response, next) {
    var error = false;
    var errorMSG = '';
    var rentedBooks = [];

    var student = await db.get("SELECT * FROM students WHERE firstname = ? AND lastname = ?", [firstname, lastname]);
    if (!student) {
        error = true;
        errorMSG = "Nie znaleziono użytkownika";
    } else {
        var rents = await db.all("SELECT * FROM rentals WHERE student_id = ?", [student.id]);
        for (let i = 0; i < rents.length; i++) {
            var rental = rents[i];
            var book = await db.get("SELECT * FROM books WHERE id = ?", [rental.book_id]);
            if (rentedBooks.length === 0) {
                var newPos = {
                    'book': book,
                    'no_copies': 1,
                };
                rentedBooks.push(newPos);
            } else {
                const foundBook = rentedBooks.find(obj => obj.book.id === book.id);
                if (foundBook) {
                    foundBook.no_copies += 1;
                } else {
                    var newPos = {
                        'book': book,
                        'no_copies': 1,
                    };
                    rentedBooks.push(newPos);
                }
            }
        }
    }

    response.render('rented', { "error": error, "errorMSG": errorMSG, "rentedBooks": rentedBooks, "username": request.session.user.username, "role": request.session.user.role });
});

app.post('/updateRentedList', async function (request, response, next) {
    var error = false;
    var errorMSG = '';
    var rentedBooks = [];

    var student = await db.get("SELECT * FROM students WHERE firstname = ? AND lastname = ?", [firstname, lastname]);
    if (!student) {
        error = true;
        errorMSG = "Nie znaleziono użytkownika"
    }
    else {
        var rents = await db.all("SELECT * FROM rentals WHERE student_id = ?", [student.id]);
        for (let i = 0; i < rents.length; i++) {
            var rental = rents[i];
            var book = await db.get("SELECT * FROM books WHERE id = ?", [rental.book_id]);
            if (rentedBooks.length === 0) {
                var newPos = {
                    'book': book,
                    'no_copies': 1,
                };
                rentedBooks.push(newPos);
            } else {
                const foundBook = rentedBooks.find(obj => obj.book.id === book.id);
                if (foundBook) {
                    foundBook.no_copies += 1;
                } else {
                    var newPos = {
                        'book': book,
                        'no_copies': 1,
                    };
                    rentedBooks.push(newPos);
                }
            }
        }
    }
    response.send({ "rentedBooks": rentedBooks, "error": error, "errorMSG": errorMSG })
});

app.post('/returnBook', async function (request, response, next) {
    var error = false;
    var errorMSG = '';

    var id = parseInt(request.body.id);
    var student = await db.get("SELECT * FROM students WHERE firstname = ? AND lastname = ?", [firstname, lastname]);
    if (!student) {
        error = true;
        errorMSG = "Podany student nie znajduje się w naszej bazie";
    }
    else {
        var book = await db.get("SELECT * FROM books WHERE id = ?", [id]);
        if (!book) {
            error = true;
            errorMSG = "Podanej książki nie ma w naszej bazie";
        }
        else {
            var rental = await db.get("SELECT * FROM rentals WHERE book_id = ? AND student_id = ?", [book.id, student.id]);
            console.log(rental)
            if (!rental) {
                error = true;
                errorMSG = "Podany student nie wypożyczał podanej książki";
            }
            if (!error) {
                await db.run("DELETE FROM rentals WHERE id = ? ", [rental.id]);
                await db.run("UPDATE books SET no_copies = ? WHERE id = ?", [book.no_copies + 1, book.id]);
            }
        }
    }
    response.send({ "error": error, "errorMSG": errorMSG, "id": id });
});

/* ************************************************ */

app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});          