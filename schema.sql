
DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

DROP TABLE IF EXISTS Products;

CREATE TABLE Products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price DECIMAL (10,2) NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales DECIMAL (10,2) NOT NULL,
    PRIMARY KEY (item_id)
);

DROP TABLE IF EXISTS Departments;

CREATE TABLE Departments (
    department_id INTEGER NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs INT NOT NULL,
    PRIMARY KEY (department_id)
);

-- SELECT d.department_id, d.department_name, d.over_head_costs, p.product_sales
-- FROM Departments d
-- LEFT JOIN Products p
-- ON d.department_name = p.department_name
-- GROUP BY d.department_name ORDER BY department_id ASC;

SELECT d.department_id, d.department_name, SUM(d.over_head_costs) AS over_head_costs, SUM(p.product_sales) AS product_sales 
FROM Departments d 
LEFT JOIN Products p 
ON d.department_name = p.department_name 
GROUP BY d.department_name ORDER BY department_id ASC;

-- UPDATE Products SET stock_quantity=555 WHERE item_id=3;
-- SELECT * FROM Products WHERE stock_quantity<1000;
-- INSERT INTO Products (product_name, department_name, price, stock_quantity) VALUES ("test", "test2", 100, 35);
-- SELECT department_name FROM Departments GROUP BY department_name;

SELECT * FROM Products;
SELECT * FROM Departments;