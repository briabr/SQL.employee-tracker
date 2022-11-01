const inquirer = require('inquirer');
const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Employee_Tracker',
});
connection.connect();

function showList() {
    inquirer.prompt(

        {
            type: 'list',
            message: 'What would you like to do?',
            name: 'option',
            choices: [
                'View all Employees',
                'Add Employee',
                'Update Employee Role',
                'View all Roles',
                'Add Role',
                'View all Departments',
                'Add Department',
                'Quit'
            ]

        }).then(answer => {

            switch (answer.option) {
                
                case "View all Employees":
                    viewAllEmployees();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;

                case "Update Employee Role":
                    updateEmployeeRole();
                    break;

                case "View all Departments":
                    showAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;

                case "View all Roles":
                    showAllRoles();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case "Quit":
                    connection.end();
                    console.log('Thank you!!');
                    break;
            }
        })
}
function showAllDepartments() {
    connection.query(
        'SELECT * FROM Department', (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res)
            showList();
        }
    )
}

function addDepartment() {
    inquirer.prompt([

        {
            type: 'input',
            name: 'department',
            message: 'Please add a department name:'
        }

    ]).then(answer => {
        console.log(answer);
        connection.query('INSERT INTO department SET?', { name: answer.department }, (err, res) => {
            if (err) throw err;
            console.log('new department was added')
            showList();
        });
    });
}

function showAllRoles() {
    connection.query(
        `select role.title as role_title, 
        role.salary as Salary , 
        department.name as Department 
        from role  
        left join department  
        on department.id = role.department_id`, 
        (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res)
            showList();
        }
    )
}

// function addRoles()

function viewAllEmployees() {
    const sql = 
    `Select employee.id as Employee_ID, 
    concat(employee.first_name,"  ",employee.last_name ) as Employee_Name , 
    role.title as Job_tittle, 
    role.salary as Salary,
    department.name as Department_Name,
    concat(employee2.first_name,"  ",employee2.last_name) as Manager_Name 
    from employee_tracker.employee as employee 
    left join employee_tracker.employee as employee2 
    on employee2.id=employee.manager_id 
    left join employee_tracker.Role as role
    on employee.role_id=role.id 
    left join employee_tracker.department as department 
    on department.id = role.department_id`;

    connection.query(
        sql, 
        (err, res) => {
            if (err) {
                throw err;
            }
            console.table(res)
            showList();
        }

    )
}
// function addEmployee() 
// function updateEmployeeRole()

showList();
