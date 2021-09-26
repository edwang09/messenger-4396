export const addMessageToStore = (state, payload) => {
  const { message, sender } = payload;
  // if sender isn't null, that means the message needs to be put in a brand new convo
  if (sender !== null) {
    const newConvo = {
      id: message.conversationId,
      otherUser: sender,
      messages: [message],
      unreadMessage: 1,
    };
    newConvo.latestMessageText = message.text;
    return [newConvo, ...state];
  }

  return state.map((convo) => {
    if (convo.id === message.conversationId) {
      let unreadMessage = convo.unreadMessage;
      if (convo.otherUser && convo.otherUser.id === message.senderId) unreadMessage += 1;
      return { ...convo, messages: [...convo.messages, message], latestMessageText: message.text, unreadMessage };
    } else {
      return convo;
    }
  });
};
export const updateReadMessageToStore = (state, payload) => {
  const { readerId, readMessageId } = payload;
  return state.map((convo) => {
    if (convo.otherUser.id === readerId) {
      return { ...convo, readMessageId };
    } else {
      return convo;
    }
  });
};
export const updateOtherReadMessageToStore = (state, payload) => {
  const { conversationId, readMessageId } = payload;
  return state.map((convo) => {
    if (convo.id === conversationId) {
      return { ...convo, otherReadMessageId: readMessageId, unreadMessage: 0 };
    } else {
      return convo;
    }
  });
};
export const clearUnreadMessage = (state, payload) => {
  const { conversationId } = payload;
  return state.map((convo) => {
    if (convo.id === conversationId) {
      return { ...convo, unreadMessage: 0 };
    } else {
      return convo;
    }
  });
};

export const addOnlineUserToStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = true;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const removeOfflineUserFromStore = (state, id) => {
  return state.map((convo) => {
    if (convo.otherUser.id === id) {
      const convoCopy = { ...convo };
      convoCopy.otherUser.online = false;
      return convoCopy;
    } else {
      return convo;
    }
  });
};

export const addSearchedUsersToStore = (state, users) => {
  const currentUsers = {};

  // make table of current users so we can lookup faster
  state.forEach((convo) => {
    currentUsers[convo.otherUser.id] = true;
  });

  const newState = [...state];
  users.forEach((user) => {
    // only create a fake convo if we don't already have a convo with this user
    if (!currentUsers[user.id]) {
      let fakeConvo = { otherUser: user, messages: [] };
      newState.push(fakeConvo);
    }
  });

  return newState;
};

export const addNewConvoToStore = (state, recipientId, message) => {
  return state.map((convo) => {
    if (convo.otherUser.id === recipientId) {
      return { ...convo, id: message.conversationId, messages: [...convo.messages, message], latestMessageText: message.text };
    } else {
      return convo;
    }
  });
};
