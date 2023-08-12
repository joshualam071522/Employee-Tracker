use employee_db;

SELECT first_name, last_name 
FROM employee 
INNER JOIN role ON employee.role_id = role.id 
INNER JOIN department on role.department_id = department.id 
WHERE role.department_id = 1;