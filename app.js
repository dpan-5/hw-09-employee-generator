const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// List of employees
const employeeList = [];


// Inquirer for adding employees
function init() {
    inquirer.prompt([
        {
            name: "role",
            type: "list",
            message: "What kind of team member would you like to add?",
            choices: ["Engineer", "Intern", "Manager"]
        },
        {
            name: "name",
            type: "input",
            message: "What is this employee's name?",
        },
        {
            name: "id",
            type: "input",
            message: "What is this employee's ID?",
            validate: function(input) {
                if (isNaN(input)) {
                    console.log("\x1b[31m", "\nPlease enter a valid number");
                }
                return !isNaN(input);
            }
        },
        {
            name: "email",
            type: "input",
            message: "What is this employee's email?",
        }
    ]).then(function(response) {
        let newEmployee = response;
        switch(response.role) {
            case "Engineer":
                inquirer.prompt([
                    {
                        name: "github",
                        type: "input",
                        message: "What is this employee's GitHub username?",
                    }
                ]).then(function(response) {
                    const engineer = new Engineer(newEmployee.name, newEmployee.id, newEmployee.email, response.github);
                    employeeList.push(engineer);
                    promptConfirm();
                });
                break;
            case "Intern":
                inquirer.prompt([
                    {
                        name: "school",
                        type: "input",
                        message: "What is this employee's school?",
                    }
                ]).then(function(response) {
                    const intern = new Intern(newEmployee.name, newEmployee.id, newEmployee.email, response.school);
                    employeeList.push(intern);
                    promptConfirm();
                });
                break;
            case "Manager":
                inquirer.prompt([
                    {
                        name: "officeNumber",
                        type: "input",
                        message: "What is this employee's office number?",
                        validate: function(input) {
                            if (isNaN(input)) {
                                console.log("\x1b[31m", "\nPlease enter a valid office number");
                            }
                            return !isNaN(input);
                        }
                    }
                ]).then(function(response) {
                    if(employeeList.find(employee => employee.getRole() === "Manager" ) !== undefined) {
                        console.log("\x1b[31m", "******* You cannot add more than one manager on a team! *******");
                        promptConfirm();
                    }
                    else {
                        const manager = new Manager(newEmployee.name, newEmployee.id, newEmployee.email, response.officeNumber);
                        employeeList.push(manager);
                        promptConfirm();
                    }
                });
                break;      
        }
    });
}

// Confirms with the user whether or not they want to add another employee
function promptConfirm() {
    inquirer.prompt([
        {
            name: "addAnother",
            type: "confirm",
            message: "Would you like to add another employee?"
        }
    ]).then(function(response) {
        if(response.addAnother === true) {
            init();
        }
        else if(employeeList.find(employee => employee.getRole() === "Manager" ) == undefined) {
            console.log("\x1b[31m", "******* Please add a Manager to the team. *******");
            init();
        }
        else {
            fs.writeFile(outputPath, render(employeeList), err => {
                if(err) throw err;
            });
        }
    });
}

// Initialize the application
init();



// Write code to use inquirer to gather information about the development team members,
// and to create objects for each team member (using the correct classes as blueprints!)

// After the user has input all employees desired, call the `render` function (required
// above) and pass in an array containing all employee objects; the `render` function will
// generate and return a block of HTML including templated divs for each employee!

// After you have your html, you're now ready to create an HTML file using the HTML
// returned from the `render` function. Now write it to a file named `team.html` in the
// `output` folder. You can use the variable `outputPath` above target this location.
// Hint: you may need to check if the `output` folder exists and create it if it
// does not.

// HINT: each employee type (manager, engineer, or intern) has slightly different
// information; write your code to ask different questions via inquirer depending on
// employee type.

// HINT: make sure to build out your classes first! Remember that your Manager, Engineer,
// and Intern classes should all extend from a class named Employee; see the directions
// for further information. Be sure to test out each class and verify it generates an
// object with the correct structure and methods. This structure will be crucial in order
// for the provided `render` function to work! ```
