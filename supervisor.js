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

function validateNumber(name) {
    if (isNaN(name) == false && name >= 0) {
        return true;
    } else {
        return false, "Enter a proper value";
    }
};

function validateName(name) {
    if (isNaN(name) == true) {
        return true;
    } else {
        return false, "Enter a proper name";
    }
};

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
    var q = "SELECT d.department_id, d.department_name, SUM(d.over_head_costs) AS over_head_costs, SUM(p.product_sales) AS product_sales FROM Departments d LEFT JOIN Products p ON d.department_name = p.department_name GROUP BY d.department_name ORDER BY department_id ASC"
    connection.query(q, function (err, res) {
        if (err) throw (err);
        var table = new Table({
            head: ['ID', 'Department Name', 'Overhead Costs', 'Product Sales', 'Total Profit'],
            colWidths: [5, 17, 17, 17, 17]
        });
        for (var i = 0; i < res.length; i++) {
            var departmentID = res[i].department_id;
            var departmentName = res[i].department_name;
            var overHeadCosts = parseFloat(res[i].over_head_costs).toFixed(2);
            var productSales;
            if (res[i].product_sales === null) {
                productSales = 0.00;
            } else {
                productSales = parseFloat(res[i].product_sales);
            }
            var totalProfit = parseFloat(productSales) - parseFloat(overHeadCosts);
            table.push([departmentID, departmentName, "$" + overHeadCosts, "$" + productSales.toFixed(2), "$" + totalProfit.toFixed(2)])
        }
        console.log(table.toString());
        supervisorPrompt();
    })
};

function newDepartment() {
    inquirer.prompt([{
        type: "input",
        name: "departmentName",
        message: "Enter Department's Name [Enter Q to Quit]",
        validate: validateName
    }]).then(function (input) {
        var departmentName = input.departmentName;
        departmentName = departmentName.charAt(0).toUpperCase() + departmentName.slice(1);
        if (input.departmentName.toUpperCase() == "Q") {
            console.log("");
            console.log("");
            // Return stops the function from going further and prompting the next questions and resets back to the start.
            return supervisorPrompt();
        }
        inquirer.prompt([{
            type: "input",
            name: "overHeadCosts",
            message: "Enter Department's Overhead Costs",
            validate: validateNumber
        }, ]).then(function (input) {
            var overHeadCosts = input.overHeadCosts;
            connection.query("INSERT INTO Departments SET ?", [{
                department_name: departmentName,
                over_head_costs: overHeadCosts,
            }], function (err) {
                if (err) throw (err);
                console.log("")
                console.log("----------Department successfully added!----------")
                console.log("")
                supervisorPrompt();
            })
        });
    })
};