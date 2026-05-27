const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const { protect } = require('../middleware/auth');

// GET /api/messages/conversations - list unique conversations
router.get('/conversations', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'name profile.avatar role')
      .populate('recipient', 'name profile.avatar role')
      .sort({ createdAt: -1 });

    // Group by conversation partner
    const seen = new Set();
    const conversations = [];
    for (const msg of messages) {
      const partner = msg.sender._id.toString() === userId.toString() ? msg.recipient : msg.sender;
      if (!seen.has(partner._id.toString())) {
        seen.add(partner._id.toString());
        conversations.push({ partner, lastMessage: msg });
      }
    }
    res.json(conversations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/messages/:userId - get messages with a specific user
router.get('/:userId', protect, async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, recipient: req.params.userId },
        { sender: req.params.userId, recipient: req.user._id }
      ]
    })
      .populate('sender', 'name profile.avatar')
      .sort({ createdAt: 1 });

    // Mark as read
    await Message.updateMany(
      { sender: req.params.userId, recipient: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/messages/:userId - send a message
router.post('/:userId', protect, async (req, res) => {
  try {
    const message = await Message.create({
      sender: req.user._id,
      recipient: req.params.userId,
      content: req.body.content,
      relatedJob: req.body.relatedJob
    });
    const populated = await message.populate('sender', 'name profile.avatar');
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
