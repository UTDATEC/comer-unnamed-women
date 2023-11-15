// Initialize sequelize
const Sequelize = require("sequelize");

//import cCert from 'raw-loadeer!ls /Users/dwm160130/Library/Application\ Support/MySQL/Workbench/certificates/5B407BCB-CA91-49DD-8A10-9C2B437C6A75/client-key.pem';
//import cKey from 'raw-loadeer!ls /Users/dwm160130/Library/Application\ Support/MySQL/Workbench/certificates/5B407BCB-CA91-49DD-8A10-9C2B437C6A75/client-key.pem';

const { DB_HOST, DB_PORT, DB_SCHEMA, DB_USER, DB_PASSWORD } = process.env;

// Authentication object for querying from database
const sequelize = new Sequelize(DB_SCHEMA,DB_USER, DB_PASSWORD, {
    dialect: 'mysql',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false // <<<<<<< YOU NEED THIS
        }
    },
    host: DB_HOST,
    port: DB_PORT,
    define: {
        timestamps: false
    }
});

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
db.User = require("./models/user.js")(db);
db.Course = require("./models/course.js")(db);
db.Exhibition = require("./models/exhibition.js")(db);


db.Artist.belongsToMany(db.Image, { through: "comer_image_credits", foreignKey: "artist_id" });
db.Image.belongsToMany(db.Artist, { through: "comer_image_credits", foreignKey: "image_id" });

db.Tag.belongsToMany(db.Image, { through: "comer_image_tag_assignments", foreignKey: "tag_id"});
db.Image.belongsToMany(db.Tag, { through: "comer_image_tag_assignments", foreignKey: "image_id"});

db.User.belongsToMany(db.Course, { through: "comer_enrollments", foreignKey: "user_id"});
db.Course.belongsToMany(db.User, { through: "comer_enrollments", foreignKey: "course_id"});

//db.User.hasMany(db.Exhibition, {foreignKey: 'exhibition_owner'})
db.Exhibition.belongsTo(db.User, {foreignKey: 'exhibition_owner', inverse: {as: 'exhibitions', type: 'hasMany'}});


module.exports = db;