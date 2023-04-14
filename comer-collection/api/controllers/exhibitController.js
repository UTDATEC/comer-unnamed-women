// Abigail Thomas 04/05/2023
const db = require("../sequelize.js");
const {sequelize} = require("../sequelize.js");
const exhibit = db.exhibitTable;
const Op = db.Sequelize.Op;

const getExhibitById = async (req, res) => 
{
    try
    {
        const {creator_user_id} = req.params;
        const data = await sequelize.query("SELECT * FROM comerExhibitions WHERE id = '" + creator_user_id + "'")
        if (data)
        {
            return res.status(200).json({data});
        }
        return res.status(404).send('Exhibition with the specified ID does not exist');
    }
    catch (error)
    {
        return res.status(500).send(error.message);
    }
}

module.exports = {getExhibitById}

// Code below is from Aleena Syed's branch
/*const db = require("../sequelize.js");
const { sequelize } = require("../sequelize.js");
const Image = db.image;
const Op = db.Sequelize.Op;

const getImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await sequelize.query("SELECT * FROM comerCollection2s WHERE id = '" + id + "'")
      if (data) {
          return res.status(200).json({ data });
      }
      return res.status(404).send('Image with the specified ID does not exists');
  } catch (error) {
      return res.status(500).send(error.message);
  }
}

module.exports = {
  getImageById
}*/