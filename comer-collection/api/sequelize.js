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

// Authentication object for querying from database
const sequelize = new Sequelize('atc_sandbox','root','FireworkStand11!', {
        //const sequelize = new Sequelize('atc_sandbox','yourname','yourpassword', {
        dialect: 'mysql',
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false // <<<<<<< YOU NEED THIS
              
            }
          },
        host: 'localhost',
        port: '3306',
        define: {
            timestamps: false
        }
}
);
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
 }).catch((error) => {
    console.error('Unable to connect to the database: ', error);
    process.exit();
 });

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize
};

db.Artist = require("./models/artist.js")(db);
db.Image = require("./models/image.js")(db);
db.Tag = require("./models/tag.js")(db);
db.User = require(".models/user.js")(db);


db.Artist.belongsToMany(db.Image, { through: "comer_image_credits", foreignKey: "artist_id" });
db.Image.belongsToMany(db.Artist, { through: "comer_image_credits", foreignKey: "image_id" });

db.Tag.belongsToMany(db.Image, { through: "comer_image_tag_assignments", foreignKey: "tag_id"});
db.Image.belongsToMany(db.Tag, { through: "comer_image_tag_assignments", foreignKey: "image_id"});


module.exports = db;