import { DataTypes } from "sequelize";

export default (db) => {
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
            type: Sequelize.TEXT("tiny"),
            allowNull: false,
            field: "tag_data"
        },
        notes: {
            type: Sequelize.TEXT("tiny"),
            field: "tag_notes"
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return (this.data != "" ? this.data : `Tag ${this.id}`);
            }
        }
    }, {
        tableName: "comer_image_tags"
    });

    return Tag;
};