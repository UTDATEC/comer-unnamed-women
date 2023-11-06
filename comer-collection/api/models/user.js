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
            type: Sequelize.TEXT('tiny'),
            allowNull: false,
            field: "user_email"
        },
        pw_hash: {
            type: Sequelize.TEXT('tiny'),
            field: "user_pw_hash"
        },
        pw_temp: {
            type: Sequelize.TEXT('tiny'),
            field: "user_pw_temp"
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