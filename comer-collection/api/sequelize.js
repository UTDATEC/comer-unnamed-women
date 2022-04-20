


const Sequelize = require("sequelize");

const sequelize = new Sequelize('comerDb','root','MyNewPass', { 
    dialect: 'mysql',
    host:'localhost'

});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tutorials = require("./models/tutorial.js")(sequelize, Sequelize);
module.exports = db;