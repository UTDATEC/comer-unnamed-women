const { db } = require('../api/sequelize');
//const db = require('../api/sequelize');
console.log(`${sequelize.db}`);
    
    
    var connection = sequelize.connection
    connection.query ('select * from comerCollection2s limit 1', function(error, results) {
        if (results) {
            console.log(results);
        } else {
            console.log(error);
        }
    });