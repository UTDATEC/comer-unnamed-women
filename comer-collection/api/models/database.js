// This file defines the fields (columns) of the table that will be added to the mySQL database
// the name (comerExhibitions) is the name of the table in mySQL (will create a new one if the name does not exist)
// Abigail Thomas 04/05/2023

module.exports = (sequelize, Sequelize) =>
{
    const exhibitTable = sequelize.define("comerExhibitions", 
    {
        creator_user_id: {type: Sequelize.STRING},
        exhibit_name: {type: Sequelize.STRING},
        exhibit_notes: {type: Sequelize.STRING},
        exhibit_writeup: {type: Sequelize.STRING},
        exhibit_isPublished: {type: Sequelize.BOOLEAN, defaultValue: false,},
    });
    return exhibitTable;
};