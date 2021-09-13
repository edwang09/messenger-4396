import React from "react";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Box,
  Typography,
  Button,
  FormControl,
  TextField,
  makeStyles
} from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";
import bgimg from "./bg-img.png";
import SmsOutlinedIcon from '@material-ui/icons/SmsOutlined';

const useStyle = makeStyles((theme)=>({
  root: {
    height:"100vh",
    flexWrap: "nowrap",
    overflow:"hidden"
  },
  left: {
    ['@media (max-width:600px)'] : {
      display: "none"
    },
    flexShrink : 0.5,
    flexGrow : 1,
    flexBasis:500,  
    alignItems:"center" ,
    backgroundPosition: 'center',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    backgroundImage: ` linear-gradient(to bottom, rgba(58, 141, 255, 0.85), rgba(134, 185, 255, 0.85) ), url(${bgimg})`
  
  },
  welcomeIcon:{
    fontSize: 60,
    color: "white",
    textAlign:"center",
  },
  welcomeText:{
    fontSize: 26,
    color: "white",
    textAlign:"center",
    maxWidth: 300
  },
  right: {
    flexGrow:1,
    maxWidth:800,
    minWidth:400,
    padding: 50,
    flexDirection:"column",
    alignItems:"center",
  },
  register:{
    justifyContent:"end",
    alignItems: "center",
  },
  registerText:{
    fontSize : 14,
    color:  theme.palette.secondary.main
  },
  registerButton:{
    marginLeft: 10,
    fontSize : 14,
    color: theme.palette.primary.main,
    backgroundColor: "white"
  },
  title:{
    fontSize : 26,
  },
  form:{
    width:"100%",
    maxWidth: 400,
    margin: "auto",
  },
  forgot:{
    position:"absolute",
    right: 12,
    top:25,
    fontSize:12,
    color: theme.palette.primary.main,
    cursor:"pointer"
  }
}))


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
    <Grid container className = {classes.root}>
      <Grid container item className = {classes.left}>
        <Grid container item direction="column" alignItems="center" >
          <SmsOutlinedIcon className = {classes.welcomeIcon}/>
          <Typography className = {classes.welcomeText}>
            Converse with anyone with any language
          </Typography>
        </Grid>
      </Grid>
      <Grid container item className = {classes.right} spacing={10}>
        <Grid container item className={classes.register} spacing={5}>
          <Typography className={classes.registerText}>Dont have an account?</Typography>
          <Button onClick={() => history.push("/register")} className={classes.registerButton} variant = "contained" size="large">Register</Button>
        </Grid>
        <Grid container item>
        <form  className = {classes.form} onSubmit={handleLogin}>
            <Grid container direction="column" spacing={2}>
              <Grid item >
                <Typography className={classes.title}>
                  Welcome back !
                </Typography>
              </Grid>
              <Grid item>
                <FormControl margin="normal" fullWidth required>
                  <TextField
                    aria-label="username"
                    label="Username"
                    name="username"
                    type="text"
                  />
                </FormControl>
              </Grid>
              <Grid item>
              <FormControl margin="normal"  fullWidth required style={{position:"relative"}}>
                <TextField
                  label="password"
                  aria-label="password"
                  type="password"
                  name="password"
                />
                <Typography className={classes.forgot}>
                  Forgot?
                </Typography>
              </FormControl>
              </Grid>
              <Grid container item justifyContent="center">
                <Button item color="primary" type="submit" variant="contained" size="large">
                  Login
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
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
