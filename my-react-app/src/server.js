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

var l_user;

app.set('pages', __dirname + '/pages'); // Files with views can be found in the 'views' directory
app.set('view engine', 'pug'); // Use the 'Pug' template system
app.locals.pretty = app.get('env') === 'development'; // The resulting HTML code will be indented in the development environment
app.use(express.urlencoded({ extended: false }));
/* ************************************************ */

app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json()); // Parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded bodies
// app.use(cors());

app.use(cors({
    origin: 'http://localhost:3000',  // Адреса вашого клієнтського додатку
    credentials: true,
}));

app.use(session({ resave: true, secret: '123456' }));


/* ******** */
/* "Routes" */
/* ******** */

// app.get('/', async function (request, response, next) {
//     var docs = await db.all("SELECT * FROM books WHERE id < 5", []);
//     response.sendFile(path.join(__dirname, 'views', 'mainPage.html'));
// });

// let users = [
//     { id: 1, username: 'test', password: bcrypt.hashSync("123456", 10), role: 'user' },
//     { id: 2, username: 'admin', password: bcrypt.hashSync("123456", 10), role: 'admin' }
// ];

app.get('/signup', function (req, res, next) {
    res.sendFile(path.join(__dirname, 'views', 'signup.html'));
});

app.post('/signup', async function (req, res, next) {
    const newUser = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.password, 10),
        email: req.body.email
    };

    var user = await db.get("SELECT * FROM students WHERE username = ?", [newUser.username]);

    if (user) {
        return res.status(401).json({ msg: 'User with this nick already exists' });
    }


    await db.run("INSERT INTO students (username, password, email) VALUES (?, ?, ?)", [newUser.username, newUser.password, newUser.email]);
    res.json({ token: 'your_access_token' });

});

app.post('/login', async function (req, res, next) {

    const { username, password } = req.body;

    var user = await db.get("SELECT * FROM students WHERE username = ?", [username]);

    if (!user || !bcrypt.compareSync(password, user.password)) {
        return res.status(401).json({ msg: 'Bad username or password' });
    }

    req.session.user = user;
    req.session.save;
    // Passwords match, login is successful
    // You can create a session or JWT token here if needed
    res.json({ token: 'your_access_token' });
});

app.get('/logout', function (req, res) {
    // Clear the user session
    console.log(req.session.user);
    req.session.user = null;

    // Redirect to the login page or any other destination
    res.sendStatus(200);
});

function checkSignIn(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        var err = new Error("Not logged in!");
        console.log(req.session.user);
        return res.status(401).json({ error: 'notSigned' });
    }
}

app.get('/profile', checkSignIn, async function (request, response, next) {
    if (request.session.user === undefined || request.session.user === null) {
        response.send({ "username": "", "role": "" });
    } else {
        console.log(request.session.user);
        response.send({ "username": request.session.user.username, "role": request.session.user.role });
    }
});

app.get('/', async function (request, response, next) {
    response.send({ 'user': request.session.user }); // Render the 'index' view
});

app.get('/books', checkSignIn, async function (request, response, next) {
    var books = await db.all("SELECT * FROM books", []);
    response.send({ 'books': books });
});

app.post('/updateBookContainer', async function (request, response, next) {
    var book = await db.get("SELECT * FROM books WHERE id = ?", [request.body.id]);
    response.send({ "book": book });
});

app.post('/rentBooks', async function (request, response, next) {

    var rentedBooks = request.body.rentedBooks;
    var error = false;
    var errorMSG = '';

    var student = await db.get("SELECT * FROM students WHERE username = ?", [request.session.user.username]);
    if (student) {
        for (const rbook of rentedBooks) {
            var book = rbook.book;
            for (var i = 0; i < rbook.no_copies; i++) {
                console.log(student.id, book.id);

                try {
                    await newRental(student.id, book.id);
                }
                catch (e) {
                    console.log(e);
                }

            }
            await db.run("UPDATE books SET no_copies = ? WHERE id = ?", [book.no_copies - rbook.no_copies, book.id]);
        }
    }
    response.send({ "rentedBooks": rentedBooks, "error": error, "errorMSG": errorMSG });

});

async function newRental(student_id, book_id) {
    console.log("new rental");
    await db.run("INSERT INTO rentals(student_id, book_id) VALUES (?,?)", [student_id, book_id]);
}

app.get('/rentedBooks', checkSignIn, async function (request, response, next) {
    var error = false;
    var errorMSG = '';
    var rentedBooks = [];

    if (request.session.user.role == 'user') {
        var student = await db.get("SELECT * FROM students WHERE username = ?", [request.session.user.username]);
        if (!student) {
            error = true;
            errorMSG = "Nie znaleziono użytkownika";
        } else {
            var rents = await db.all("SELECT * FROM rentals WHERE student_id = ?", [student.id]);
            var students = await db.all("SELECT * FROM students WHERE id = ?", [student.id]);
        }
    }
    else if (request.session.user.role == 'admin') {
        var rents = await db.all("SELECT * FROM rentals");
        var students = await db.all("SELECT * FROM students");
    }
    for (let j = 0; j < students.length; j++) {
        for (let i = 0; i < rents.length; i++) {
            var rental = rents[i];
            var student = students[j];
            if (rental.student_id === student.id) {
                var book = await db.get("SELECT * FROM books WHERE id = ?", [rental.book_id]);
                if (rentedBooks.length === 0) {
                    var newPos = {
                        'student': student,
                        'book': book,
                        'no_copies': 1,
                    };
                    rentedBooks.push(newPos);
                } else {
                    const foundBook = rentedBooks.find(obj => obj.book.id === book.id && obj.student.id == student.id);
                    if (foundBook) {
                        foundBook.no_copies += 1;
                    } else {
                        var newPos = {
                            'student': student,
                            'book': book,
                            'no_copies': 1,
                        };
                        rentedBooks.push(newPos);
                    }
                }
            }
        }
    }
    response.send({ "error": error, "errorMSG": errorMSG, "rentedBooks": rentedBooks, "username": request.session.user.username, "role": request.session.user.role });
});

app.post('/returnBook', async function (request, response, next) {
    var error = false;
    var errorMSG = '';

    var id = parseInt(request.body.id);
    var student = await db.get("SELECT * FROM students WHERE username = ?", [request.session.user.username]);
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