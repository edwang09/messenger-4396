const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");

// expects {recipientId, text, conversationId } in body (conversationId will be null if no conversation exists yet)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, conversationId, sender } = req.body;
    let conversation;
    // if we already know conversation id, get it by primary key
    if (conversationId) {
      conversation = await Conversation.findByPk(conversationId);
    } else {
      // if we don't have conversation id, find a conversation to make sure it doesn't already exist
      conversation = await Conversation.findConversation(senderId, recipientId);
    }

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    //update unread message count
    if (conversation.user1Id === senderId) {
      conversation.user2UnreadMessage = conversation.user2UnreadMessage + 1;
    } else {
      conversation.user1UnreadMessage = conversation.user1UnreadMessage + 1;
    }
    await conversation.save();
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
