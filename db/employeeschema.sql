
USE employeeTracker_DB;

/*We are creating the different departments, roles and employee examples for the tables */


/* ADDING DEPARTMENTS */
INSERT INTO departments (name)
VALUES 
("Engineering"), 
("Sales"), 
("Customer Service");

/* ADDING ROLES */
INSERT INTO role (title, salary, department_id)
VALUES 
("Software Engineer", 120000, 1),
("Sales Representative", 80000, 2),
("Customer Success Representative", 55000.00, 3);


/* ADDING EMPLOYEES */
INSERT INTO employee (first_name, last_name, role_title, manager)
VALUES 
("Manuel", "Gonzalez", "Software Engineer", "Natelie"),
("Adriana", "Romero", "Sales Representative", "Molly" ),
("Julian", "Perez", "Customer Success Representative", "Walter" )

