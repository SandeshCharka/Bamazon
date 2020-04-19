require("dotenv").config();

var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require('cli-table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.MYSQL_SERVER_PASSWORD,
    database: "bamazonDB"

});

connection.connect(function (err) {
    if (err) throw (err);
    supervisorPrompt();
});

function supervisorPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "menuChoice",
        message: "Choose an option",
        choices: ['View Product Sales by Department', 'Create New Department', 'Quit']
    }]).then(function (input) {
        switch (input.menuChoice) {
            case "View Product Sales by Department":
                productSales();
                break;
            case "Create New Department":
                newDepartment();
                break;
            case "Quit":
                connection.end();
                break;
        }
    })
};

function productSales() {

}

function newDepartment() {

}