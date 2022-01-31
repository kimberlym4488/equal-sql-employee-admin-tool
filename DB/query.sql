/* view all departments*/

Select * from department;

/*View all roles, (job title, role id, department name, salary)*/
Select roles.title, roles.id, roles.salary, department.departmentName FROM roles JOIN department ON roles.department_id = department.id

/*View all employees (employee id, first name, last name, job title, department, salary, manager)*/

Select