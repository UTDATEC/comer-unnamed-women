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
            field: "image_year",
            set(value) {
                this.setDataValue('year', Boolean(value) ? value : null);
            }
        },
        additionalPrintYear: {
            type: Sequelize.INTEGER,
            field: "image_addl_print_year",
            set(value) {
                this.setDataValue('additionalPrintYear', Boolean(value) ? value : null);
            }
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
            field: "image_mat_width",
            set(value) {
                this.setDataValue('matWidth', Boolean(value) ? value : null);
            }
        },
        matHeight: {
            type: Sequelize.DECIMAL(7, 4),
            field: "image_mat_height",
            set(value) {
                this.setDataValue('matHeight', Boolean(value) ? value : null);
            }
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
        thumbnailUrl: {
            type: Sequelize.TEXT('tiny'),
            field: "image_thumbnail_url"
        },
        location: {
            type: Sequelize.TEXT('tiny'),
            field: "image_location"
        }
    }, {
        tableName: "comer_images",
        defaultScope: {
            attributes: {
                exclude: ['url', 'thumbnailUrl']
            }
        }
    });

    return Image;
}