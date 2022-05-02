const Sequelize = require("sequelize");

const sequelize = new Sequelize('comerDb','root','MyNewPass', { 
    dialect: 'mysql',
    host:'localhost'

});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.image = require("./models/image.js")(sequelize, Sequelize);
module.exports = db;