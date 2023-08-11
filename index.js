const inquirer = require('inquirer');
const mysql = require('mysql2');    
const consoleTable = require('console.table');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'josh123',
    database: 'employee_db'
});

const select = [
    {
        type: 'list',
        name: 'option',
        message: 'What would you like to do?',
        choices: [
            'View all departments',
            'View all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role',
            'update an employee manager',
            'View employees by manager',
            'view employees by department',
            'delete departments',
            'delete roles',
            'delete employees',
            'view the total utilized budget of a department',
            'Exit'
        ]
    }
];

// const viewAllDepartments = () => {
//     db.query('SELECT * FROM department', (err, departments) => {
//         if (err) {
//             console.log(err);
//         }  else {
//             console.table(departments);
//             menu();
//         }
//     });
// };

// const viewAllRoles = () => {
//     db.query('SELECT * FROM role', (err, roles) => {
//         if (err) {
//             console.log(err);
//         }  else {
//             console.table(roles);
//             menu();
//         }
//     });
// };


// const viewAllEmployees = () => {
//     db.query('SELECT * FROM employee', (err, employees) => {
//         if (err) {
//             console.log(err);
//         }  else {
//             console.table(employees);
//             menu();
//         }
//     });
// };

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?'
        }
    ])
    .then((answer) => {
        db.query('INSERT INTO department (name) VALUES(?)', answer.department, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log('Department added!');
                menu();
            }
        });
    });
};


const addRole = () => {
    db.query('SELECT * FROM department', (err, departments) => {
        if (err) {
            console.log(err);
        } else {
            inquirer.prompt([
                {
                    type: 'input',
                    name: 'role',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'salary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'department',
                    message: 'Which department does this role belong to?',
                    choices: () => {
                        const departmentArray = [];
                        departments.forEach(({ name }) => {
                            departmentArray.push(name);
                        });
                        return departmentArray;
                        }
                },
            ]) .then((answer) => {
                let departmentId;
                departments.forEach((department) => {
                    if (department.name === answer.department) {
                        departmentId = department.id;
                    }
                });
                db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answer.role, answer.salary, departmentId], (err, res) => {
                    if (err) {
                        console.log(err);
                    } else {
                        console.log('Role added!');
                        menu();
                    }
                });
            });
        }
    })
}
    
function menu() {
    inquirer.prompt(select)
    .then((answers) => {
    })
    .catch((err) => {
        console.log(err);
    });
}