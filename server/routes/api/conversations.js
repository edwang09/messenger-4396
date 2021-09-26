const router = require("express").Router();
const { User, Conversation, Message } = require("../../db/models");
const { Op } = require("sequelize");
const onlineUsers = require("../../onlineUsers");

// get all conversations for a user, include latest message text for preview, and all messages
// include other user model so we have info on username/profile pic (don't include current user info)
router.get("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const userId = req.user.id;
    const conversations = await Conversation.findAll({
      where: {
        [Op.or]: {
          user1Id: userId,
          user2Id: userId,
        },
      },
      attributes: ["id", "user1ReadMessageId", "user2ReadMessageId", "user1UnreadMessage", "user2UnreadMessage"],
      order: [[Message, "createdAt", "ASC"]],
      include: [
        { model: Message, order: ["createdAt", "ASC"] },
        {
          model: User,
          as: "user1",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
        {
          model: User,
          as: "user2",
          where: {
            id: {
              [Op.not]: userId,
            },
          },
          attributes: ["id", "username", "photoUrl"],
          required: false,
        },
      ],
    });

    for (let i = 0; i < conversations.length; i++) {
      const convo = conversations[i];
      const convoJSON = convo.toJSON();

      // set a property "otherUser" so that frontend will have easier access
      if (convoJSON.user1) {
        convoJSON.otherUser = convoJSON.user1;
        convoJSON.unreadMessage = convoJSON.user2UnreadMessage;
        convoJSON.readMessageId = convoJSON.user1ReadMessageId;
        convoJSON.otherReadMessageId = convoJSON.user2ReadMessageId;
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        convoJSON.unreadMessage = convoJSON.user1UnreadMessage;
        convoJSON.readMessageId = convoJSON.user2ReadMessageId;
        convoJSON.otherReadMessageId = convoJSON.user1ReadMessageId;
        delete convoJSON.user2;
      }
      delete convoJSON.user1UnreadMessage;
      delete convoJSON.user2UnreadMessage;
      delete convoJSON.user1ReadMessageId;
      delete convoJSON.user2ReadMessageId;

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      conversations[i] = convoJSON;
    }

    res.json(conversations);
  } catch (error) {
    next(error);
  }
});

router.put("/readmessage", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const otherUserId = req.body.otherUserId;
    const lastMessageId = req.body.lastMessageId;
    const userId = req.user.id;
    const conversation = await Conversation.findConversation(userId, otherUserId);
    if (conversation.user1Id === userId) {
      conversation.user1ReadMessageId = lastMessageId;
      conversation.user1UnreadMessage = 0;
    } else {
      conversation.user2ReadMessageId = lastMessageId;
      conversation.user2UnreadMessage = 0;
    }

    await conversation.save();
    res.json(conversation);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
