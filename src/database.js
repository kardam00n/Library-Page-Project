import sqlite3 from 'sqlite3';
import {open} from 'sqlite';

const DBSOURCE = "db.sqlite"

let db = await open({filename: DBSOURCE, driver: sqlite3.Database});
if(db){
    console.log("Connected to database");
}
else{
    console.log("Error connecting to database");
}
export default db;
