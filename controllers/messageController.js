const Message = require("../models/Message");

exports.sendMessage = async (req, res) => {
  try {
    const message = await Message.create({
      content: req.body.content,
      sender: req.user._id,
      channel: req.body.channelId,
    });
    res.status(201).json(message);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Recuperar historial de mensajes con paginación
exports.getMessages = async (req, res) => {
  try {
    const { channelId, page = 1, limit = 10 } = req.query;
    const messages = await Message.find({ channel: channelId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    res.json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
