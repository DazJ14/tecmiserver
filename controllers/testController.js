const Campus = require("../models/Campus")
const User = require("../models/User")

exports.addCampus = async (req, res) => {
    console.log("peticion de crear campus")
    try {
        const campus = await Campus.create({
            name: req.body.name,
          });

          res.status(201).json(campus);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}

exports.getUser = async (req, res) => {
    try {
        const user = await User.findById(req.body.id).populate("campus").exec()

        res.status(200).json(user)
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}