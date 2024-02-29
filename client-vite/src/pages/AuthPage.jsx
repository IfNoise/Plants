import { useState, useContext } from "react";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { SnackbarContext } from "../context/SnackbarContext";
import { useNavigate } from "react-router-dom";
import { FormControl, Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useLoginMutation, useRegisterMutation } from "../store/authApi";

import { setCredentials } from "../store/authSlice";

export const AuthPage = () => {
  const { setSnack } = useContext(SnackbarContext);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { isLoginLoading }] = useLoginMutation();
  const [register, { isRegisterLoading }] = useRegisterMutation();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const changeHandler = (event) => {
    setForm({ ...form, [event.target.name]: event.target.value });
  };

  const registerHandler = async () => {
    try {
      const user = await register(form).unwrap();
      dispatch(setCredentials(user));
      navigate("/");
    } catch (err) {
      setSnack({ open: true, severity: "error", message: err.message });
    }
  };
  const loginHandler = async () => {
    try {
      const user = await login(form).unwrap();
      dispatch(setCredentials(user));
      navigate("/");
    } catch (err) {
      setSnack({ open: true, severity: "error", message: err.message });
    }
  };

  return (
    <Box sx={{display:"flex",justifyContent:"center"}} >
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            Authorisation
          </Typography>
          <FormControl>
            <TextField
              sx={{ m: 2 }}
              id="outlined-text-input"
              label="User Name"
              name="username"
              variant="outlined"
              onChange={changeHandler}
            />
          </FormControl>
          <FormControl>
            <TextField
              sx={{ m: 2 }}
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              name="password"
              variant="outlined"
              onChange={changeHandler}
            />
          </FormControl>
        </CardContent>
        <CardActions>
          <Button
            variant="contained"
            onClick={loginHandler}
            disabled={isLoginLoading || isRegisterLoading}
          >
            Login
          </Button>
          <Button
            variant="contained"
            onClick={registerHandler}
            disabled={isLoginLoading || isRegisterLoading}
          >
            Registration
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
