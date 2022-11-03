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
                    viewAllDepartments();
                    break;
                case "Add Department":
                    addDepartment();
                    break;

                case "View all Roles":
                    viewAllRoles();
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
function viewAllDepartments() {
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
function addRole() {
    connection.query('select * from department',(err,result) =>{
        let deptID = result.map(department => {
            return department.id
        })
        inquirer.prompt([

            {
                type: 'input',
                name: 'role_name',
                message: 'Please add a role name:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Please add a salary:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Please add a department id:',
                choices: deptID
            },
    
        ]).then(answer => {
            console.log(answer);
            connection.query('INSERT INTO role SET ?', {title: answer.role_name, salary: answer.salary, department_id: answer.department_id}, (err, res) => {
                if (err) throw err;
                console.log('new role was added')
                showList();
            });
        });

    })
    }
    function addEmployee() {
        connection.query('select * from employee',(err,result) =>{
            let roleID = result.map(employee => {
                return  employee.role_id
            })
        
            let managerID = result.map(employee => {
                return  employee.manager_id

            }).filter(emp => emp != null)
            console.log(managerID)
            inquirer.prompt([

                {
                    type: 'input',
                    name: 'first_name',
                    message: 'Please add a first name:'
                },
                {
                    type: 'input',
                    name: 'last_name',
                    message: 'Please add a last name:'
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Please add employee role_id:',
                    choices: roleID
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Please add employee manager_id:',
                    choices: managerID

                }
        
            ]).then(answer => {
                console.log(answer);
                connection.query('INSERT INTO employee SET?', { first_name: answer.first_name, last_name: answer.last_name, role_id:answer.role_id,manager_id:answer.manager_id}, (err, res) => {
                    if (err) throw err;
                    console.log('new employee was added')
                    showList();
                });
            });


        
        })};

function viewAllRoles() {
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
    on employee2.id = employee.manager_id 
    left join employee_tracker.Role as role
    on employee.role_id = role.id 
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
function updateEmployeeRole() {
    connection.query('select * from employee',(err,result) =>{
        let name = result.map(employee => {
            return employee.first_name
        })
        let managerID = result.map(employee => {
            return  employee.manager_id
        }).filter(emp => emp != null)

        connection.query('select * from role', (err,role_result) => {
            let roleId = role_result.map(role => {
                return role.id
            })
            inquirer.prompt([

                {
                    type: 'list',
                    name: 'first_name',
                    message: 'Please select an employee :',
                    choices: name
                },
                {
                    type: 'list',
                    name: 'role_id',
                    message: 'Please add a an employee role:',
                    choices : roleId
                },
                {
                    type: 'list',
                    name: 'manager_id',
                    message: 'Please add a manger id:',
                    choices: managerID
                },
        
            ]).then(answer => {
                console.log(answer);
                connection.query(`update employee SET role_id = ${answer.role_id}, manager_id = ${answer.manager_id} where first_name = '${answer.first_name}'`, (err, res) => {
                    if (err) throw err;
                    console.log('new role was added')
                    showList();
                });
        })
    })
       
});
}

showList();
