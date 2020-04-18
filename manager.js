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
    console.log("Connection Successful");
    managerPrompt();
});

function managerPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "menuChoice",
        message: "Choose an option",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }]).then(function (input) {
        switch (input.menuChoice) {
            case "View Products for Sale":
                productsForSale();
                break;
            case "View Low Inventory":
                lowInventory();
                break;
            case "Add to Inventory":
                addInventory();
                break;
            case "Add New Product":
                addProduct();
                break;

        }
    })
};

function productsForSale() {
    connection.query("SELECT * FROM Products", function (err, res) {
        if (err) throw (err);
        var table = new Table({
            head: ['ID', 'Product Name', 'Deparment', 'Price', 'In stock'],
            colWidths: [5, 30, 20, 10, 10]
        });
        for (i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, res[i].stock_quantity]);
        }
        console.log(table.toString());
        connection.end();
    })
};

function lowInventory() {
    // [{stock_quantity: <1000}], How to make this method work?
    connection.query("SELECT * FROM Products WHERE stock_quantity<1000", function (err, res) {
        if (err) throw (err);
        var table = new Table({
            head: ['ID', 'Product Name', 'Deparment', 'Price', 'In stock', 'Low Inventory'],
            colWidths: [5, 30, 20, 10, 10, 15]
        });
        for (i = 0; i < res.length; i++) {
            // if (res[i].stock_quantity < 1005) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price, "  " + res[i].stock_quantity, "     ☑"]);
            // }
        }
        console.log(table.toString());
        connection.end();
    })
};

function addInventory() {
    connection.query("SELECT * FROM Products", function (err, res) {
        if (err) throw (err);
        inquirer.prompt([{
            type: "input",
            name: "addChoice",
            message: "What Product would you like to add? [Input Item-ID] [Enter Q, to Quit]",
        }]).then(function (input) {
            // This method works because of using process.exit() over connection.end();
            if (input.addChoice.toUpperCase() == "Q") {
                process.exit();
            }
            if (input.addChoice > res.length || input.addChoice <= 0 || isNaN(input.addChoice) == true) {
                console.log("Not a Valid Entry")
                addInventory();
            }
            for (i = 0; i < res.length; i++) {
                if (input.addChoice == res[i].item_id) {
                    var product = res[i].product_name;
                    var stockQuantity = res[i].stock_quantity;
                    var itemId = res[i].item_id;
                    inquirer.prompt([{
                        type: "input",
                        name: "addNumber",
                        message: "How many of the " + product + " product would you like to add?",
                        validate: function (input) {
                            if (isNaN(input) == false && input >= 0) {
                                return true;
                            } else {
                                return false;
                            }
                        }
                    }]).then(function (input) {
                        var addAmount = parseFloat(input.addNumber);
                        connection.query("UPDATE Products SET ? WHERE ?", [{
                            stock_quantity: stockQuantity + addAmount
                        }, {
                            item_id: itemId
                        }], function (err) {
                            if (err) throw err;
                            console.log("Inventory stock of product updated!")
                            connection.end();
                        })
                    })
                }
            }
        })
    });
};

function addProduct() {
    inquirer.prompt([{
            type: "input",
            name: "productName",
            message: "Enter Product's Name"
        }, {
            type: "input",
            name: "productDepartment",
            message: "Enter Product's Department"
        },
        {
            type: "input",
            name: "productPrice",
            message: "Enter Product's Price"
        }, {
            type: "input",
            name: "productStock",
            message: "Enter Product's Stock Quantity"
        }
    ])};

    // var departmentName = input.add;
    // var productName = input.add;