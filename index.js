const mysql = require("mysql2");
const db = require("./db/connection");
const util = require("util");
const inquirer = require("inquirer");
const { join } = require("path");

//MENU
async function menu() {
  const menuQuestions = [
    {
      id: 1,
      name: "Create Department",
    },
    {
      id: 2,
      name: "Create a Role",
    },
    {
      id: 3,
      name: "Add an Employee",
    },
    {
      id: 4,
      name: "View All Departments",
    },
    {
      id: 5,
      name: "View All Roles",
    },
    {
      id: 6,
      name: "View All Employees",
    },
    {
      id: 7,
      name: "View All Managers/Employees",
    },
    {
      id: 8,
      name: "View budget by department",
    },
    {
      id: 9,
      name: "Update an Employee Role",
    },
    {
      id: 10,
      name: "Delete a department",
    },
    {
      id: 11,
      name: "Delete a Role",
    },
    {
      id: 12,
      name: "Delete an Employee",
    },
    {
      id: 13,
      name: "End this application",
    },
  ];
  //.map the results to a different thing
  const choices = menuQuestions.map((menuQuestions) => {
    return {
      name: menuQuestions.name,
      value: menuQuestions.id,
      //go get the results from our department database then map the choices to a name and value
    };
  });
  const answers = await inquirer
    .prompt([
      {
        type: "list",
        name: "menuQuestions",
        message: "What you would you like to do?",
        choices: choices, //our array list from above is now inserted here for the users. Then it turnes it into a choices variable in the correct order using the answers provided by the user.
      },
    ])
    .then((answers) => {
      //IMPORTANT!!!!!!then we take the answers and insert the answers into the database.
      answers = answers.menuQuestions;
      switch (answers) {
        case 1:
          createDepartment();
          break;
        case 2:
          addARole();
          break;
        case 3:
          addAnEmployee();
          break;
        case 4:
          viewAllDepartments();
          break;
        case 5:
          viewAllRoles();
          break;
        case 6:
          viewAllEmployees();
          break;
        case 7:
          viewAllManagerEmployees();
          break;
        case 7:
          viewBudgets();
          break;
        case 7:
          updateAnEmployeeRole();
          break;
        case 8:
          deleteDepartment();
          break;
        case 9:
          deleteRole();
          break;
        case 10:
          deleteEmployee();
          break;
        case 10:
          endApp();
          break;
      }
    });
}
// Present user with menu and default response in terminal
async function defaultQuestion() {
  const answers = await inquirer
    .prompt([
      {
        type: "input",
        name: "defaultQuestion",
        message:
          "Type 'menu' to return to the main menu. Type 'end' to exit this application",
      },
    ])
    .then((answers) => {
      //Then we take the answers and insert the answers into the database.
      answers = answers.defaultQuestion;
      switch (answers.toLowerCase()) {
        case "menu":
          menu();
          break;
        case "end":
          endApp();
          break;
        default:
          console.log(
            "You've submitted an invalid answer, please type 'menu' for more choices or 'end' to exit this application."
          );
      }
    });
}
//CREATE
//create a new department
async function createDepartment() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "department",
      message: "Which department would you like to add?",
    },
  ]);
  const insertResult = await db.query(
    "INSERT INTO department (departmentName) VALUES (?)",
    answers.department
  ); //Sales
  viewAllDepartments();
  return;
}
//Add a role
async function addARole() {
  //query database to fetch the department names and id's
  //push those results into our departments array
  try {
    db.query = util.promisify(db.query);

    function returnDepartments() {
      const departments = db.query("Select * from department");
      return departments;
    }

    returnDepartments().then((departmentsList) => {
      const choices = departmentsList.map((departmentList) => {
        return {
          name: departmentList.departmentName,
          value: departmentList.id,
        };
      });
      getRoleData(choices);
    });
    async function getRoleData(choices) {
      const answers = await inquirer.prompt([
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
          message: "What is the annual salary for this position?",
        },
      ]);
      /*const { answers } = departmentList.answers, title.answers,
            const title = answers.id;*/

      const { departmentList, title, salary } = answers;
      const insertResults = await db.query(
        "INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)",
        [answers.title, answers.salary, answers.departmentList]
      );
      viewAllRoles();
    }
  } catch (err) {
    console.log(err);
  }
}
//Add an employee
async function addAnEmployee() {
  //query database to fetch the departments and roles.
  //push those results into our departments array
  try {
    db.query = util.promisify(db.query);

    const departmentsList = await db.query("Select * from department");
    const rolesList = await db.query("Select * from roles");
    const managersList = await db.query(
      "Select manager_id, managerFirstName from employee"
    );

    /*If no departments, prompt user to add a department*/
    const deptChoices = departmentsList.map((departmentList) => {
      return {
        name: departmentList.departmentName,
        value: departmentList.id,
      };
    });
    /*Add in conditional logic to only return roles belonging to this department. If no roles, prompt user to add a Role function. */

    const roleChoices = rolesList.map((roleList) => {
      return {
        name: roleList.title,
        value: roleList.id,
      };
    });

    const managerChoices = managersList.map((managerList) => {
      return {
        name: managerList.managerFirstName,
        value: managerList.manager_id,
      };
    });

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "departmentList",
        message: "Choose a department",
        choices: deptChoices,
      },
      {
        type: "list",
        name: "roleList",
        message: "What is the employees' role?",
        choices: roleChoices,
      },
      {
        type: "input",
        name: "first_name",
        message: "What is the employee first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is the employee last name?",
      },
      {
        type: "list",
        name: "managerVerification",
        message: "Is this person a manager",
        choices: ["Yes", "No"],
      },
      {
        type: "list",
        name: "managerList",
        message: "Who is this employees' manager?",
        when: (answers) => answers.managerVerification === "No",
        choices: managerChoices,
      },
    ]);

    const {
      first_name,
      last_name,
      roleList,
      managerVerification,
      managerList,
    } = answers;
    //Need to add the manager_id since this is not a manager.
    if (answers.managerVerification === "No") {
      const insertResults = await db.query(
        "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)",
        [
          answers.first_name,
          answers.last_name,
          answers.roleList,
          answers.managerList,
        ]
      );
      console.table(insertResults);
      viewAllEmployees();
    } else {
      //Since this is a manager, we don't have a manager id to enter yet. It will be that employee id after creation.
      const insertResults = await db.query(
        "INSERT INTO employee (first_name, last_name, role_id) VALUES (?,?,?)",
        [answers.first_name, answers.last_name, answers.roleList]
      );
      //Now we have an employee id we can add to the manager id column for the user.
      const insertManager = await db.query(
        "UPDATE employee SET manager_id = id WHERE employee.first_name=? AND employee.last_name=?",
        [answers.first_name, answers.last_name]
      );
      //Show user results.
      console.table(insertResults);
      viewAllEmployees();
    }
  } catch (err) {
    console.log(err);
  }
}
//READ
//View all departments
async function viewAllDepartments() {
  const departments = await db.query("Select * from department");
  console.table(departments);
  defaultQuestion();
}
//View all roles
async function viewAllRoles() {
  const roles = await db.query(
    "Select roles.title, roles.id, roles.salary, department.departmentName FROM roles JOIN department ON roles.department_id = department.id"
  );
  console.table(roles);
  defaultQuestion();
  return roles;
}
//View all employees
async function viewAllEmployees() {
  const employees = await db.query(
    `Select employee.id, employee.first_name, employee.last_name, roles.title, department.departmentName, roles.salary, CONCAT (m.first_name, ' ', m.last_name) AS manager FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON department.id = roles.department_id JOIN employee m ON m.id = employee.manager_id`
  );
  console.table(employees);
  defaultQuestion();
  return employees;
}
//View all employees by manager
async function viewAllManagerEmployees() {
  const employees = await db.query(
    `Select employee.first_name, employee.last_name, CONCAT (m.first_name, ' ', m.last_name) AS manager FROM employee JOIN roles ON employee.role_id = roles.id JOIN department ON department.id = roles.department_id JOIN employee m ON m.id = employee.manager_id`
  );
  console.table(employees);
}
//View budget by Department
async function viewBudgets() {
  try {
    db.query = util.promisify(db.query);

    const departmentsList = await db.query("SELECT * FROM department");

    const departmentChoices = departmentsList.map((departmentList) => {
      return {
        name: departmentList.departmentName,
        value: departmentList.id,
        //go get the results from our department database then map the choices to question.
      };
    });
    const answers = await inquirer.prompt({
      type: "list",
      name: "id",
      message: "Which department budget would you like to view?",
      choices: departmentChoices,
    });
    const { id } = answers;
    const viewBudget = await db.query(
      `SELECT department.departmentName AS "Department", SUM(roles.salary) AS "Department Budget" FROM department JOIN roles ON roles.department_id = department.id WHERE department.id = ?`,
      answers.id
    );
    console.table(viewBudget);
    defaultQuestion();
  } catch (err) {
    console.log(err);
  }
}
//UPDATE
//Update employee Role
async function updateAnEmployeeRole() {
  try {
    db.query = util.promisify(db.query);
    const employeeNames = await db.query(
      `Select id, CONCAT(first_name,' ', last_name) as employee FROM employee`
    );
    const rolesList = await db.query(
      "Select roles.id as roleId, roles.title FROM roles"
    );

    const employeeChoices = employeeNames.map((employeeName) => {
      return {
        name: employeeName.employee,
        value: employeeName.id,
      };
    });

    const roleChoices = rolesList.map((roleList) => {
      return {
        name: roleList.title,
        value: roleList.roleId,
      };
    });

    const answers = await inquirer.prompt([
      {
        type: "list",
        name: "employeeName",
        message: "Which employee should we update?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleList",
        message: "Which role should this employee be?",
        choices: roleChoices,
      },
    ]);

    const { roleList, employeeName } = answers;

    const updateEmployee = await db.query(
      "UPDATE employee SET employee.role_id = ? WHERE employee.id = ?",
      [answers.roleList, answers.employeeName]
    );

    viewAllEmployees();
  } catch (err) {
    console.log(err);
  }
}
//DELETE
//Delete a department
async function deleteDepartment() {
  try {
    db.query = util.promisify(db.query);

    const departmentsList = await db.query("SELECT * FROM department");

    const departmentChoices = departmentsList.map((departmentList) => {
      return {
        name: departmentList.departmentName,
        value: departmentList.id,
        //go get the results from our department database then map the choices from inquirer to
      };
    });
    const answers = await inquirer.prompt({
      type: "list",
      name: "id",
      message:
        "Which department do you wish to delete? Note, deleting a department will affect the roles within that department.",
      choices: departmentChoices,
    });
    const { id } = answers;
    const deleteResults = await db.query(
      "DELETE FROM department WHERE department.id = ?",
      answers.id
    );
    viewAllDepartments();
  } catch (err) {
    console.log(err);
  }
}
//Delete a role
async function deleteRole() {
  try {
    db.query = util.promisify(db.query);

    const rolesList = await db.query("SELECT * FROM roles");

    const roleChoices = rolesList.map((roleList) => {
      return {
        name: roleList.title,
        value: roleList.id,
        //go get the results from our department database then map the choices from inquirer to
      };
    });
    const answers = await inquirer.prompt({
      type: "list",
      name: "id",
      message:
        "Which roles do you wish to delete? Note, this will affect reporting of employee roles.",
      choices: roleChoices,
    });
    const { id } = answers;
    const deleteResults = await db.query(
      "DELETE FROM role WHERE role.id = ?",
      answers.id
    );
    viewAllRoles();
  } catch (err) {
    console.log(err);
  }
}
//Delete employee
async function deleteEmployee() {
  try {
    db.query = util.promisify(db.query);

    const employeesList = await db.query("SELECT * FROM employee");

    const employeeChoices = employeesList.map((employeeList) => {
      return {
        name: employeeList.first_name,
        value: employeeList.id,
        //go get the results from our department database then map the choices from inquirer to
      };
    });
    const answers = await inquirer.prompt({
      type: "list",
      name: "id",
      message:
        "Which employee would you like to delete? Note, if you delete a manager, you will need to add another manager for that department.",
      choices: employeeChoices,
    });
    const { id } = answers;
    const deleteResults = await db.query(
      "DELETE FROM employee WHERE employee.id = ?",
      answers.id
    );
    viewAllEmployees();
  } catch (err) {
    console.log(err);
  }
}
const endApp = () =>
  console.log(
    "Thanks so much for using the Equal Sql Database! Type Ctrl/Cmd + C to clear your console. Then type node index.js to view, create, or delete your current data."
);

menu();
