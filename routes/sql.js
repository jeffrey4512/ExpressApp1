module.exports = {
    getUser: 'SELECT * FROM users WHERE email = ?',
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
    getSales: 'SELECT SUM(totalcost) as totalEarnings, sum(totalQty) as totalSale FROM('
        + ' SELECT SUM(oi.quantity) as totalQty, SUM(price * oi.quantity) AS totalcost FROM order_items oi'
        + ' INNER JOIN orders o ON o.id = oi.order_id'
        + ' INNER JOIN products p ON p.id = oi.product_id  '
        + ' WHERE order_date >= ? AND order_date < (LAST_DAY(CURDATE()) + INTERVAL 1 DAY)'
        + ' GROUP BY oi.product_id) AS T;',
    getChartSales: 'WITH recursive MonthRange AS (SELECT DATE_FORMAT(NOW() ,"%Y-%01-01") AS Months UNION ALL SELECT Months + interval 1 MONTH FROM MonthRange'
        + ' WHERE Months < DATE_FORMAT(NOW() ,"%Y-%12-01"))'
        + ' SELECT   (monthname(Months))  as Months, COALESCE (SUM(oi.quantity),0) AS Monthlyqty, COALESCE (ROUND(SUM(price * oi.quantity),2),0)  AS MonthlySale FROM MonthRange'
        + ' LEFT JOIN orders o ON monthname(o.order_date) = monthname(Months)'
        + ' LEFT JOIN order_items oi ON o.id = oi.order_id'
        + ' LEFT JOIN products p ON p.id = oi.product_id '
        + ' AND YEAR(o.order_date) = YEAR(current_date()) '
        + ' GROUP BY monthname(Months) '
        + ' ORDER BY Month(Months);',
    getBookmarks: 'SELECT p.name,p.price,p.summary from products p'
    + ' INNER JOIN bookmark bm ON bm.product_id = p.id'
    + ' INNER JOIN users u ON u.id = bm.user_id',
    getReviews: 'SELECT p.name,pr.title,pr.content,pr.rating,pr.created_at FROM product_reviews pr'
    + ' INNER JOIN products p ON pr.product_id = p.id'
    + ' where user_id  = (SELECT id FROM users WHERE email = ?);'

}; 

