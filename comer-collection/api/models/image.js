module.exports = (sequelize, Sequelize) => {
    // This file defines the fields (columns) of the table that will be added to the mySQL database
    // the name (comerCollection2) is the name of the table in mySQL (will create a new one if the name does not exist)
    const Image = sequelize.define("comerCollection2", {
      accession_number: {
        type: Sequelize.STRING
      },
      artist: {
        type: Sequelize.STRING
      },
      title: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.STRING
      },
      medium: {
        type: Sequelize.STRING
      },
      dimensions: {
        type: Sequelize.STRING
      },
      edition: {
        type: Sequelize.STRING
      },
      matsize: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      notes: {
        type: Sequelize.STRING
      },
      photo: {
        type: Sequelize.STRING
      },
      condition: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.STRING
      },
      source: {
        type: Sequelize.STRING
      },
      reference: {
        type: Sequelize.STRING
      },
      webfinsite: {
        type: Sequelize.STRING
      },
      
      tags: {
        type: Sequelize.STRING
      },
      inscriptions: {
        type: Sequelize.STRING
      },
      
      copyright: {
        type: Sequelize.STRING
      },
      subject: {
        type: Sequelize.STRING
      },
      
      image_file_name: {
        type: Sequelize.STRING
      },
    });

    return Image;
  };