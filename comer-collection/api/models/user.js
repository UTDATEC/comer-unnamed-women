import { DataTypes } from "sequelize";

export default (db) => {
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
        email_without_domain: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.email?.substr(0, this.email?.lastIndexOf("@"))}`;
            }
        },
        family_name: {
            type: Sequelize.TEXT("tiny"),
            field: "user_family_name"
        },
        given_name: {
            type: Sequelize.TEXT("tiny"),
            field: "user_given_name"
        },
        full_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.given_name} ${this.family_name}`;
            }
        },
        full_name_reverse: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.family_name}, ${this.given_name}`;
            }
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.has_name ? `${this.full_name}` : `${this.email}`;
            }
        },
        has_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return Boolean(this.family_name || this.given_name);
            }
        },
        exhibition_quota: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 5,
            validate: {
                min: 0
            },
            field: "user_exhibition_quota"
        },
        pw_hash: {
            type: Sequelize.TEXT("tiny"),
            field: "user_pw_hash",
            defaultValue: null
        },
        has_password: {
            type: DataTypes.VIRTUAL,
            get() {
                return Boolean(this.pw_updated);
            }
        },
        pw_change_required: {
            type: Sequelize.BOOLEAN,
            field: "user_pw_change_required",
            allowNull: false,
            defaultValue: true
        },
        pw_updated: {
            type: Sequelize.DATE(3),
            field: "user_pw_last_updated",
            defaultValue: null
        },
        is_active: {
            type: Sequelize.BOOLEAN,
            field: "user_is_active",
            allowNull: false,
            defaultValue: true
        },
        is_admin: {
            type: Sequelize.BOOLEAN,
            field: "user_is_admin",
            allowNull: false,
            defaultValue: false
        }
    }, {
        tableName: "comer_users",
        defaultScope: {
            attributes: {
                exclude: ["pw_hash"]
            }
        }
    });

    return User;
};