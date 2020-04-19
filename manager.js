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
    managerPrompt();
});

function managerPrompt() {
    inquirer.prompt([{
        type: "list",
        name: "menuChoice",
        message: "Choose an option",
        choices: ['View Products for Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product', 'Quit']
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
            case "Quit":
                connection.end();
                break;
        }
    })
};

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

function productsForSale() {
    connection.query("SELECT * FROM Products", function (err, res) {
        if (err) throw (err);
        var table = new Table({
            head: ['ID', 'Product Name', 'Deparment', 'Price', 'In stock'],
            colWidths: [5, 30, 20, 10, 10]
        });
        for (i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), res[i].stock_quantity]);
        }
        console.log(table.toString());
        managerPrompt();
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
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, "$" + res[i].price.toFixed(2), "  " + res[i].stock_quantity, "     ☑"]);
            // }
        }
        console.log(table.toString());
        managerPrompt();
    })
};

function addInventory() {
    connection.query("SELECT * FROM Products", function (err, res) {
        if (err) throw (err);
        inquirer.prompt([{
            type: "input",
            name: "addChoice",
            message: "What Product would you like to add? [Input Item-ID] [Enter Q, to Quit]",
            // Validate says that if the input is less than the res.length(amount of ID's on the database chart) and greater than 0 and isnt a string then the value is accepted as well as accepting Q inorder to implement the quit option.
            validate: function (name) {
                if (name < res.length && name > 0 && isNaN(name) == false || name.toUpperCase() == "Q") {
                    return true;
                } else {
                    return false, "Enter a proper item ID";
                }
            }
        }]).then(function (input) {
            if (input.addChoice.toUpperCase() == "Q") {
                console.log("");
                console.log("");
                managerPrompt();
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
                        validate: validateNumber
                    }]).then(function (input) {
                        var addAmount = parseFloat(input.addNumber);
                        connection.query("UPDATE Products SET ? WHERE ?", [{
                            stock_quantity: stockQuantity + addAmount
                        }, {
                            item_id: itemId
                        }], function (err) {
                            if (err) throw err;
                            console.log("")
                            console.log("----------Inventory stock of product updated!----------")
                            console.log("")
                            managerPrompt();
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
        message: "Enter Product's Name [Enter Q to Quit]",
        validate: validateName
    }]).then(function (input) {
        var productName = input.productName;
        if (input.productName.toUpperCase() == "Q") {
            console.log("");
            console.log("");
            // Return stops the function from going further and prompting the next questions and resets back to the start.
            return managerPrompt();
        }
        inquirer.prompt([{
                type: "input",
                name: "productDepartment",
                message: "Enter Product's Department",
                validate: validateName
            },
            {
                type: "input",
                name: "productPrice",
                message: "Enter Product's Price",
                validate: validateNumber
            },
            {
                type: "input",
                name: "productStock",
                message: "Enter Product's Stock Quantity",
                validate: validateNumber
            }
        ]).then(function (input) {
            var departmentName = input.productDepartment;
            var productPrice = input.productPrice;
            var stockQuantity = input.productStock;
            connection.query("INSERT INTO Products SET ?", [{
                product_name: productName,
                department_name: departmentName,
                price: productPrice,
                stock_quantity: stockQuantity
            }], function (err) {
                if (err) throw (err);
                console.log("")
                console.log("----------Product successfully added!----------")
                console.log("")
                managerPrompt();
            })
        });
    })
};