const mysql = require("mysql2");
const util = require('util');
require('dotenv').config()

// Connect to database
const connection = mysql.createConnection(
    {//help us create this centralized db or connection object that we are going to use to do all of our interaction with mySql. We need to provide it a set of configuration. Our host is always local host, usually root, then our password will be what we set it as.
      host: process.env.DB_HOST,
      // MySQL username,
      user: process.env.DB_USER,
      // MySQL password
      password: process.env.DB_PASS,//really important to have a specific database, not just to the server but WHICH db it should then be interacting with.  We need to insure we provide a schmema file, it's 
      database: "employees_db"
    });//will help create my database and run source schema.sql from here. We run the subsequent queries below. Organize your structure in the schema.sql file then run it in the terminal with source schema.sql. Seeds.sql will give me some starting sample data. We can interact with our table now and see results come back. 
  connection.query = util.promisify( connection.query );
  connection.connect(function (err) {
      if (err) {
          throw err;
        } else 
        { console.log('Successfully connected to mysql')
        }
  })

  
  module.exports = connection
