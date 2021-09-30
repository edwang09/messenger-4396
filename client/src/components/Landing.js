import React from "react";
import { Grid, Typography, Button, makeStyles } from "@material-ui/core";
import bgimg from "../bg-img.png";
import SmsOutlinedIcon from "@material-ui/icons/SmsOutlined";

const useStyle = makeStyles((theme) => ({
  root: {
    height: "100vh",
    flexWrap: "nowrap",
    overflow: "hidden",
  },
  left: {
    ["@media (max-width:600px)"]: {
      display: "none",
    },
    flexShrink: 0.5,
    flexGrow: 1,
    flexBasis: 500,
    alignItems: "center",
    backgroundPosition: "center",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundImage: ` linear-gradient(to bottom, rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85) ), url(${bgimg})`,
  },
  welcomeIcon: {
    fontSize: 60,
    color: "white",
    textAlign: "center",
  },
  welcomeText: {
    fontSize: 26,
    color: "white",
    textAlign: "center",
    maxWidth: 300,
  },
  right: {
    flexGrow: 1,
    maxWidth: 800,
    minWidth: 400,
    padding: 50,
    flexDirection: "column",
    alignItems: "center",
  },
  auth: {
    justifyContent: "end",
    alignItems: "center",
  },
  authText: {
    fontSize: 14,
    color: theme.palette.secondary.main,
  },
  authButton: {
    marginLeft: 10,
    fontSize: 14,
    color: theme.palette.primary.main,
    backgroundColor: "white",
  },
}));

const Landing = (props) => {
  const classes = useStyle();
  return (
    <Grid container className={classes.root}>
      <Grid container item className={classes.left}>
        <Grid container item direction="column" alignItems="center">
          <SmsOutlinedIcon className={classes.welcomeIcon} />
          <Typography className={classes.welcomeText}>Converse with anyone with any language</Typography>
        </Grid>
      </Grid>
      <Grid container item className={classes.right} spacing={10}>
        <Grid container item className={classes.auth} spacing={5}>
          <Typography className={classes.authText}>{props.toggleText}</Typography>
          <Button onClick={props.toggleButtonClick} className={classes.authButton} variant="contained" size="large">
            {props.toggleButtonText}
          </Button>
        </Grid>
        <Grid container item>
          {props.children}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Landing;
