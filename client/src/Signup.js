import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Box, Typography, Button, FormControl, TextField, FormHelperText, makeStyles } from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";

import bgimg from "./bg-img.png";
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
  login: {
    justifyContent: "end",
    alignItems: "center",
  },
  loginText: {
    fontSize: 14,
    color: theme.palette.secondary.main,
  },
  loginButton: {
    marginLeft: 10,
    fontSize: 14,
    color: theme.palette.primary.main,
    backgroundColor: "white",
  },
  title: {
    fontSize: 26,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    margin: "auto",
  },
}));

const Login = (props) => {
  const history = useHistory();
  const classes = useStyle();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.root}>
      <Grid container item className={classes.left}>
        <Grid container item direction="column" alignItems="center">
          <SmsOutlinedIcon className={classes.welcomeIcon} />
          <Typography className={classes.welcomeText}>Converse with anyone with any language</Typography>
        </Grid>
      </Grid>
      <Grid container item className={classes.right} spacing={10}>
        <Grid container item className={classes.login} spacing={5}>
          <Typography className={classes.loginText}>Already have an account?</Typography>
          <Button onClick={() => history.push("/login")} className={classes.loginButton} variant="contained" size="large">
            Login
          </Button>
        </Grid>
        <Grid container item>
          <form className={classes.form} onSubmit={handleRegister}>
            <Grid container direction="column" spacing={2}>
              <Grid item>
                <Typography className={classes.title}>Create an account</Typography>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <TextField aria-label="username" label="Username" name="username" type="text" required />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth>
                  <TextField label="E-mail address" aria-label="e-mail address" type="email" name="email" required />
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth error={!!formErrorMessage.confirmPassword}>
                  <TextField aria-label="password" label="Password" type="password" inputProps={{ minLength: 6 }} name="password" required />
                  <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item>
                <FormControl fullWidth error={!!formErrorMessage.confirmPassword}>
                  <TextField
                    label="Confirm Password"
                    aria-label="confirm password"
                    type="password"
                    inputProps={{ minLength: 6 }}
                    name="confirmPassword"
                    required
                  />
                  <FormHelperText>{formErrorMessage.confirmPassword}</FormHelperText>
                </FormControl>
              </Grid>
              <Grid container item justifyContent="center">
                <Button item color="primary" type="submit" variant="contained" size="large">
                  Create
                </Button>
              </Grid>
            </Grid>
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
