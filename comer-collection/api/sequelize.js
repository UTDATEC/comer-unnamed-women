// Initialize sequelize
import Sequelize from "sequelize";

const { DB_HOST, DB_PORT, DB_SCHEMA, DB_USER, DB_PASSWORD } = process.env;

// Authentication object for querying from database
const sequelize = new Sequelize(DB_SCHEMA, DB_USER, DB_PASSWORD, {
    dialect: "mysql",
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
    console.log("Connection has been established successfully.");
}).catch((error) => {
    console.error("Unable to connect to the database: ", error);
    process.exit();
});

const db = {
    Sequelize: Sequelize,
    sequelize: sequelize
};

import ArtistModel from "./models/artist.js";
import ImageModel from "./models/image.js";
import TagModel from "./models/tag.js";
import UserModel from "./models/user.js";
import CourseModel from "./models/course.js";
import ExhibitionModel from "./models/exhibition.js";

db.Artist = ArtistModel(db);
db.Image = ImageModel(db);
db.Tag = TagModel(db);
db.User = UserModel(db);
db.Course = CourseModel(db);
db.Exhibition = ExhibitionModel(db);

// Images with artists can be deleted, but artists with images cannot be deleted
db.Artist.belongsToMany(db.Image, { through: "comer_image_credits", foreignKey: "artist_id", onDelete: "RESTRICT" });
db.Image.belongsToMany(db.Artist, { through: "comer_image_credits", foreignKey: "image_id", onDelete: "CASCADE" });

// Images with tags can be deleted, but tags with images cannot be deleted
db.Tag.belongsToMany(db.Image, { through: "comer_image_tag_assignments", foreignKey: "tag_id", onDelete: "RESTRICT" });
db.Image.belongsToMany(db.Tag, { through: "comer_image_tag_assignments", foreignKey: "image_id", onDelete: "CASCADE" });

// Users with courses cannot be deleted, and courses with users cannot be deleted
db.User.belongsToMany(db.Course, { through: "comer_enrollments", foreignKey: "user_id", onDelete: "RESTRICT" });
db.Course.belongsToMany(db.User, { through: "comer_enrollments", foreignKey: "course_id", onDelete: "RESTRICT" });

// Exhibitions can be deleted (with no effect on the owner), but users with exhibitions cannot be deleted
db.User.hasMany(db.Exhibition, { foreignKey: "exhibition_owner", onDelete: "RESTRICT" });
db.Exhibition.belongsTo(db.User, { foreignKey: "exhibition_owner", inverse: { as: "exhibitions", type: "hasMany" } });

// Exhibitions with images can be deleted, but images with exhibitions cannot be deleted
db.Exhibition.belongsToMany(db.Image, { through: "comer_image_appearances", foreignKey: "exhibition_id", onDelete: "CASCADE" });
db.Image.belongsToMany(db.Exhibition, { through: "comer_image_appearances", foreignKey: "image_id", onDelete: "RESTRICT" });


export default db;