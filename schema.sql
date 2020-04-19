

DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE Products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales INT NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE Departments (
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT NOT NULL,
    PRIMARY KEY (department_id)
);

-- UPDATE Products SET stock_quantity=555 WHERE item_id=3;
-- SELECT * FROM Products WHERE stock_quantity<1000;
-- INSERT INTO Products (product_name, department_name, price, stock_quantity) VALUES ("test", "test2", 100, 35);

SELECT * FROM Products