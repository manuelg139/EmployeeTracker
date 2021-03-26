DROP DATABASE IF EXISTS employeeTracker_DB;
CREATE database  employeeTracker_DB;

USE  employeeTracker_DB;

CREATE TABLE departments (
 id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NULL,
  PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(80),
    salary DECIMAL (10,4) NULL,
    department_id INT NULL,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_title VARCHAR(80) NOT NULL,
    manager  VARCHAR(50) INT NULL,
    PRIMARY KEY (id)
);

