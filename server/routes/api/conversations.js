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
      attributes: ["id"],
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
        delete convoJSON.user1;
      } else if (convoJSON.user2) {
        convoJSON.otherUser = convoJSON.user2;
        delete convoJSON.user2;
      }
      // count unread message
      convoJSON.unreadMessage = convoJSON.messages.reduce((count, cur) => {
        if (cur.senderId === convoJSON.otherUser.id && cur.read === false) return count + 1;
        return count;
      }, 0);

      // get last read message from other user
      convoJSON.readMessageId = convoJSON.messages.reduce((pre, cur) => {
        if (cur.senderId === userId && cur.read === true) return cur.id;
        return pre;
      }, -1);

      // set property for online status of the other user
      if (onlineUsers.includes(convoJSON.otherUser.id)) {
        convoJSON.otherUser.online = true;
      } else {
        convoJSON.otherUser.online = false;
      }

      // set properties for notification count and latest message preview
      convoJSON.latestMessageText = convoJSON.messages[convoJSON.messages.length - 1].text;
      convoJSON.latestMessageCreatedAt = convoJSON.messages[convoJSON.messages.length - 1].createdAt;
      conversations[i] = convoJSON;
    }
    conversations.sort((a, b) => Date.parse(b.latestMessageCreatedAt) - Date.parse(a.latestMessageCreatedAt));
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
    const { otherUserId, conversationId } = req.body;
    const userId = req.user.id;

    // return 403 Forbidden if the user doesn't belong to the conversation
    const conversation = await Conversation.findByPk(conversationId);
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return res.sendStatus(403);
    }
    // update message read status
    await Message.update(
      { read: true },
      {
        where: {
          conversationId: conversationId,
          senderId: otherUserId,
        },
      }
    );
    // retrieve last read message id
    const lastMessage = await Message.findAll({
      limit: 1,
      order: [["createdAt", "DESC"]],
      where: {
        conversationId: conversationId,
        senderId: otherUserId,
      },
    });
    res.json({
      conversationId: conversationId,
      otherUserId: otherUserId,
      userId: userId,
      lastMessageId: lastMessage.length > 0 ? lastMessage[0].toJSON().id : null,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = router;
