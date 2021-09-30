const Conversation = require("./conversation");
const User = require("./user");
const db = require("../db");
const Message = require("./message");

// associations
Conversation.belongsToMany(User, { as: "users", through: "ConversationUser" });
User.belongsToMany(Conversation, { as: "conversations", through: "ConversationUser" });

Message.belongsTo(Conversation, { as: "conversation" });
Conversation.hasMany(Message);

Message.belongsToMany(User, { as: "readers", through: "MessageRead" });

module.exports = {
  User,
  Conversation,
  Message,
};
