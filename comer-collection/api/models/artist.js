const { DataTypes } = require("sequelize");

module.exports = (db) => {
    const { sequelize, Sequelize } = db;
    const Artist = sequelize.define("Artist", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "artist_id"
        },
        familyName: {
            type: Sequelize.TEXT('tiny'),
            allowNull: false,
            field: "artist_familyname"
        },
        givenName: {
            type: Sequelize.TEXT('tiny'),
            allowNull: false,
            field: "artist_givenname"
        },
        fullName: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.givenName} ${this.familyName}`;
            }
        },
        fullNameReverse: {
            type: DataTypes.VIRTUAL,
            get() {
                return `${this.familyName}, ${this.givenName}`;
            }
        },
        website: {
            type: Sequelize.TEXT('tiny'),
            field: "artist_website"
        },
        notes: {
            type: Sequelize.TEXT('tiny'),
            field: "artist_notes"
        },
        safe_display_name: {
            type: DataTypes.VIRTUAL,
            get() {
                return (this.familyName || this.givenName) ? `${this.fullName}` : `Artist ${this.id}`
            }
        }
    }, {
        tableName: "comer_artists"
    });

    return Artist;
};
