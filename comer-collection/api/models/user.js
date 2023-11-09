module.exports = (db) => {
    const { sequelize, Sequelize } = db;
    const User = sequelize.define("User", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "user_id"
        },
        email: {
            type: Sequelize.STRING(255),
            allowNull: false,
            unique: true,
            field: "user_email"
        },
        family_name: {
            type: Sequelize.TEXT('tiny'),
            field: "user_family_name"
        },
        given_name: {
            type: Sequelize.TEXT('tiny'),
            field: "user_given_name"
        },
        pw_hash: {
            type: Sequelize.TEXT('tiny'),
            field: "user_pw_hash"
        },
        pw_temp: {
            type: Sequelize.TEXT('tiny'),
            field: "user_pw_temp"
        },
        pw_updated: {
            type: Sequelize.DATE(3),
            field: "user_pw_last_updated"
        },
        is_admin: {
            type: Sequelize.BOOLEAN,
            field: "user_is_admin",
            allowNull: false
        }
    }, {
        tableName: "comer_users"
    });

    return User;
}