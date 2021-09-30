import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Typography, Button, FormControl, TextField, makeStyles } from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";
import Landing from "./components/Landing";

const useStyle = makeStyles((theme) => ({
  title: {
    fontSize: 26,
  },
  form: {
    width: "100%",
    maxWidth: 400,
    margin: "auto",
  },
  forgot: {
    position: "absolute",
    right: 12,
    top: 25,
    fontSize: 12,
    color: theme.palette.primary.main,
    cursor: "pointer",
  },
}));

const Login = (props) => {
  const history = useHistory();
  const classes = useStyle();
  const { user, login } = props;

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await login({ username, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Landing toggleText="Dont have an account?" toggleButtonText="Register" toggleButtonClick={() => history.push("/register")}>
      <form className={classes.form} onSubmit={handleLogin}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography className={classes.title}>Welcome back !</Typography>
          </Grid>
          <Grid item>
            <FormControl margin="normal" fullWidth required>
              <TextField aria-label="username" label="Username" name="username" type="text" />
            </FormControl>
          </Grid>
          <Grid item>
            <FormControl margin="normal" fullWidth required style={{ position: "relative" }}>
              <TextField label="password" aria-label="password" type="password" name="password" />
              <Typography className={classes.forgot}>Forgot?</Typography>
            </FormControl>
          </Grid>
          <Grid container item justifyContent="center">
            <Button color="primary" type="submit" variant="contained" size="large">
              Login
            </Button>
          </Grid>
        </Grid>
      </form>
    </Landing>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
