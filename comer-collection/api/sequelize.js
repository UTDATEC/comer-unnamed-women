// Initialize sequelize
const Sequelize = require("sequelize");
const fs = require('node:fs');

// Replace these (database name, username, password_) with whatever credentials and replace the host with the correct host
/*const sequelize = new Sequelize('comerDb','root','MyNewPass', { 
    dialect: 'mysql',
    host:'localhost'

});*/
//import cCert from 'raw-loadeer!ls /Users/dwm160130/Library/Application\ Support/MySQL/Workbench/certificates/5B407BCB-CA91-49DD-8A10-9C2B437C6A75/client-key.pem';
//import cKey from 'raw-loadeer!ls /Users/dwm160130/Library/Application\ Support/MySQL/Workbench/certificates/5B407BCB-CA91-49DD-8A10-9C2B437C6A75/client-key.pem';
const sequelize = new Sequelize('atc_sandbox','atc_sandbox_app','ATECInfrastructur3!', {
        //const sequelize = new Sequelize('atc_sandbox','yourname','yourpassword', {
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // <<<<<<< YOU NEED THIS
              
            }
          },
        host: 'oitdbaatect.utdallas.edu',
        port: '2445',
}
);
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
    process.exit();
 });
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.image = require("./models/image.js")(sequelize, Sequelize);
module.exports = db;