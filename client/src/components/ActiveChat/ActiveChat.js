import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Box } from "@material-ui/core";
import { Input, Header, Messages } from "./index";
import { connect } from "react-redux";
import { readConversation } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexGrow: 8,
    flexDirection: "column",
  },
  chatContainer: {
    marginLeft: 41,
    marginRight: 41,
    display: "flex",
    flexDirection: "column",
    flexGrow: 1,
    justifyContent: "space-between",
  },
}));

const ActiveChat = (props) => {
  // when active chat changes or new message is shown make corresponging read message actions
  React.useEffect(() => {
    if (props.conversation && props.conversation.unreadMessage > 0) {
      props.readConversation({ conversationId: props.conversation.id, otherUserId: props.conversation.otherUser.id, userId: props.user.id });
    }
  });
  const classes = useStyles();
  const { user } = props;
  const conversation = props.conversation || {};

  return (
    <Box className={classes.root}>
      {conversation.otherUser && (
        <>
          <Header username={conversation.otherUser.username} online={conversation.otherUser.online || false} />
          <Box className={classes.chatContainer}>
            <Messages
              messages={conversation.messages}
              readMessageId={conversation.readMessageId}
              otherUser={conversation.otherUser}
              userId={user.id}
            />
            <Input otherUser={conversation.otherUser} conversationId={conversation.id} user={user} />
          </Box>
        </>
      )}
    </Box>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
    conversation: state.conversations && state.conversations.find((conversation) => conversation.otherUser.username === state.activeConversation),
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    readConversation: (data) => {
      dispatch(readConversation(data));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActiveChat);
