// Abigail Thomas 04/05/2023
const db = require("../sequelize.js");
const {sequelize} = require("../sequelize.js");
const exhibit = db.exhibitTable;
const Op = db.Sequelize.Op;

// Runs SQL query for exhibit table

const getExhibitById = async (req, res) => 
{
    try
    {
        const data = await sequelize.query("SELECT * FROM comerExhibitions;")
        if (data)
        {
            return res.send(data);
        }
        return res.status(404).send('No table.');
    }
    catch (error)
    {
        return res.status(500).send(error.message);
    }
}

module.exports = {getExhibitById}
