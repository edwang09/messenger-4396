import io from "socket.io-client";
import store from "./store";
import {
  setNewMessage,
  updateReadMessageFeedback,
  removeOfflineUser,
  addOnlineUser,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message", (data) => {
    store.dispatch(setNewMessage(data.message, data.sender));
  });
  socket.on("read-message", (data) => {
    const {otherUserId, userId, lastMessageId} = data;
    // if the message read if send by curent user, make updates
    if (store.getState().user && store.getState().user.id === otherUserId)
      store.dispatch(updateReadMessageFeedback(userId, lastMessageId));
  });
});

export default socket;
