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
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Update an employee manager',
            'View employees by manager',
            'View employees by department',
            'Delete departments',
            'Delete roles',
            'Delete employees',
            'Exit'
        ]
    }
];

const viewAllDepartments = () => {
    db.query('SELECT id, name FROM department', (err, departments) => {
        if (err) {
            console.log(err);
        }  else {
            console.log(`\nDisplaying all departments\n`)
            console.table(departments);
            console.log(`\n\n Returning to main menu...\n`)
            menu();
        }
    });
};

// add join for department name
const viewAllRoles = () => {
    db.query('SELECT title, salary FROM role', (err, roles) => {
        if (err) {
            console.log(err);
        }  else {
            console.log(`\nDisplaying all roles\n`)
            console.table(roles);
            console.log(`\n\n Returning to main menu...\n`)
            menu();
        }
    });
};

const viewAllEmployees = () => {
    db.query('SELECT * FROM employee', (err, employees) => {
        if (err) {
            console.log(err);
        }  else {
            console.log(`\nDisplaying all employees\n`)
            console.table(employees);
            console.log(`\n\n Returning to main menu...\n`)
            menu();
        }
    });
};

const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department',
            message: 'What is the name of the department?'
        }
    ])
    .then((answers) => {
        db.query('INSERT INTO department (name) VALUES(?)', answers.department, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n${answers.department} Department added!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    });
};

const departmentQuery = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM department', (err, departments) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(departments);
            }
        });
    });
};

//* add validator for salary
const addRole = async () => {
    try {
        const departments = await departmentQuery();

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the title of the role?'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role?'
            },
            {
                type: 'list',
                name: 'department',
                message: 'What department is the role in?',
                choices: departments.map(department => department.name)
            }
        ]);

        const departmentId = departments.find(department => department.name === answers.department).id;

        db.query('INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)', [answers.title, answers.salary, departmentId], (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n${answers.title} role added!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const addEmployee = async () => {
    try {
        const roles = await roleQuery();
        const employees = await employeeQuery();

        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'firstName',
                message: `What is the employee's first name?`
            },
            {
                type: 'input',
                name: 'lastName',
                message: `What is the employee's last name?`
            },
            {
                type: 'list',
                name: 'role',
                message: `What is the employees role?`,
                choices: roles.map(role => role.title),
            },
            {
                type: 'list',
                name: 'manager',
                message: `Who is the employee's manager?`,
                choices: [...employees.map(employee => `${employee.first_name} ${employee.last_name}`), 'None']
            }
        ]);

        const roleId = roles.find(role => role.title === answers.role).id;
        const managerId = answers.manager === 'None' ? null : employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.manager).id;

        db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)', [answers.firstName, answers.lastName, roleId, managerId] , (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n ${answers.firstName} ${answers.lastName} added!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const roleQuery = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM role', (err, roles) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(roles);
            }
        });
    });
};


const employeeQuery = () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM employee', (err, employees) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(employees);
            }
        });
    });
};

const updateEmployeeRole = async () => {
    try {
        const roles = await roleQuery();
        const employees = await employeeQuery();

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: `Which employee's role would you like to update?`,
                choices: employees.map(employee => `${employee.first_name} ${employee.last_name}`)
            },
            {
                type: 'list',
                name: 'role',
                message: `What is the employee's new role?`,
                choices: roles.map(role => role.title)
            }
        ]);

        const roleId = roles.find(role => role.title === answers.role).id;
        const employeeId = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employee).id;

        db.query('UPDATE employee SET role_id = ? WHERE id = ?', [roleId, employeeId], (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n${answers.employee}'s role updated!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const updateEmployeeManager = async () => {
    try {
        const employees = await employeeQuery();
        
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: `Which employee's manager would you like to update?`,
                choices: employees.map(employee => `${employee.first_name} ${employee.last_name}`)
            },
            {
                type: 'list',
                name: 'manager',
                message: `Who is the employee's new manager?`,
                choices: [...employees.map(employee => `${employee.first_name} ${employee.last_name}`), 'None']
            }
        ]);

        const managerId = answers.manager === 'None' ? null : employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.manager).id;
        const employeeId = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employee).id;

        db.query('UPDATE employee SET manager_id = ? WHERE id = ?', [managerId, employeeId], (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n ${answers.employee}'s manager updated!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const viewEmployeesByManager = async () => {
    try {
        const employees = await employeeQuery();

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'manager',
                message: `Which manager's employees would you like to view?`,
                choices: employees.map(employee => `${employee.first_name} ${employee.last_name}`)
            }
        ]);

        const managerId = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.manager).id;

        db.query('SELECT first_name, last_name FROM employee WHERE manager_id = ?', managerId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\nDisplaying ${answers.manager}'s employees:\n`)
                console.table(res);
                console.log(`\n\n Returning to main menu...\n`)
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const viewEmployeesByDepartment = async () => {
    try {
        const departments = await departmentQuery();

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: `Which department's employees would you like to view?`,
                choices: departments.map(department => department.name)
            }
        ]);

        const departmentId = departments.find(department => department.name === answers.department).id;

        db.query('SELECT first_name, last_name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department on role.department_id = department.id WHERE role.department_id = ?', departmentId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\nDisplaying ${answers.department}'s employees:\n`)
                console.table(res);
                console.log(`\n\n Returning to main menu...\n`)
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const deleteDepartments = async () => {
    try {
        const departments = await departmentQuery();

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'department',
                message: `Which department would you like to delete?`,
                choices: departments.map(department => department.name)
            }
        ]);

        const departmentId = departments.find(department => department.name === answers.department).id;

        db.query('DELETE FROM department WHERE id = ?', departmentId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n ${answers.department} deleted!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const deleteRoles = async () => {
    try {
        const roles = await roleQuery();

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'role',
                message: `Which role would you like to delete?`,
                choices: roles.map(role => role.title)
            }
        ]);

        const roleId = roles.find(role => role.title === answers.role).id;

        db.query('DELETE FROM role WHERE id = ?', roleId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n ${answers.role} deleted!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

const deleteEmployees = async () => {
    try {
        const employees = await employeeQuery();

        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee',
                message: `Which employee would you like to delete?`,
                choices: employees.map(employee => `${employee.first_name} ${employee.last_name}`)
            }
        ]);
        
        const employeeId = employees.find(employee => `${employee.first_name} ${employee.last_name}` === answers.employee).id;

        db.query('DELETE FROM employee WHERE id = ?', employeeId, (err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(`\n ${answers.employee} deleted!\n\n Returning to main menu...\n`);
                menu();
            }
        });
    } catch (err) {
        console.log(err);
    }
};

    
function menu() {
    inquirer.prompt(select)
    .then((answers) => {
        switch (answers.option) {
            case 'View all departments':
                viewAllDepartments();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmployees();
                break;
            case 'Add a department':
                addDepartment();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmployee();
                break;
            case 'Update an employee role':
                updateEmployeeRole();
                break;
            case 'Update an employee manager':
                updateEmployeeManager();
                break;
            case 'View employees by manager':
                viewEmployeesByManager();
                break;
            case 'View employees by department':
                viewEmployeesByDepartment();
                break;
            case 'Delete departments':
                deleteDepartments();
                break;
            case 'Delete roles':
                deleteRoles();
                break;
            case 'Delete employees':
                deleteEmployees();
                break;
            case 'Exit':
                console.log(`\nExiting Menu...\n`);
                process.exit();
        }
    });
}
menu();