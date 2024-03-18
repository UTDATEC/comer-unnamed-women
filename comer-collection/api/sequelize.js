// Initialize sequelize
const Sequelize = require("sequelize");

//import cCert from 'raw-loadeer!ls /Users/dwm160130/Library/Application\ Support/MySQL/Workbench/certificates/5B407BCB-CA91-49DD-8A10-9C2B437C6A75/client-key.pem';
//import cKey from 'raw-loadeer!ls /Users/dwm160130/Library/Application\ Support/MySQL/Workbench/certificates/5B407BCB-CA91-49DD-8A10-9C2B437C6A75/client-key.pem';

const { DB_HOST, DB_PORT, DB_SCHEMA, DB_USER, DB_PASSWORD } = process.env;

// Authentication object for querying from database
const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PASSWORD, {
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

// Images with artists can be deleted, but artists with images cannot be deleted
db.Artist.belongsToMany(db.Image, { through: "comer_image_credits", foreignKey: "artist_id", onDelete: 'RESTRICT' });
db.Image.belongsToMany(db.Artist, { through: "comer_image_credits", foreignKey: "image_id", onDelete: 'CASCADE' });

// Images with tags can be deleted, but tags with images cannot be deleted
db.Tag.belongsToMany(db.Image, { through: "comer_image_tag_assignments", foreignKey: "tag_id", onDelete: 'RESTRICT' });
db.Image.belongsToMany(db.Tag, { through: "comer_image_tag_assignments", foreignKey: "image_id", onDelete: 'CASCADE' });

// Users with courses cannot be deleted, and courses with users cannot be deleted
db.User.belongsToMany(db.Course, { through: "comer_enrollments", foreignKey: "user_id", onDelete: 'RESTRICT' });
db.Course.belongsToMany(db.User, { through: "comer_enrollments", foreignKey: "course_id", onDelete: 'RESTRICT' });

// Exhibitions can be deleted (with no effect on the owner), but users with exhibitions cannot be deleted
db.User.hasMany(db.Exhibition, { foreignKey: 'exhibition_owner', onDelete: 'RESTRICT' })
db.Exhibition.belongsTo(db.User, { foreignKey: 'exhibition_owner', inverse: { as: 'exhibitions', type: 'hasMany' } });

// Exhibitions with images can be deleted, but images with exhibitions cannot be deleted
db.Exhibition.belongsToMany(db.Image, { through: "comer_image_appearances", foreignKey: "exhibition_id", onDelete: 'CASCADE' });
db.Image.belongsToMany(db.Exhibition, { through: "comer_image_appearances", foreignKey: "image_id", onDelete: 'RESTRICT' });


module.exports = db;