module.exports = (db) => {
    const { sequelize, Sequelize } = db;
    const Image = sequelize.define("Image", {
        id: {
            type: Sequelize.INTEGER,
            autoIncrement: true,
            initialAutoIncrement: 1,
            primaryKey: true,
            field: "image_id"
        },
        accessionNumber: {
            type: Sequelize.TEXT('tiny'),
            field: "image_acc_no"
        },
        title: {
            type: Sequelize.TEXT('tiny'),
            allowNull: false,
            field: "image_title"
        },
        year: {
            type: Sequelize.INTEGER,
            field: "image_year"
        },
        additionalPrintYear: {
            type: Sequelize.INTEGER,
            field: "image_addl_print_year"
        },
        medium: {
            type: Sequelize.TEXT('tiny'),
            field: "image_medium"
        },
        width: {
            type: Sequelize.DECIMAL(7, 4),
            allowNull: false,
            field: "image_width"
        },
        height: {
            type: Sequelize.DECIMAL(7, 4),
            allowNull: false,
            field: "image_height"
        },
        matWidth: {
            type: Sequelize.DECIMAL(7, 4),
            field: "image_mat_width"
        },
        matHeight: {
            type: Sequelize.DECIMAL(7, 4),
            field: "image_mat_height"
        },
        edition: {
            type: Sequelize.TEXT('tiny'),
            field: "image_edition"
        },
        condition: {
            type: Sequelize.TEXT('tiny'),
            field: "image_condition"
        },
        valuationNotes: {
            type: Sequelize.TEXT('tiny'),
            field: "image_valuation"
        },
        otherNotes: {
            type: Sequelize.TEXT('medium'),
            field: "image_notes_other"
        },
        copyright: {
            type: Sequelize.TEXT('tiny'),
            field: "image_copyright"
        },
        subject: {
            type: Sequelize.TEXT('tiny'),
            field: "image_subject"
        },
        url: {
            type: Sequelize.TEXT('tiny'),
            field: "image_url"
        },
        location: {
            type: Sequelize.TEXT('tiny'),
            field: "image_location"
        }
    }, {
        tableName: "comer_images"
    });

    return Image;
}