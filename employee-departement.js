require('dotenv').config()
const mysql = require("mysql");
const inquirer = require("inquirer");
var util = require("util");
require("console.table");



// CREDENTIALS FOR CONNECTION
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.DB_PW,
  database: "employeeTracker_DB"
});



// CONNECTING SERVER WITH MYSQL DB
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected as ID " + connection.threadId);
    // Kick off the prompts
    runPrompts();
  });
  


const runPrompts = () => {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What would you like to do?",
        choices: [
            "View Records",
            "Add Records", 
            "Update Records",
            "Remove Records",
            "Exit"]
        })
        .then((answer) => {
            switch (answer.action) {

                case  "View Records":
                    viewRecords();
                    break;

                case "Add Records":
                    addRecords();
                    break;

                case "Update Records":
                    updateRecords();
                    break;
                
                case "Remove Records":
                    removeRecords();
                    break;

                case "Exit":
                    console.log("Goodbye");
    };
    });
};



// ? VIEW RECORDS PROMPTS AND FUNCTIONS //
const viewRecords = () => {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "Which Records would you like to display?",
        choices: [
            "View All Employees",
            "View All Employees by Manger",
            "View All Employees by Department",
            "View All Roles",
            "View All Departments",
            "Back to Menu",
            "Exit"]
        })
        .then((answer) => {
            switch (answer.action) {
                
                case "View All Employees":

                    viewEmployees();
                    break;

                case "View All Employees by Manger":
                    viewByManger();
                    break;

                   
                case  "View All Employees by Department":
                    viewByDepartment();
                break;


                case "View All Roles":
                        viewRoles();
                        break;

                case  "View All Departments":
                    viewDepartments();
                    break;

                case "Back to Menu":
                    runPrompts();
                        break;

                case "Exit":
                    console.log("Goodbye");
                };
            });
};
        
const viewEmployees = () => {
    const query = "SELECT id, first_name, last_name, role_title FROM employee"
    connection.query(query, (err, res) => {
        res.forEach(({id, first_name, last_name , role_title})=> {
            console.log(`ID: ${id}|| Full Name: ${first_name} ${last_name}  || Title: ${role_title}` ) 
        });
    runPrompts();
    });
};

const viewDepartments = () => {
    const query = "SELECT id, department_name, department_lead FROM departments"
    connection.query(query, (err, res) => {
        res.forEach(({id, department_name, department_lead})=> {
            console.log(`ID: ${id}|| Name: ${department_name}, || Lead By: ${department_lead}`)
        });
    runPrompts();
    });
};

const viewRoles = () => {
    const query = "SELECT id, title, salary FROM role"
    connection.query(query, (err, res) => {
        res.forEach(({id, title, salary})=> {
            console.log(`ID: ${id}|| Tile: ${title}|| Salary: ${salary}`)
        });
    runPrompts();
    });
};

const viewByManger = () => {
   /*  const query = "SELECT id, first_name, last_name, manager_id FROM employee"
    connection.query(query, (err, res) => {
        res.forEach(({id, first_name, last_name})=> {
            console.log(`ID: ${id}|| Full Name: ${first_name} ${last_name}`) */
    connection.query('SELECT * FROM employee', (err, results) => {
        if (err) throw err;

        let query = 'SELECT id, first_name, last_name, role_title FROM employee '
        query += ' WHERE employee.manager = ?'

        inquirer.prompt([
            {
              name: 'manager',
              type: 'list',
              choices() {
                const viewManArray = []
                results.forEach(({manager}) => {
                    viewManArray.push(manager);
                });
                let viewByManArray = viewManArray;
                return viewByManArray
              },
              message: 'Which Manager Records would you like to view?'
            }
          ])
          .then((answers) => {
            console.clear()
          
           
            connection.query(query, [answers.manager], (err, res) => {
                console.log(res)
                console.log(query)
                console.log(answers)
                console.log(answers.manager)
              if (res.length < 1){
                console.log("No Employees under this management... Add one!!!")
                runPrompts();
              }
              else{
              // Going to push the department data into a table
              console.log(`Here are the employees under ${answers.manager}`)
              console.table(res)
              //Return to the main prompt
              runPrompts();
              }
            })
          }
          )
      })
};

const viewByDepartment = () => {
    connection.query('SELECT * FROM departments', (err, results) => {
        if (err) throw err;

        let query = 'SELECT departments.department_name, role.title, employee.first_name, employee.last_name ';
        query += 'FROM departments INNER JOIN role ON (department_name = role.department) INNER JOIN employee ON (employee.role_title = role.title)';
        query += 'WHERE departments.department_name = ?'
        
        inquirer.prompt([
            {
              name: 'department',
              type: 'list',
              choices() {
                const viewDepArray = []
                results.forEach(({ department_name }) => {
                    viewDepArray.push(department_name);
                });
                let viewByDepArray = viewDepArray;
                return viewByDepArray
              },
              message: 'Which department would you like to view?'
            }
          ])
           
            .then((answers) => {
              console.clear()
              connection.query(query, [answers.department], (err, res) => {
                console.log(res)
                if (res.length < 1){
                  console.log("No Employees in this department... Add one!!!")
                  runPrompts();
                }
                else{
                // Going to push the department data into a table
                console.log(`Here are the employees in ${answers.department}`)
                console.table(res)
                //Return to the main prompt
                runPrompts();
                }
              })
            }
            )
        })
};









// ? ADD RECORDS PROMPTS AND FUNCTIONS //
const addRecords = () => {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What type of record would you like to add?",
        choices: [
            "Add Employee",
            "Add Role",
            "Add Department",
            "Back to Menu",
            "Exit"]
        })
        .then((answer) => {
            switch (answer.action) {
                
                case  "Add Employee":
                    addEmployee();
                    break;

                case "Add Role":
                    addRole();
                    break;

                case  "Add Department":
                    addDepartment();
                    break;

                case "Back to Menu":
                    runPrompts();
                        break;

                case "Exit":
                    console.log("Goodbye");
                };
            });
        };
        

const addEmployee = () => {
    connection.query('SELECT * FROM role', async (err, results) => {
        if (err) throw err;
   
        
   await inquirer.prompt([
        {
          name: 'firstName',
          type: 'input',
          message: 'What is the employees first name?'
        },
        {
          name: 'lastName',
          type: 'input',
          message: 'What is the employees last name?'
        },
        
        {
            name: 'roleTitle',
            type: 'list',
            message: `What is this employees role?
            `,
            choices: [
                "Software Engineer",
                "Sales Representative",
                "Customer Success Representative",
            ]

        },
        
        {
          name: 'manager',
          type: 'input',
          message: 'What is the employees managers name?'
        }
      ])
      .then((answer)=>{
        connection.query('INSERT INTO employee SET ?',
        {
          first_name: answer.firstName,
          last_name: answer.lastName,
          role_title : answer.roleTitle,
          manager: answer.manager,
        },
        (err, res) => {
          if (err) throw err;
            // affectedrows calls on the rows affected
          console.log(`Employee ${answer.firstName}  ${answer.lastName} inserted!\n`);
          runPrompts();
        });
    });
});
};


const addRole = () => {
    //connect to role table for department data
    connection.query('SELECT * FROM departments', async (err, results) => {
        if (err) throw err;
   
            
    await inquirer.prompt([
            {
            name: 'rolenName',
            type: 'input',
            message: 'What is the name of the role?'
            },
            {
            name: 'roleSalary',
            type: 'input',
            message: 'What is the role'/'s salary ?'
            },
            {
            name: 'roleDepartment',
            type: 'list',
            message: 'What Department is the new role in?',
            /* choices: [ "a", "b", "c",] */


                choices() {

                    //creating an array to push titles into 
                    const depArray = [];
                    //loop to push names into the array
                    results.forEach(({ department_name }) => {
                        depArray.push(department_name);
                    });
                    //create var to add and display answers
                    let displayDepartments = depArray;
                    return displayDepartments
                } 
            },
    ])

    .then((answer)=>{
            connection.query('INSERT INTO role SET ?',
            {
                title: answer.rolenName,
                salary: answer.roleSalary,
                department: answer.roleDepartment,
            },
            (err, res) => {
            if (err) throw err;


            console.log(`Role ${answer.rolenName} added under ${answer.roleDepartment} !\n`);
            runPrompts();
            });
        });
    });
};


const addDepartment = () => {
    inquirer
        .prompt([
            {
                name: 'deptName',
                type: 'input',
                message: 'What is the name of the department?',
            },
            {
                name: 'deptLead',
                type: 'input',
                message: 'Who is the manager for this deparment?',
            },
        ])
        .then((answer) => {
            connection.query(
                'INSERT INTO departments SET?',
                {
                    department_name: answer.deptName,
                    department_lead: answer.deptLead,
                },

                async (err, res) => {
                    if (err) throw err;
                    await console.log("Department and Lead were added!!!")
                    await runPrompts();
                })

        }); 
        };






// ? UPDATE RECORDS PROMPTS AND FUNCTIONS //
const updateRecords = () => {
    inquirer
        .prompt([
            {
                name: 'updateRecords',
                type: 'list',
                message: 'Select the Records you want to update',
                choices: ['Employee Records', 'Current Roles', 'Departments']
            },
        ])
        .then((answer) => {
            switch (answer.updateRecords) {
                case 'Employee Records':
                    updateEmployee();
                    break;

                case 'Current Roles':
                    updateRoles();
                    break;

                case 'Departments':
                    updateDepartment();
                    break;

                default:
                    console.log(`Invalid action: ${answer.updaterec}`)

            };
        });

};

const updateEmployee = async () => {
    try {
        const employeeUpdate = await inquirer
            .prompt([
            {
                name: 'firstname',
                type: 'input',
                message: 'What is the first name of the employee you would you like to update?'
            },
            {
                name: 'lastname',
                type: 'input',
                message: 'What is the last name of the employee you would you like to update?'
            },
            {
                name: 'updateAnswers',
                type: 'list',
                message: 'What field would you like to update?',
                choices: ['first_name', 'last_name', 'job_title', 'manager',],
            },

            {
                name: 'updatedinfo',
                type: 'input',
                message: 'Enter the new information.',
            }, 


            /* {
                name: 'firstName',
                type: 'input',
                message: 'What is the employees first name?'
              },
              {
                name: 'lastName',
                type: 'input',
                message: 'What is the employees last name?'
              },
              
              {
                  name: 'roleTitle',
                  type: 'list',
                  message: `What is this employees role?
                  `,
                  choices: [
                      "Software Engineer",
                      "Sales Representative",
                      "Customer Success Representative",
                  ]
      
              },
              
              {
                name: 'manager',
                type: 'input',
                message: 'What is the employees managers name?'
              } */
        ])
         let updateAnswers = employeeUpdate.updateAnswers;
         let updatedInfo = employeeUpdate.updatedinfo;
         let firstName = employeeUpdate.firstname; 
         let lastName = employeeUpdate.lastname; 
         let query;
         console.log(employeeUpdate);

        switch (updateAnswers) {
            case 'first_name':
                query = `UPDATE employee SET first_name = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                break;


             case 'last_name':
                query = `UPDATE employee SET last_name = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                break;

            case 'job_title':
                query = `UPDATE employee SET job_title = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                break;

            case 'manager':
                query = `UPDATE employee SET manager = '${updatedInfo}' WHERE (first_name, last_name)=('${firstName}','${lastName}')`
                break;

            default:
                console.log(`Cannot update ${updateAnswers}`);
        };
        console.log(query);

        connection.query(query, async (err, res) => {
            if (err) throw err;
            await console.table(`${res.affectedRows} record updated!\n`);
            console.log(`Employee ${employeeUpdate.firstname}${employeeUpdate.lastname} was updated!\n`);
            
            runPrompts();
        });
    } catch (error) { console.log(error) };

    };

/* 

        .then((answer) => {
            connection.query('UPDATE INTO employee SET ? WHERE (first_name, last_name)',
                {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_title : answer.roleTitle,
                manager: answer.manager,
                },
                (err, res) => {
                if (err) throw err;

                console.log(`Employee ${answer.firstName}  ${answer.lastName} was updated!\n`);
                runPrompts();
                });
            }); */

const updateRoles = () => {
    connection.query('SELECT * FROM role', async (err, results) => {
        if (err) throw err;
        await inquirer
            .prompt([
                {
                    name: 'role',
                    type: 'list',
                    message: 'Which role would you like to update',
                    choices() {

                        //creating an array to push titles into 
                        const rolesArray = [];
                        //loop to push titles into the array
                        results.forEach(({ title }) => {
                            rolesArray.push(title);
                        });
                        //create var to add and display answers
                        let displayRoles = rolesArray;
                        return displayRoles
                    }
                },

                {
                    name: 'updatetype',
                    type: 'list',
                    message: 'Seect item to update.',
                    choices: [
                        'title',
                        'department',
                        'salary'
                    ],
                },

                {
                    name: 'updateinfo',
                    type: 'input',
                    message: 'Enter the new information to update.',
                },
                
            ])
            .then((answer) => {
                const query = `UPDATE role SET ${answer.updatetype} = '${answer.updateinfo}' WHERE ?`
                
                //selecting where to add the new qiery
                connection.query(query,
                    
                    [
                        {
                            title: answer.role,
                        },
                    ],
                    async (err, res) => {
                        if (err) throw err;
                        await console.table(`${res.affectedRows} record updated!\n`);
                        runPrompts();
                      
                    });
            });
    });
};

const updateDepartment = async () => {
    
        connection.query('SELECT * FROM departments', async (err, results) => {
            if (err) throw err;
            /* const depUpdate = await inquirer */

            await inquirer.prompt([
                        {
                            name: 'department',
                            type: 'list',
                            message: 'Which deparment would you like to update?',
                            choices() {

                                //creating an array to push titles into 
                                const updateDepArray = [];
                                //loop to push titles into the array
                                results.forEach(({ department_name }) => {
                                    updateDepArray.push(department_name);
                                });
                                //create var to add and display answers
                                let updateDepartments = updateDepArray;
                                return updateDepartments
                            }
                        },

                        {
                            name: 'updateitem',
                            type: 'list',
                            message: 'What would you like to update?',
                            choices: ['id', 'department_name', 'department_lead'],
                        },

                        {
                            name: 'updateinfo',
                            type: 'input',
                            message: 'Enter the new information.',
                        },
                        
                    ])
                    
                    .then((depUpdate)=>{ 
                        
                        const query = `UPDATE departments SET ${depUpdate.updateitem} = '${depUpdate.updateinfo}' WHERE ?`
                        
                        //selecting where to add the new qiery
                      
                        connection.query(query,
                            [
                                {
                                    department_name: depUpdate.department,
                                },
                            ],
                            async (err, res) => {
                                if (err) throw err;
                                await console.table(`${depUpdate.department} record updated!\n`)
                                await console.table('NEW '+ depUpdate.updateitem + ' -- ' + depUpdate.updateinfo )
                                
                                runPrompts();
                            }
                        );
                    });
        });            
};

// OTHER UPDATE CODE
/* 
const updateDepartment = async () => {
    try {
        connection.query('SELECT * FROM departments', async (err, results) => {
            if (err) throw err;
            const depUpdate = await inquirer
                .prompt([
                    {
                        name: 'department',
                        type: 'list',
                        message: 'Which deparment would you like to update?',
                        choices() {

                            //creating an array to push titles into 
                            const updateDepArray = [];
                            //loop to push titles into the array
                            results.forEach(({ department_name }) => {
                                updateDepArray.push(department_name);
                            });
                            //create var to add and display answers
                            let updateDepartments = updateDepArray;
                            return updateDepartments
                        }
                    },

                    {
                        name: 'updateName',
                        type: 'input',
                        message: 'Update name for the Department.',
                    
                    },

                    {
                        name: 'updateLead',
                        type: 'input',
                        message: 'Update Lead for the Department.',
                    },
                    
                ])
                console.log(depUpdate)
                    const query = `UPDATE departments SET ${depUpdate.updateName}, ${depUpdate.updateLead} WHERE ?`
                    console.log(query)
                    //selecting where to add the new qiery
                    console.log(depUpdate.department)
                    connection.query(query,
                        [
                            {
                                department_name: depUpdate.department,
                            },
                        ],
                        async (err, res) => {
                            if (err) throw err;
                            await console.table(`${res.affectedRows} record updated!\n`);
                        }
                    );
        });
    } catch (error) { console.log(error) }
};

 */







// ? DELETE RECORDS PROMPTS AND FUNCTIONS //

const removeRecords = () => {
    inquirer
      .prompt({
        name: "action",
        type: "list",
        message: "What type of record would you like to remove?",
        choices: [
            "Remove Employee",
            "Remove Role",
            "Remove Department",
            "Back to Menu",
            "Exit"]
        })
        .then((answer) => {
            switch (answer.action) {
                
                case  "Remove Employee":

                   connection.query('SELECT * FROM employee', (err, results) => {
                    if (err) throw err;
                    inquirer.prompt([
                      {
                        name: 'employee',
                        type: 'list',
                        choices() {
                          //Creates the choice array
                          const delEmpArray = []
                          //populates the roles into the choice array
                          results.forEach(({ id, first_name, last_name }) => {
                            delEmpArray.push(`${id} ${first_name} ${last_name}`);
                          })
                          let deleteEmployee = delEmpArray;
                          return deleteEmployee
                        },
                        message: 'Which employee would you like to remove?'
                      }
                    ])
                      .then((answer) => {
                        //This is going to allow us to split the employee ID and name into an array we will use the employee ID(employeeARR[0]) later
                        const employeeArr = answer.employee.split(' ')
                        // This is going to use the employee ID to remove the employee from the table
                        connection.query('DELETE FROM employee WHERE ?',
                          {
                            id: employeeArr[0]
                          },
                          (err, res) => {
                            if (err) throw err;
                            console.log(`${answer.employee} deleted!\n`);
            
                            runPrompts();
                          }
                        )
                      })
                  })
                  break;
            
                case "Remove Role":
                    
                   connection.query('SELECT * FROM role', (err, results) => {
                    if (err) throw err;
                    inquirer.prompt([
                      {
                        name: 'role',
                        type: 'list',
                        choices() {
                          //Creates the choice array
                          const delRoleArray = []
                          //populates the roles into the choice array
                          results.forEach(({ id, title, salary }) => {
                            delRoleArray.push(`${id} ${title} ${salary}`);
                          })
                          let deleteRole = delRoleArray;
                          return deleteRole
                        },
                        message: 'Which role would you like to remove?'
                      }
                    ])
                      .then((answer) => {
                        //This is going to allow us to split the employee ID and name into an array we will use the employee ID(employeeARR[0]) later
                        const roleArr = answer.role.split(' ')
                        // This is going to use the employee ID to remove the employee from the table
                        connection.query('DELETE FROM role WHERE ?',
                          {
                            id: roleArr[0]
                          },
                          (err, res) => {
                            if (err) throw err;
                            console.log(`${answer.role} deleted!\n`);
            
                            runPrompts();
                          }
                        )
                      })
                  })
                    break;

                case  "Remove Department":
                    
                   connection.query('SELECT * FROM departments', (err, results) => {
                    if (err) throw err;
                    inquirer.prompt([
                      {
                        name: 'department',
                        type: 'list',
                        choices() {
                          //Creates the choice array
                          const delDepArray = []
                          //populates the roles into the choice array
                          results.forEach(({ id, department_name  }) => {
                            delDepArray.push(`${id} ${department_name}`);
                          })
                          let deleteDep = delDepArray;
                          return deleteDep
                        },
                        message: 'Which department would you like to remove?'
                      }
                    ])
                      .then((answer) => {
                        //This is going to allow us to split the employee ID and name into an array we will use the employee ID(employeeARR[0]) later
                        const depArr = answer.department.split(' ')
                        // This is going to use the employee ID to remove the employee from the table
                        connection.query('DELETE FROM departments WHERE ?',
                          {
                            id: depArr[0]
                          },
                          (err, res) => {
                            if (err) throw err;
                            console.log(`${answer.department} deleted!\n`);
            
                            runPrompts();
                          }
                        )
                      })
                  })
                    break;

                case "Back to Menu":
                    runPrompts();
                        break;

                case "Exit":
                    console.log("Goodbye");
                };
            });
        };
    