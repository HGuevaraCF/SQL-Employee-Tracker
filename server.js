const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { response } = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'honeypie',
        database: 'employees_db',
    },
    // console.log(`Connected to the employees_db.`)
);

db.connect(function (error) {
    // console.log(`Connected at ${db.threadId}.`);
    inquirerQuestions();
})

function inquirerQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'options',
            choices: ['View all employees', 'View all roles', 'View all departments', 'Add employee', 'Add role', 'Add department', 'Update Employee role', 'Quit'],
        }
    ])
        .then((response) => {
            switch (response.options) {
                case 'View all employees':
                    db.query(
                        `SELECT
                        employees.id AS id,
                        concat( employees.first_name, ' ', employees.last_name ) AS Name,
                        roles.title AS Role,
                        departments.name AS Department,
                        concat( manager.first_name, ' ', manager.last_name ) AS Manager
                    FROM
                        (((
                            employees
                                LEFT JOIN roles ON ((
                                        employees.role_id = roles.id 
                                    )))
                            LEFT JOIN departments ON ((
                                    roles.department_id = departments.id 
                                )))
                        LEFT JOIN employees manager ON ((
                            employees.manager_id = manager.id 
                        ))); `,
                        function (err, results) {
                            console.log('\n');
                            console.table(results);
                            inquirerQuestions();

                        });
                    break;
                case 'View all roles':
                    db.query(
                        `SELECT roles.id AS id, roles.title AS Title, departments.name AS Department, roles.salary as Salary
                    FROM roles
                    INNER JOIN departments
                    ON roles.department_id = departments.id`, function (err, results) {
                        console.log('\n');
                        console.table(results);
                        inquirerQuestions();
                    });
                    break;
                case 'View all departments':
                    db.query('SELECT * FROM employees_db.departments', function (err, results) {
                        console.log('\n');
                        console.table(results);
                        inquirerQuestions();
                    });
                    break;
                case 'Add employee':
                    db.query('SELECT concat(employees.first_name, " ", employees.last_name) AS name FROM employees_db.employees', function (err, results) {
                        namesArray = []
                        results.forEach(result => {
                            namesArray.push(result.name);
                        });
                        namesArray.push('none');
                        db.query('SELECT title FROM employees_db.roles', function (err, results) {
                            rolesArray = []
                            results.forEach(result => {
                                rolesArray.push(result.title);
                            });
                            AddEmployee(rolesArray, namesArray);
                        });
                    });
                    break;
                case 'Add role':
                    db.query('SELECT name FROM employees_db.departments', function (err, results) {
                        resultsArray = []
                        results.forEach(result => {
                            resultsArray.push(result.name);
                        });
                        AddRole(resultsArray);
                    });
                    break;
                case 'Add department':
                    AddDepartment();
                    break;
                case 'Update Employee role':
                    db.query('SELECT concat(employees.first_name, " ", employees.last_name) AS name FROM employees_db.employees', function (err, results) {
                        namesArray = []
                        results.forEach(result => {
                            namesArray.push(result.name);
                        });
                        db.query('SELECT title FROM employees_db.roles', function (err, results) {
                            rolesArray = []
                            results.forEach(result => {
                                rolesArray.push(result.title);
                            });
                            UpdateEmployeeRole(rolesArray, namesArray);
                        });
                    });
                    break;
                case 'Quit':
                    console.log('Goodbye!');
                    break;
            }
        })
        .catch((error) => {
            console.log(`Error: ${error}`);
        })
};

function AddEmployee(roles, managers) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: "What is the employee´s first name?",
        },
        {
            type: 'input',
            name: 'last_name',
            message: "What is the employee´s last name?",
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee´s role?",
            choices: roles,
        },
        {
            type: 'list',
            name: 'manager',
            message: "Who is the employee´s manager?",
            choices: managers,
        },
    ])
        .then((response) => {
            db.query(`SELECT id FROM employees_db.roles WHERE title = "${response.role}"`, function (err, results) {
                role_id = results[0].id
                db.query(`SELECT id FROM employees_db.employees WHERE first_name = "${response.manager.split(" ")[0]}" AND last_name = "${response.manager.split(" ")[1]}"`, function (err, results) {
                    manager_id = results[0] != undefined ? results[0].id : null;
                    db.query(
                        `INSERT INTO employees (first_name, last_name, role_id, manager_id)
                        VALUES ("${response.first_name}", "${response.last_name}", ${role_id}, ${manager_id})`,
                        function (err, results) {
                            if (err) {
                                console.log(`Unexpected error. Try again. Error: ${err}`);
                                inquirerQuestions();
                            } else {
                                console.log("Employee added succesfully!");
                                inquirerQuestions();
                            }
                        });
                });

            });
        })
        .catch((error) => {
            console.log(error);
        })

};

function UpdateEmployeeRole(roles, names) {
    inquirer.prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: names,
        },
        {
            type: 'list',
            name: 'role',
            message: "Which role do you want to assign to the selected employee?",
            choices: roles,
        },
    ])
        .then((response) => {
            db.query(`SELECT id FROM employees_db.roles WHERE title = "${response.role}"`, function (err, results) {
                role_id = results[0].id
                db.query(`SELECT id FROM employees_db.employees WHERE first_name = "${response.employee.split(" ")[0]}" AND last_name = "${response.employee.split(" ")[1]}"`, function (err, results) {
                    employee_id = results[0].id
                    db.query(
                        `UPDATE employees_db.employees
                    SET role_id = ${role_id}
                    WHERE id = ${employee_id}`,
                        function (err, results) {
                            if (err) {
                                console.log("Unexpected error. Try again.");
                                inquirerQuestions();
                            } else {
                                console.log("Employee´s role updated succesfully!");
                                inquirerQuestions();
                            }
                        });
                });
            });
        })
        .catch((error) => {
            console.log(error);
        })
};

function AddRole(results) {
    inquirer.prompt([
        {
            type: 'input',
            name: 'title',
            message: "What is the role's name?",
        },
        {
            type: 'input',
            name: 'salary',
            message: "What is the role's salary?",
        },
        {
            type: 'list',
            name: 'department',
            message: "Which department does the role belong to?",
            choices: results,
        },
    ])
        .then((response) => {
            db.query(`SELECT id FROM employees_db.departments WHERE name = "${response.department}"`, function (err, results) {
                department_id = results[0].id
                db.query(
                    `INSERT INTO roles (title, salary, department_id)
                VALUES ("${response.title}", ${response.salary}, ${department_id})`,
                    function (err, results) {
                        if (err) {
                            console.log("Unexpected error. Try again.");
                            inquirerQuestions();
                        } else {
                            console.log("Role added succesfully!");
                            inquirerQuestions();
                        }
                    });
            });
        })
        .catch((error) => {
            console.log(error);
        })
};

function AddDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'department_name',
            message: "What is the name of the department?",
        }
    ]).then((response) => {
        db.query(
            `INSERT INTO employees_db.departments (name)
            VALUES ("${response.department_name}")`,
            function (err, results) {
                if (err) {
                    console.log("Unexpected error. Try again.");
                    inquirerQuestions();
                } else {
                    console.log(`Department added succesfully!`);
                    inquirerQuestions();
                }
            });
    })

};








