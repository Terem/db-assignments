'use strict';

/********************************************************************************************
 *                                                                                          *
 * The goal of the task is to get basic knowledge of SQL functions and                      *
 * approaches to work with data in SQL.                                                     *
 * https://dev.mysql.com/doc/refman/5.7/en/function-reference.html                          *
 *                                                                                          *
 * The course do not includes basic syntax explanations. If you see the SQL first time,     *
 * you can find explanation and some trainings at W3S                                       *
 * https://www.w3schools.com/sql/sql_syntax.asp                                             *
 *                                                                                          *
 ********************************************************************************************/


/**
 *  Create a SQL query to return next data ordered by city and then by name:
 * | Employy Id | Employee Full Name | Title | City |
 *
 * @return {array}
 *
 */
async function task_1_1(db) {
    // The first task is example, please follow the style in the next functions.
    let result = await db.query(`
        SELECT
           EmployeeID as "Employee Id",
           CONCAT(FirstName, ' ', LastName) AS "Employee Full Name",
           Title as "Title",
           City as "City"
        FROM Employees
        ORDER BY City, "Employee Full Name"
    `);
    return result[0];
}

/**
 *  Create a query to return an Order list ordered by order id descending:
 * | Order Id | Order Total Price | Total Order Discount, % |
 *
 * NOTES: Discount in OrderDetails is a discount($) per Unit.
 * @return {array}
 *
 */
async function task_1_2(db) {
    let result = await db.query(`
        SELECT
            OrderID as "Order Id",
            SUM(UnitPrice * Quantity) as "Order Total Price",
            ROUND(SUM(Discount * Quantity) * 100 / SUM(UnitPrice * Quantity), 3) as "Total Order Discount, %"
        FROM OrderDetails
            GROUP BY OrderID
            ORDER BY OrderID DESC
    `);
    return result[0];
}

/**
 *  Create a query to return all customers from USA without Fax:
 * | CustomerId | CompanyName |
 *
 * @return {array}
 *
 */
async function task_1_3(db) {
    let result = await db.query(`
        SELECT
           CustomerID as "CustomerId",
           CompanyName as "CompanyName"
        FROM Customers
        WHERE Country = "USA" And Fax is Null
    `);
    return result[0];
}

/**
 * Create a query to return:
 * | Customer Id | Total number of Orders | % of all orders |
 *
 * order data by % - higher percent at the top, then by CustomerID asc
 *
 * @return {array}
 *
 */
async function task_1_4(db) {
    let result = await db.query(`
        SELECT 
	        CustomerID as 'Customer Id',
            COUNT( OrderID) as "Total number of Orders",
            ROUND((count(OrderID)/ (SELECT COUNT(DISTINCT OrderID) FROM Orders ))*1000/10 , 5) as '% of all orders'
        from Orders    
        GROUP BY CustomerID
        order by 3 desc, CustomerId 

    `);
    return result[0];
}

/**
 * Return all products where product name starts with 'A', 'B', .... 'F' ordered by name.
 * | ProductId | ProductName | QuantityPerUnit |
 *
 * @return {array}
 *
 */
async function task_1_5(db) {
    let result = await db.query(`
         SELECT
            ProductID as "ProductId",
            ProductName,
            QuantityPerUnit
         FROM Products
         WHERE ProductName >= 'A' and ProductName <= 'G'
         ORDER BY 
            ProductName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all products with category and supplier company names:
 * | ProductName | CategoryName | SupplierCompanyName |
 *
 * Order by ProductName then by SupplierCompanyName
 * @return {array}
 *
 */
async function task_1_6(db) {
    let result = await db.query(`
        SELECT ProductName, CategoryName, CompanyName as 'SupplierCompanyName'
        FROM Products 
        JOIN Categories on Products.CategoryID = Categories.CategoryID
        JOIN Suppliers on Products.SupplierID = Suppliers.SupplierID
        ORDER BY ProductName, CompanyName
    `);
    return result[0];
}

/**
 *
 * Create a query to return all employees and full name of person to whom this employee reports to:
 * | EmployeeId | FullName | ReportsTo |
 *
 * Order data by EmployeeId.
 * Reports To - Full name. If the employee does not report to anybody leave "-" in the column.
 * @return {array}
 *
 */
async function task_1_7(db) {
    let result = await db.query(`
        SELECT  e.EmployeeID as 'EmployeeId', concat(e.FirstName, ' ', e.LastName) as 'FullName',
        IF(e.ReportsTo is null, "-", concat(r.FirstName, ' ', r.LastName)) as 'ReportsTo'
        FROM Employees e 
        LEFT JOIN Employees r  on e.ReportsTo = r.EmployeeID 
    `);
    return result[0];
}

/**
 *
 * Create a query to return:
 * | CategoryName | TotalNumberOfProducts |
 *
 * @return {array}
 *
 */
async function task_1_8(db) {
    let result = await db.query(`
        SELECT CategoryName,  count(ProductName) as 'TotalNumberOfProducts'
        FROM Categories 
        JOIN Products on Categories.CategoryID = Products.CategoryID
        GROUP BY CategoryName
        ORDER BY CategoryName
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find those customers whose contact name containing the 1st character is 'F' and the 4th character is 'n' and rests may be any character.
 * | CustomerID | ContactName |
 *
 * @return {array}
 *
 */
async function task_1_9(db) {
    let result = await db.query(`
        SELECT CustomerID, ContactName  
        FROM Customers
        WHERE ContactName like 'F__n%'
    `);
    return result[0];
}

/**
 * Write a query to get discontinued Product list:
 * | ProductID | ProductName |
 *
 * @return {array}
 *
 */
async function task_1_10(db) {
    let result = await db.query(`
        SELECT ProductID, ProductName  
        FROM Products
        WHERE Discontinued = 1
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list (name, unit price) where products cost between $5 and $15:
 * | ProductName | UnitPrice |
 *
 * Order by UnitPrice then by ProductName
 *
 * @return {array}
 *
 */
async function task_1_11(db) {
    let result = await db.query(`
        SELECT ProductName, UnitPrice  
        FROM Products
        WHERE UnitPrice >= 5 and UnitPrice <= 15
        ORDER BY UnitPrice, ProductName
    `);
    return result[0];
}
/**
 * Write a SQL query to get Product list of twenty most expensive products:
 * | ProductName | UnitPrice |
 *
 * Order products by price then by ProductName.
 *
 * @return {array}
 *
 */
async function task_1_12(db) {
    let result = await db.query(`
        SELECT * FROM 
            (SELECT ProductName, UnitPrice 
            FROM Products
            order by UnitPrice desc
            limit 20) products20
        order by UnitPrice, ProductName 
    `);
    return result[0];
}

/**
 * Create a SQL query to count current and discontinued products:
 * | TotalOfCurrentProducts | TotalOfDiscontinuedProducts |
 *
 * @return {array}
 *
 */
async function task_1_13(db) {
    let result = await db.query(`
        SELECT count(ProductID) as 'TotalOfCurrentProducts', 
        sum(Discontinued) as 'TotalOfDiscontinuedProducts'
        FROM Products;
    `);
    return result[0];
}

/**
 * Create a SQL query to get Product list of stock is less than the quantity on order:
 * | ProductName | UnitsOnOrder| UnitsInStock |
 *
 * @return {array}
 *
 */
async function task_1_14(db) {
    let result = await db.query(`
        SELECT ProductName, UnitsOnOrder, UnitsInStock
        FROM Products
        where UnitsOnOrder>UnitsInStock
    `);
    return result[0];
}

/**
 * Create a SQL query to return the total number of orders for every month in 1997 year:
 * | January | February | March | April | May | June | July | August | September | November | December |
 *
 * @return {array}
 *
 */
async function task_1_15(db) {
    let result = await db.query(`
        SELECT
            COUNT(IF(MONTH(OrderDate) = 1, 1, NULL)) as "January",
            COUNT(IF(MONTH(OrderDate) = 2, 1, NULL)) as "February",
            COUNT(IF(MONTH(OrderDate) = 3, 1, NULL)) as "March",
            COUNT(IF(MONTH(OrderDate) = 4, 1, NULL)) as "April",
            COUNT(IF(MONTH(OrderDate) = 5, 1, NULL)) as "May",
            COUNT(IF(MONTH(OrderDate) = 6, 1, NULL)) as "June",
            COUNT(IF(MONTH(OrderDate) = 7, 1, NULL)) as "July",
            COUNT(IF(MONTH(OrderDate) = 8, 1, NULL)) as "August",
            COUNT(IF(MONTH(OrderDate) = 9, 1, NULL)) as "September",
            COUNT(IF(MONTH(OrderDate) = 10, 1, NULL)) as "October",
            COUNT(IF(MONTH(OrderDate) = 11, 1, NULL)) as "November",
            COUNT(IF(MONTH(OrderDate) = 12, 1, NULL)) as "December"
        FROM Orders
        WHERE Year(OrderDate) = 1997
    `);
    return result[0];
}

/**
 * Create a SQL query to return all orders where ship postal code is provided:
 * | OrderID | CustomerID | ShipCountry |
 *
 * @return {array}
 *
 */
async function task_1_16(db) {
    let result = await db.query(`
        SELECT OrderID, CustomerID, ShipCountry 
        FROM Orders
        WHERE ShipPostalCode is not null
    `);
    return result[0];
}

/**
 * Create SQL query to display the average price of each categories's products:
 * | CategoryName | AvgPrice |
 *
 * @return {array}
 *
 * Order by AvgPrice descending then by CategoryName
 *
 */
async function task_1_17(db) {
    let result = await db.query(`
        SELECT CategoryName, avg(UnitPrice) as AvgPrice 
        FROM Categories
        JOIN Products on Categories.CategoryID = Products.CategoryID
        group by CategoryName
        order by AvgPrice desc, CategoryName
    `);
    return result[0];
}
/**
 * Create a SQL query to calcualte total orders count by each day in 1998:
 * | OrderDate | Total Number of Orders |
 *
 * OrderDate needs to be in the format '%Y-%m-%d %T'
 * @return {array}
 *
 */
async function task_1_18(db) {
    let result = await db.query(`
        SELECT DATE_FORMAT(OrderDate, "%Y-%m-%d %T") as "OrderDate",
            COUNT(OrderDate) as "Total Number of Orders"
        FROM Orders
        WHERE Year(OrderDate) = 1998
        GROUP BY OrderDate
    `);
    return result[0];
}

/**
 * Create a SQL query to display customer details whose total orders amount is more than 10000$:
 * | CustomerID | CompanyName | TotalOrdersAmount, $ |
 *
 * Order by "TotalOrdersAmount, $" descending then by CustomerID
 * @return {array}
 *
 */
async function task_1_19(db) {
    let result = await db.query(`
        SELECT  Customers.CustomerID, CompanyName,
        sum(UnitPrice * Quantity) as 'TotalOrdersAmount, $'
        FROM Customers
        join Orders on Customers.CustomerID = Orders.CustomerID
        join Orderdetails on Orders.OrderID = Orderdetails.OrderID
        group by CustomerID
        having sum(UnitPrice*Quantity) > 10000
        order by 3 desc, 1
    `);
    return result[0];
}

/**
 *
 * Create a SQL query to find the employee that sold products for the largest amount:
 * | EmployeeID | Employee Full Name | Amount, $ |
 *
 * @return {array}
 *
 */
async function task_1_20(db) {
    let result = await db.query(`
        SELECT Employees.EmployeeID,  CONCAT(FirstName, " ", LastName) as "Employee Full Name", 
        sum(UnitPrice * Quantity) as 'Amount, $'
        FROM Employees
        join Orders on Employees.EmployeeID = Orders.EmployeeID
        join Orderdetails on Orderdetails.OrderID = Orders.OrderID
        group by EmployeeID
        order by 3 desc
        limit 1
    `);
    return result[0];
}

/**
 * Write a SQL statement to get the maximum purchase amount of all the orders.
 * | OrderID | Maximum Purchase Amount, $ |
 *
 * @return {array}
 */
async function task_1_21(db) {
    let result = await db.query(`
        SELECT OrderID, sum(UnitPrice * Quantity) as 'Maximum Purchase Amount, $'
        FROM Orderdetails
        group by OrderID
        order by 2 desc
        limit 1
    `);
    return result[0];
}


/**
 * Create a SQL query to display the name of each customer along with their most expensive purchased product:
 * | CompanyName | ProductName | PricePerItem |
 *
 * order by PricePerItem descending and them by CompanyName and ProductName acceding
 * @return {array}
 */
async function task_1_22(db) {
    let result = await db.query(`
        SELECT  distinct Customers.CompanyName, Products.ProductName, Orderdetails.UnitPrice as 'PricePerItem'
        FROM Customers 
        join Orders on Customers.CustomerID = Orders.CustomerID
        join Orderdetails on Orders.OrderID = Orderdetails.OrderID
        join Products on Orderdetails.ProductID = Products.ProductID
        where Orderdetails.UnitPrice = (
            SELECT max(Orderdetails.UnitPrice)
            FROM Customers c1
            join Orders on Customers.CustomerID = Orders.CustomerID
            join Orderdetails on Orders.OrderID = Orderdetails.OrderID
            where c1.CompanyName = Customers.CompanyName
        )
        order by 3 desc, Customers.CompanyName,  Products.ProductName
    `);
    return result[0];
}

module.exports = {
    task_1_1: task_1_1,
    task_1_2: task_1_2,
    task_1_3: task_1_3,
    task_1_4: task_1_4,
    task_1_5: task_1_5,
    task_1_6: task_1_6,
    task_1_7: task_1_7,
    task_1_8: task_1_8,
    task_1_9: task_1_9,
    task_1_10: task_1_10,
    task_1_11: task_1_11,
    task_1_12: task_1_12,
    task_1_13: task_1_13,
    task_1_14: task_1_14,
    task_1_15: task_1_15,
    task_1_16: task_1_16,
    task_1_17: task_1_17,
    task_1_18: task_1_18,
    task_1_19: task_1_19,
    task_1_20: task_1_20,
    task_1_21: task_1_21,
    task_1_22: task_1_22
};
