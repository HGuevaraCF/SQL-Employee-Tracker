const mysql = require('mysql2');
const inquirer = require('inquirer');
const cTable = require('console.table');


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
                break;
            case 'View all roles':
                break;
            case 'View all departments':
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

