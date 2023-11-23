const { DataTypes } = require("sequelize");

module.exports = (db) => {
    const { sequelize, Sequelize } = db;
    const Course = sequelize.define("Course", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "course_id"
        },
        name: {
            type: Sequelize.TEXT('tiny'),
            allowNull: false,
            field: "course_name"
        },
        date_start: {
            type: Sequelize.DATE,
            field: "course_date_start",
            allowNull: false
        },
        date_end: {
            type: Sequelize.DATE,
            field: "course_date_end",
            allowNull: false
        },
        notes: {
            type: Sequelize.TEXT('tiny'),
            field: "course_notes"
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.name ? this.name : `Course ${this.id}`
            }
        }
    }, {
        tableName: "comer_courses"
    });

    return Course;
}