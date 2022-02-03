/* view all departments*/

Select * from department;

/*View all roles, (job title, role id, department name, salary)*/
Select roles.title, roles.id, roles.salary, department.departmentName FROM roles JOIN department ON roles.department_id = department.id;

/*View all employees (employee id, first name, last name, job title, department, salary, manager)*/
Select employee.id, employee.first_name, employee.last_name, roles.title, department.departmentName, roles.salary 
FROM roles
JOIN department 
ON roles.department_id = department.id
JOIN employee
ON roles.id = employee.role_id;


/*Turn the manager_id column into the manager first name column. 

Add a column for the manager first name, next to the manager ID column. 

If the manager id is not null, 
take the id and match it to an employee id. (They are already connected by keys). 
If the manager id matches an employee id, return the name of that employee id as the column name manager using concat to create a table column made up of the other columns.*/

/*first join by employee roles, (manager, sales, etc), then join by department names (not necessary?), then join by manager id's in common. If they don't have a manager ID, they won't appear in the employee table (because they are the managers).*/
Select employee.id, employee.first_name, employee.last_name, roles.title, department.departmentName, roles.salary, CONCAT (m.first_name, ' ', m.last_name) AS manager 
FROM employee
JOIN roles
ON employee.role_id = roles.id
JOIN department
ON department.id = roles.department_id
JOIN employee m
    ON m.id = employee.manager_id;
/*Since I join the employee table together with itself, I add an alias to the JOIN employee so it can use the m.id instead of employee.id to reference itself. This is using the self-referencing foreign key instead of a separate manager and employee table*/

/*Add a department*/
INSERT INTO department (id, departmentName) VALUES  (?, ?)
/*done*/

/*Add a role*/
INSERT INTO roles (title, salary, department_id) VALUES (?,?, departmentList.id)

/*Add an employee*/

INSERT INTO employee ( first_name, last_name, role_id, manager_id ) VALUES ( ?, ?, title.id, ? )

