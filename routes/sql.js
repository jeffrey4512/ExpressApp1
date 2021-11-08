module.exports = {
    getUser: 'SELECT * FROM users WHERE email = ?;',
    closeUser: 'UPDATE users set status = "inactive" WHERE email = ?;',
    updateUser: 'UPDATE users set mobile = ? , address = ? , zipcode = ? , gender = ?  WHERE email = ?;',
    getOrderCount: 'SELECT * FROM orders WHERE user_id = (SELECT id FROM users WHERE email = ?);',
    getOrderDetails: ' SELECT o.id as order_id, p.id as product_id, p.name, oi.quantity, p.price FROM users u'
        + ' INNER JOIN orders o ON o.user_id = u.id'
        + ' INNER JOIN order_items oi ON oi.order_id = o.id'
        + ' INNER JOIN products p ON p.id = oi.product_id'
        + ' WHERE u.email = ?;',
    getUserCount: 'SELECT COUNT(*) AS userCount FROM users',
    getTotalSales: 'SELECT SUM(quantity) AS sales FROM order_items',
    getSales: 'SELECT COALESCE(ROUND(SUM(totalcost),2),0) AS totalEarnings, COALESCE(sum(totalQty),0) AS totalSale FROM('
        + ' SELECT SUM(oi.quantity) as totalQty, SUM(price * oi.quantity) AS totalcost FROM order_items oi'
        + ' INNER JOIN orders o ON o.id = oi.order_id'
        + ' INNER JOIN products p ON p.id = oi.product_id  '
        + ' WHERE order_date >= ? AND order_date < (LAST_DAY(CURDATE()) + INTERVAL 1 DAY)'
        + ' GROUP BY oi.product_id) AS T;',
    getChartSales: 'WITH recursive MonthRange AS(SELECT DATE_FORMAT(NOW(), "%Y-%01-01")'
        + ' AS Months UNION ALL SELECT Months + interval 1 MONTH FROM MonthRange'
        + ' WHERE Months < DATE_FORMAT(NOW(), "%Y-%12-01"))'
        + ' SELECT(monthname(Months)) as Months, COALESCE(SUM(oi.quantity), 0) AS Monthlyqty,'
        + ' COALESCE(ROUND(SUM(price * oi.quantity), 2), 0)  AS MonthlySale FROM MonthRange'
        + ' LEFT JOIN orders o ON monthname(o.order_date) = monthname(Months) AND year(o.order_date) = ?'
        + ' LEFT JOIN order_items oi ON o.id = oi.order_id'
        + ' LEFT JOIN products p ON p.id = oi.product_id' 
        + ' GROUP BY monthname(Months)'
        + ' ORDER BY Month(Months);',
    getBookmarks: 'SELECT p.name,p.price,p.summary,p.id AS product_id,u.id AS user_id from products p'
    + ' INNER JOIN bookmarks bm ON bm.product_id = p.id'
    + ' INNER JOIN users u ON u.id = bm.user_id WHERE bm.user_id = (SELECT id FROM users WHERE email = ?);',
    getReviews: 'SELECT p.name,pr.title,pr.content,pr.rating,pr.created_at FROM product_reviews pr'
    + ' INNER JOIN products p ON pr.product_id = p.id'
        + ' where user_id  = (SELECT id FROM users WHERE email = ?);',
    getProductReviews: 'SELECT p.name,pr.title,pr.content,pr.rating,pr.created_at FROM product_reviews pr'
        + ' INNER JOIN products p ON pr.product_id = p.id'
        + ' where pr.product_id  =?;',
    addUser: 'INSERT INTO users(name, email, password, admin_privilege, status) VALUES(?,?,?,0,"active")',
    getUsersList: 'SELECT u.name,u.email,u.mobile,u.gender,u.status,u.created_at, COUNT(o.user_id) as count_order FROM users u'
        + ' LEFT JOIN orders o ON u.id = o.user_id'
        + ' GROUP BY u.name;',
    getProductReport: 'SELECT T.product_id, p.name, p.price, p.quantity AS stock_available, sum(oi.quantity) as quantity_sold, ROUND(sumOfRating / countPrdID) AS avg_rating, p.created_at, p.updated_at  FROM('
        + ' SELECT sum(rating) AS sumOfRating, COUNT(product_id) AS countPrdID, pr.product_id from product_reviews pr'
        + ' GROUP BY pr.product_id) AS T'
        + ' INNER JOIN products p ON p.id = T.product_id'
        + ' INNER JOIN order_items oi ON oi.product_id = p.id'
        + ' WHERE oi.created_at >= ? AND oi.created_at <= ? '
        + ' GROUP BY oi.product_id ORDER BY ??;', 
    addProduct: "INSERT INTO products(name,category,summary,price,quantity,image) VALUES(?,?,?,?,?,?);",
    getProductName: "SELECT name FROM products;",
    getProductDetails: "SELECT * FROM products WHERE name = ? ;",
    getProductDetailsByID: "SELECT * FROM products WHERE id = ? ;",
    updateProductDetails: "UPDATE products SET summary = ?, price=?, quantity =?, image = ?, updated_at = NOW() WHERE name = ?",
    deleteProduct: "DELETE FROM products where name = ?;",
    deleteBookmark: "DELETE FROM bookmarks WHERE product_id = ? AND user_id = (SELECT id FROM users WHERE email = ?)",
    getCartitems: 'SELECT  ci.id AS cartitemID ,ci.cart_id, p.name,p.category,ci.quantity,p.price,p.image FROM carts c '
        + ' INNER JOIN cart_items ci ON c.id = ci.cart_id'
        + ' INNER JOIN products p ON p.id = ci.product_id'
        + ' WHERE user_id = (SELECT id FROM users WHERE email = ?);',
    getCartDetails: 'SELECT SUM(ci.quantity * p.price)  AS totalPrice, COUNT(*) AS cartTotal FROM carts c '
        + ' INNER JOIN cart_items ci ON c.id = ci.cart_id'
        + ' INNER JOIN products p ON p.id = ci.product_id'
        + ' WHERE user_id = (SELECT id FROM users WHERE email = ?);',
    getCartID: 'SELECT id FROM carts where user_id =  (SELECT id FROM users WHERE email = ?);',
    delCartItem: "DELETE FROM cart_items WHERE id = ?;"
};


