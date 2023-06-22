import express from 'express';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import {MongoClient} from 'mongodb';
import bodyParser from 'body-parser';

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

const firstname = "Jan"
const lastname = "Kowalski"

/* ******** */
/* "Routes" */
/* ******** */

app.get('/', async function (request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const collection = db.collection('books');
    const docs = await collection.find({'_id': {$lt: 5}}).toArray();
    response.render('mainPage', {'mainBooks': docs}); // Render the 'index' view
});

app.get('/books', async function (request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const collection = db.collection('books');
    const docs = await collection.find({}).toArray();
    response.render('booksList', {'books': docs}); // Render the 'index' view
});

app.post('/updateBookContainer', async function (request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const books = db.collection('books');
    var book = await books.findOne({"_id": request.body.id});
    response.send({"book": book});
});

app.post('/rentBooks', async function (request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const books = db.collection('books');
    const students = db.collection('students');
    const rentals = db.collection('rentals');

    var rentedBooks = request.body.rentedBooks;
    var error = false;
    var errorMSG = '';

    var student = await students.findOne({"firstname" :firstname, "lastname" :lastname});
    if(student){
        rentedBooks.forEach(async rbook => {
            var book = rbook.book;
            for(var i = 0; i < rbook.no_copies; i++){
                await rentals.insertOne({'book_id': book._id, 'student_id': student._id});
            }
            await books.updateOne(
            { '_id': book._id },
            { $set: { 'no_copies': book.no_copies-rbook.no_copies } }
            );
        });
    }
    else{
        error = true;
        errorMSG = "Nie znaleziono studenta"
    }
    response.send({"rentedBooks": rentedBooks, "error": error, "errorMSG": errorMSG});
});

app.post('/addBookToBasket', async function (request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const books = db.collection('books');
    const students = db.collection('students');
    const rentals = db.collection('rentals');
              
    const id = parseInt(request.body.id);

    var error = false;
    var errorMSG = '';
    var book = null;
 
    const student = await students.findOne({'firstname': firstname, 'lastname': lastname});
    if(!student){
            error = true;
            errorMSG = "Podany student nie znajduje się w naszej bazie";
        }
        else{
            book = await books.findOne({'_id': id});  
            if(!book){
                    error = true;
                    errorMSG = "Podanej książki nie ma w naszej bazie";
                }
                else{
                    if(book.no_copies <= 0){
                        error = true;
                        errorMSG = "Brak dostępnych egzemplarzy do wypożyczenia";
                    }
                    else if(!error){
                        errorMSG = "Znaleziono: " + String(book._id);
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
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const books = db.collection('books');
    const students = db.collection('students');

    var bookID = request.body.id;
    var book = await books.findOne({'_id': bookID});
    response.send({'book' : book});
});

app.get('/rentedBooks', async function (request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const books = db.collection('books');
    const students = db.collection('students');
    const rentals = db.collection('rentals');
    
    var error = false;
    var errorMSG = '';

    var rentedBooks = []
    var student = await students.findOne({"firstname": firstname, "lastname": lastname});
    if(!student){
        error = true;
        errorMSG = "Nie znaleziono użytkownika"
    }
    else{
        var rents = await rentals.find({"student_id": student._id}).toArray();
        for (let i = 0; i < rents.length; i++) {
            var rental = rents[i];
            var book = await books.findOne({ "_id": rental.book_id });
        
            if (rentedBooks.length === 0) {
              var newPos = {
                'book': book,
                'no_copies': 1,
              };
              rentedBooks.push(newPos);
            } else {
              const foundBook = rentedBooks.find(obj => obj.book._id === book._id);
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

    response.render('rented', {"error": error, "errorMSG": errorMSG, "rentedBooks": rentedBooks});
});

app.post('/updateRentedList', async function(request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const books = db.collection('books');
    const students = db.collection('students');
    const rentals = db.collection('rentals');
    
    var error = false;
    var errorMSG = '';

    var rentedBooks = []
    var student = await students.findOne({"firstname": firstname, "lastname": lastname});
    if(!student){
        error = true;
        errorMSG = "Nie znaleziono użytkownika"
    }
    else{
        var rents = await rentals.find({"student_id": student._id}).toArray();
        for (let i = 0; i < rents.length; i++) {
            var rental = rents[i];
            var book = await books.findOne({ "_id": rental.book_id });
        
            if (rentedBooks.length === 0) {
              var newPos = {
                'book': book,
                'no_copies': 1,
              };
              rentedBooks.push(newPos);
            } else {
              const foundBook = rentedBooks.find(obj => obj.book._id === book._id);
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
    response.send({"rentedBooks": rentedBooks, "error": error, "errorMSG": errorMSG})
});

app.post('/returnBook', async function (request, response, next) {
    const client = new MongoClient('mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.8.2');
    await client.connect();
    const db = client.db('AGH');
    const books = db.collection('books');
    const students = db.collection('students');
    const rentals = db.collection('rentals');
                            
    var error = false;
    var errorMSG = '';
 
    var id = parseInt(request.body.id);
    const student = await students.findOne({'firstname': firstname, 'lastname': lastname});
        if(!student){
            error = true;
            errorMSG = "Podany student nie znajduje się w naszej bazie";
        }
        else{
            const book = await books.findOne({'_id': id})
                if(!book){
                    error = true;
                    errorMSG = "Podanej książki nie ma w naszej bazie";
                }
                else{
                    const rental = await rentals.findOne({'book_id': book._id, 'student_id': student._id});
                    if(!rental){
                        error = true;
                        errorMSG = "Podany student nie wypożyczał podanej książki";
                    }
                    if(!error){
                       await rentals.deleteOne(rental);
                       await books.updateOne(
                        { '_id': book._id },
                        { $set: { 'no_copies': book.no_copies+1 } }
                      );
                    }
                }
        }
    response.send({"error": error, "errorMSG": errorMSG, "id": id});
});

/* ************************************************ */

app.listen(8000, function () {
    console.log('The server was started on port 8000');
    console.log('To stop the server, press "CTRL + C"');
});          