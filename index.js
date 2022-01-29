const mysql = require('mysql2');
const db = require('./db/connection');
const utils = require('utils');
const inquirer = require( 'inquirer' )
// Present user with options.

//if we start with the viewing it makes it easier to grab the data to use in the prompts for the user questions with inquirer. 

const answers = await inquirer   
    .prompt([
        {
            type: "list",
            name: "department_id",
            message: "Choose a department",
            choices: [
                { name:"Sales", value: 1 },
                //the name the user chooses from and the value is loaded to compare to our database
               { name: "Accounting", value: 2, },
            ]
        }
    ])
    .then((answers) => {
        console.log( answers );
    })

db.query=utils.promisify( db.query );
db.query
    ( 'SELECT * FROM employees' )
.then((results) => {
    console.table(results)
    //we don't need template literals, we can use IMPORTANT! prepared statements! here. mysql2, look at documentation. npmjs.com/package/mysql2. Put in questions marks where we want our values to be. instead of a text value, we use a question mark. Then use create an array, connection.execute.  In our array list we can put variables. 
})

// View all departments
async function viewAllDepartments() {
//try to get a static inserts first before dynamic
    const departments = await db.query('Select * from employee_db');
    console.table(departments);
}
//READ
//select* from [table_name]""; more than selecting from employees table. We need to look at the role table that is connected to the employee. To replicate the displays you need to JOIN.


// view all roles 

// view all employees
async function viewAllEmployees() {

    const employees = await db.query('Select * from employee_db');

    console.table(employees)
}

//the inquirer can use objects, 

// add a department - CREATE - "INSERT INTO [table_name] (col1, col2) VALUES  (col1, col2)

// add a role requires existing information like getting SELECT the existing roles out of the roles 
//for the employee I'll need this step twice. They can choose the deparment THEN inter info about the employee depending on what role they have chosen. 
async function createRole() {

    const departments = [
        {
            id: 1,
            name: "Sales"
        },
        {
            id: 2,
            name: "Accounting"
        }
//.map the results to a different thing
    ]
    const choices = departments.map ( department => {
        return {
            name: department.name,
            value: department.id,
            //go get the results from our department database then map the choices from inquirer to
        }
    })

    const answers = await inquirer   
    .prompt([
        {
            type: "list",
            name: "department_id",
            message: "Choose a department",
            choices: choices,//our array list from above is no inserted here for the users. Then it turnes it into a choices variable in the correct order using the answers provided by the user. 
        }
    ])
    .then((answers) => {
        //IMPORTANT!!!!!!then we take the answers and insert the answers into the database. 
        console.log( answers );
    })
    //select the existing departments out of the department table. That will return us an array list of department like objects. Then we map the results from department table and insert it into question data for inquirer. 
}

//.map() the results from roles and insert it into the question data for inquirer (pass roles through a function from roles to question data I'll be inserting the id values, not the string value, so we can get the id value on the other side. How to acocmplish? office hours on Saturday. )

//Then prompt the user for role information (inquirer) - they choose from a list.

// add an employee

// update an employee
//provide user with the list of current employees THEN we'll use the update

//these will be making the call to the database then waiting for a response before doing something with the results. Lots of nested async actions going on. async await? Promisify your query function so you can get away with async code and not get lost in the weeds of callback functions. 