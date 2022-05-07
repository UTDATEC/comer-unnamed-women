// Initialize sequelize
const Sequelize = require("sequelize");

// Replace these (database name, username, password_) with whatever credentials and replace the host with the correct host
const sequelize = new Sequelize('comerDb','root','MyNewPass', { 
    dialect: 'mysql',
    host:'localhost'

});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.image = require("./models/image.js")(sequelize, Sequelize);
module.exports = db;