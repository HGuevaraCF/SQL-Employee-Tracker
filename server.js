const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');

const PORT = process.env.PORT || 3001;
const app = express();

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    },
    console.log(`Connected to the employees_db.`)
  );


function inquirerQuestions() {
    inquirer.prompt([
        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'options',
            choices: ['View all employees', 'View all roles', 'View all departments', 'Add employee', 'Add role', , 'Add department', 'Update Employee role', 'Quit'],
        } 
    ])
    .then((response) => {
        switch(response.options){
            case 'View all employees':
                db.query('SELECT * FROM employees_db.employees', function (err, results) {
                    console.table(results);
                });
                inquirerQuestions();
                break;
            case 'View all roles':
                db.query('SELECT * FROM employees_db.roles', function (err, results) {
                    console.table(results);
                });
                inquirerQuestions();
                break;
            case 'View all departments':
                db.query('SELECT * FROM employees_db.departments', function (err, results) {
                    console.table(results);
                });
                inquirerQuestions();
                break;
            case 'Add employee':
                AddEmployee();
                break;
            case 'Add role':
                AddRole();
                break;
            case 'Add department':
                AddDepartment();
                break;
            case 'Update Employee role':
                UpdateEmployeeRole();
                break;
            case 'Quit':
                console.log('quit');
                break;

        }
    })
    .catch((error) => {
        console.log(`Error: ${error}`);
    })
};

function AddEmployee(){
    console.log('AddEmployee');
    inquirerQuestions();
};

function UpdateEmployeeRole(){
    console.log('UpdateEmployeeRole');
    inquirerQuestions();
};

function AddRole() {
    console.log('AddRole');
    inquirerQuestions();
};

function AddDepartment(){
    console.log('AddDepartment');
    inquirerQuestions();
};

inquirerQuestions();


// Default response for any other request (Not Found)
// app.use((req, res) => {
//     res.status(404).end();
//   });
  
//   app.listen(PORT, () => {
//     console.log(`Server running on port ${PORT}`);
//   });
  

