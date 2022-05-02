module.exports = (sequelize, Sequelize) => {

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