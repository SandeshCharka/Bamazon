# Bamazon

## What and Why?

Bamazon is a command line node app. Has 3 different user based functionalities.
* **Customer**
    - Allows the user to view and purchase products.
* **Manager**
    - Allows the user to view, update, add products as well as viewing product-sales.
* **Supervisor**
    - Allows the user to view, add departments, as well as viewing department costs and profits.

## Overview

### Click the image below for a Demo of the project

<a href="https://www.screencast.com/t/aS68HGCV00" target="_blank">
  <img alt="Bamazon Demo Video" src="images\Demo Image.png" width="" height="" />
</a>

## Local Setup

**Step 1 - Clone my repo using the command line below.**
```
git clone https://github.com/SandeshCharka/Bamazon.git
```
**Step 2 - Change directory to the cloned repo folder.**
```
cd Bamazon
```
**Step 3 - Install all required NPM packages.**
```
npm install
```
**Step 4 - Set up mySQL database.**
```
Bamazon
│
├── customer.js
│   -Edit the customer.js file to fit your database setup. 
│
├── manager.js
│   -Edit the manager.js file to fit your database setup. 
│
├── supervisor.js
│   -Edit the supervisor.js file to fit your database setup.
│
├── schema.sql
│    -Run the schema.sql file in mySQL.
│
├──departments.csv
│   -Import the departments data into the departments table.
│
└──products.csv
    -Import the products data into the products table.
```
**Step 5 - Start the application server using the any of the command lines below**
```
node customer.js

node manager.js

node supervisor.js
```

## Technologies Used

* Node JS
* Javascript
* Dotenv
* MySQL
* NPM Packages:
    - mysql
    - inquirer
    - cli-table

## Role in development

Sole developer of application.
