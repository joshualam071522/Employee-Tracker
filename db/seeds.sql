INSERT INTO department (name)
VALUES ('Office'), ('Warehouse');

INSERT INTO role (title, salary, department_id)
VALUES ('Manager', 70000, 1)
, ('Sales', 50000, 1)
, ('Warehouse Employee', 40000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Michael', 'Scott', 1, NULL)
, ('Dwight', 'Schrute', 2, 1)
, ('Daryl', 'Philbin', 3, NULL);
       