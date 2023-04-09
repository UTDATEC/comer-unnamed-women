const db = require("../sequelize.js");
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

const getImages = async (req, res) => {
  try {
    const data = await sequelize.query("SELECT title, MIN(id) FROM comerCollection2s GROUP BY id LIMIT 5")
      if (data) {
          return res.send(data);
      }
      return res.status(404).send('Image with the specified ID does not exists');
  } catch (error) {
      return res.status(500).send(error.message);
  }
}

module.exports = {
  getImageById,
  getImages
}