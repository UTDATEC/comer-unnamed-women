module.exports = (sequelize, Sequelize) => {
    // This file defines the fields (columns) of the table that will be added to the mySQL database
    // the name (comerCollection2) is the name of the table in mySQL (will create a new one if the name does not exist)
    const Image = sequelize.define("comerCollection2", {
      title: {
        type: Sequelize.STRING
      },
      artist: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.STRING
      },
      inscriptions: {
        type: Sequelize.STRING
      },
      medium: {
        type: Sequelize.STRING
      },
      dimensions: {
        type: Sequelize.STRING
      },
      accessionNumber: {
        type: Sequelize.STRING
      },
      copyright: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      collectionLocation: {
        type: Sequelize.STRING
      },
      dateCreated: {
        type: Sequelize.STRING
      },
      fileName: {
        type: Sequelize.STRING
      },
    });

    return Image;
  };