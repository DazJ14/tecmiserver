const Server = require("../models/Server");
const Channel = require("../models/Channel");

exports.createServer = async (req, res) => {
  try {
    const server = await Server.create({
      name: req.body.name,
      owner: req.user._id,
    });
    res.status(201).json(server);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.createChannel = async (req, res) => {
  try {
    const channel = await Channel.create({
      name: req.body.name,
      server: req.body.serverId,
    });
    await Server.findByIdAndUpdate(req.body.serverId, {
      $push: { channels: channel._id },
    });
    res.status(201).json(channel);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
