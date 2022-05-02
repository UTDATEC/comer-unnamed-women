module.exports = (sequelize, Sequelize) => {

    
  const Tutorial = sequelize.define("imagePathTestNoData", {
    title: {
    type: Sequelize.STRING
    },
    description: {
    type: Sequelize.STRING
    },
    // This should be called name not path
    path: {
    type: Sequelize.STRING
    },
    });

    return Tutorial;
  };