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
    createTable();
});

function validateNumber(name) {
    if (isNaN(name) == false && name >= 0) {
        return true;
    } else {
        return false, "Enter a proper value";
    }
};

function createTable() {
    connection.query("SELECT * FROM Products", function (err, res) {
        if (err) throw (err);
        // npm install cli-table instructions below:
        var table = new Table({
            head: ['ID', 'Product Name', 'Price'],
            colWidths: [5, 30, 10]
        });
        for (i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, "$" + res[i].price.toFixed(2)]);
        }
        console.log(table.toString());
        customer(res);
    })
};

function customer(res) {
    inquirer.prompt([{
        type: "input",
        message: "What would you like to purchase? [Choose ID number] [If you would like to quit, enter Q]",
        name: "choice"
    }]).then(function (input) {
        if (input.choice.toUpperCase() == "Q") {
            process.exit();
        }
        var correct = false;
        for (var i = 0; i < res.length; i++) {
            if (res[i].item_id == input.choice) {
                correct = true;
                var userProduct = res[i].product_name;
                var stockQuantity = res[i].stock_quantity;
                var price = parseFloat(res[i].price).toFixed(2);
                var productSales = res[i].product_sales;
                var id = res[i].item_id;
                console.log("");
                console.log("You chose the " + userProduct + " product for $" + price + ".");
                console.log("");
                inquirer.prompt([{
                    type: "input",
                    message: "Howmany units of " + userProduct + " would you like to purchase?",
                    name: "units",
                    validate: validateNumber
                }]).then(function (input) {
                    var userAmount = input.units;
                    // To always show atleast 2 decimals.
                    price = (price * userAmount);
                    if (userAmount == 0) {
                        console.log("");
                        console.log("Unfortunate, see you next time!");
                        console.log("");
                        process.exit();
                    }
                    if (stockQuantity < userAmount) {
                        console.log("");
                        console.log("Sorry, we currently do not have enough quantity in stock.")
                        console.log("");
                        customer(res);
                    } else {
                        // Why do we do this method again?
                        connection.query("UPDATE Products SET ? WHERE ?", [{
                            stock_quantity: stockQuantity - userAmount,
                            product_sales: productSales + price
                        }, {
                            item_id: id
                        }], function (err) {
                            if (err) throw err;
                            console.log("");
                            console.log("You purchased " + userAmount + " " + userProduct + "'s");
                            console.log("Your total purchase price is: $" + price.toFixed(2));
                            console.log("Congrats!");
                            console.log("");
                            process.exit();
                        })
                    }
                })
            };
        };
        if (i == res.length && correct == false) {
            console.log("Not a Valid Entry, please choose from the table above.");
            customer(res);
        }
    })
};