import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import { Grid, Typography, Button, FormControl, TextField, FormHelperText, makeStyles } from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";

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
    <Landing toggleText="Already have an account?" toggleButtonText="Login" toggleButtonClick={() => history.push("/login")}>
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
            <Button color="primary" type="submit" variant="contained" size="large">
              Create
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
