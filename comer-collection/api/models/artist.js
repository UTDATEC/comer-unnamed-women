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
        website: {
            type: Sequelize.TEXT('tiny'),
            field: "artist_website"
        },
        notes: {
            type: Sequelize.TEXT('tiny'),
            field: "artist_notes"
        }
    }, {
        tableName: "comer_artists"
    });

    return Artist;
};
