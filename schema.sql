

DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE Products (
    item_id INTEGER NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    -- Made it VARCHAR instead of Decimal so that the data gets imported as a string and the trailing zeros are perseved for the price.
    price VARCHAR (20) NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

-- UPDATE Products SET stock_quantity=555 WHERE item_id=3;
-- SELECT * FROM Products WHERE stock_quantity<1000;

SELECT * FROM Products