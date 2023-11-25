module.exports = (db) => {
    const { sequelize, Sequelize } = db;
    const Tag = sequelize.define("Tag", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "tag_id"
        },
        data: {
            type: Sequelize.TEXT('tiny'),
            allowNull: false,
            field: "tag_data"
        },
        notes: {
            type: Sequelize.TEXT('tiny'),
            field: "tag_notes"
        }
    }, {
        tableName: "comer_image_tags"
    });

    return Tag;
}