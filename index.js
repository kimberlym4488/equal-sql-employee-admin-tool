const mysql = require('mysql2');
const db = require('./db/connection');
const util = require('util');
const inquirer = require('inquirer')
// Present user with options.

/*db.query=util.promisify( db.query );
db.query
    ( 'SELECT * FROM employee' )
.then((results) => {
    console.table(success)
    //we don't need template literals, we can use IMPORTANT! prepared statements! here. mysql2, look at documentation. npmjs.com/package/mysql2. Put in questions marks where we want our values to be. instead of a text value, we use a question mark. Then use create an array, connection.execute.  In our array list we can put variables. 
})*/

const endApp = () => console.log("Thanks so much for using the Equal Sql Database! Type node index.js to view, create, or delete your current data.")

async function defaultQuestion() {
    const answers = await inquirer
    .prompt([
        {
            type: "input",
            name: "defaultQuestion",
            message: "Type 'menu' to return to the main menu. Type 'end' to exit this application",
            //our array list from above is no inserted here for the users. Then it turnes it into a choices variable in the correct order using the answers provided by the user. 
        }
    ])
    .then((answers) => {
        //IMPORTANT!!!!!!then we take the answers and insert the answers into the database. 
        answers = answers.defaultQuestion;
        switch (answers) {
            case "menu": menu(); break;
            case "end": endApp(); break;
            default: console.log("You've submitted an invalid answer, please type 'menu' for more choices or 'end' to exit this application.")
        }
    })
}

async function menu() {

    const menuQuestions = [
        {
            id: 1,
            name: "View all departments"
        },
        {
            id: 2,
            name: "View all roles"
        },
        {
            id: 3,
            name: "View all employees"
        },
        {
            id: 4,
            name: "Add a department"
        },
        {
            id: 5,
            name: "Add a role"
        },
        {
            id: 6,
            name: "Add an employee"
        },
        {
            id: 7,
            name: "Update an employee role"
        },
        {
            id: 8,
            name: "End this application"
        }
    ]
    //.map the results to a different thing
    const choices = menuQuestions.map(menuQuestions => {
        return {
            name: menuQuestions.name,
            value: menuQuestions.id,
            //go get the results from our department database then map the choices from inquirer to
        }
    })
    const answers = await inquirer
        .prompt([
            {
                type: "list",
                name: "menuQuestions",
                message: "What you would you like to do?",
                choices: choices,//our array list from above is no inserted here for the users. Then it turnes it into a choices variable in the correct order using the answers provided by the user. 
            }
        ])
        .then((answers) => {
            //IMPORTANT!!!!!!then we take the answers and insert the answers into the database. 
            answers = answers.menuQuestions;
            switch (answers) {
                case 1: viewAllDepartments(); break;
                case 2: viewAllRoles(); break;
                case 3: viewAllEmployees(); break;
                case 4: createDepartment(); break;
                case 5: addARole(); break;
                case 6: addAnEmployee(); break;
                case 7: updateAnEmployeeRole(); break;
                case 8: endApp(); break;
            }
        })
}

// View all departments
async function viewAllDepartments() {
  
    const departments = await db.query('Select * from department');
    console.table(departments);
    defaultQuestion();
    
    //menu().then( () => departments )
    //return departments;
}

async function viewAllRoles() {
    const roles = await db.query('Select roles.title, roles.id, roles.salary, department.departmentName FROM roles JOIN department ON roles.department_id = department.id');
    console.table(roles)
    defaultQuestion();
    return roles;

}

// view all employees
async function viewAllEmployees() {

    const employees = await db.query(`Select employee.id, employee.first_name, employee.last_name, roles.title, department.departmentName, roles.salary, CONCAT (m.first_name, ' ', m.last_name) AS manager FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON department.id = roles.department_id JOIN employee m ON m.id = employee.manager_id`);
    console.table(employees)
    defaultQuestion();
    return employees;
}

//the inquirer can use objects, 

// add a department - CREATE - "INSERT INTO [table_name] (col1, col2) VALUES  (col1, col2)

async function createDepartment() {
       
    const answers = await inquirer
        .prompt([
            {
                type: "input",
                name: "department",
                message: "Which department would you like to add?",
            }
        ])
console.log(answers)
        
            const insertResult = await db.query('INSERT INTO department ( departmentName) VALUES (?)',
                answers.department)//Sales
            viewAllDepartments();
            return;
}


async function addARole() {
//query database to fetch the department names and id's 
//push those results into our departments array
   try{
       
    db.query = util.promisify( db.query );

    function returnDepartments() {
    const departments = db.query('Select * from department');
    return departments;
    }

    returnDepartments().then( departmentsList => {

       const choices = departmentsList.map(departmentList => {
            return {
                name: departmentList.departmentName,
                value: departmentList.id,
                //go get the results from our department database then map the choices from inquirer to
            }
        })
        getRoleData(choices)
    }) 
    async function getRoleData(choices) {
        const answers = await inquirer
        .prompt([
            {
                type: "list",
                name: "departmentList",
                message: "Choose a department",
                choices: choices,
                //our array list from above is now inserted here for the users. Then it turnes it into a choices variable in the correct order using the answers provided by the user. 
            },
     /*   const insertResult = await db.query( 'INSERT INTO roles (title) VALUES (?, ?, ?) */   

            {
                type: "input",
                name: "title",
                message: "Which role would you like to add?",
            },
            {
                type: "input",
                name: "salary",
                message: "What is the annual salary for this poistion?",
            },
        ])
            /*const { answers } = departmentList.answers, title.answers,
            const title = answers.id;*/

            const { departmentList, title, salary } = answers
            const insertResults = await db.query('INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)', [
                answers.title, 
                answers.salary,
                answers.departmentList,
            ])
            viewAllRoles();
            
    }
}

    catch(err) {
        console.log(err);

    }
   // select the existing departments out of the department table. That will return us an array list of department like objects. Then we map the results from department table and insert it into question data for inquirer. 
}


//.map() the results from roles and insert it into the question data for inquirer (pass roles through a function from roles to question data I'll be inserting the id values, not the string value, so we can get the id value on the other side. How to acocmplish? office hours on Saturday. )

//Then prompt the user for role information (inquirer) - they choose from a list.

// add an employee


// update an employee
//provide user with the list of current employees THEN we'll use the update

//these will be making the call to the database then waiting for a response before doing something with the results. Lots of nested async actions going on. async await? Promisify your query function so you can get away with async code and not get lost in the weeds of callback functions. */

menu();