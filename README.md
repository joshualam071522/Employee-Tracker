# Employee Tracker

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [Credits](#credits)
- [Tests](#tests)
- [Questions](#questions)

## Description

The main idea of the project was to create an employee database that keeps track of all the departments, employees, and their roles in the company. It keeps track of the which employee is in which department, which role they have, and which managers they are also under. The application allows them to create, edit or delete those departments, roles, and employees. The main technologies used in this project include mysql2 for the database, and inquirer for the menu to access that database.

## Installation

In order to install this application, the user would have to clone the repository. You must have mysql installed. From there, they would use the command "npm install" to install all the relevant packages.

## Usage

To use the application, you must first source the schema file by going into the mysql console. To access it, you must type in the console "mysql -u root -p". From there you type "source db/schema.sql;". You can also source the seed schema if you need example data by typing "source db/seeds.sql;" after. After you are done sourcing, simply quit the mysql console by typing "quit". After that, you can start up the employee menu by typing "node index.js". From there, you can start adding, deleting, editing, and viewing the database. To quit, simply go to the "Exit" option.

To use the application, 
## Credits

https://github.com/joshualam071522

## License

This project is licensed under the MIT license.
https://opensource.org/licenses/MIT

## Tests

N/A

## Questions

To reach me for additional questions, please send an email to: privateemail@email.com
