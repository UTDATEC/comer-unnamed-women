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


    // Tutorial.bulkCreate([
    //   { title: 'hey', description: 'desc', published: true  },
    //   { title: 'hey2', description: 'desc2', published: true  },
    //   { title: 'hey3', description: 'desc3', published: true  }
    // ]).then(function() {
    //   return Tutorial.findAll();
    // }).then(function(notes) {
    //   console.log(notes);
    // });

    return Tutorial;
  };