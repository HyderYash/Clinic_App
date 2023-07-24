import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import {
  Button,
  CircularProgress,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { ToastContainer, toast } from "react-toastify";
import { fetchAPIData } from "../../utils/Common";
import { green } from "@material-ui/core/colors";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  large: {
    width: theme.spacing(15),
    height: theme.spacing(15),
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    position: "relative",
    marginTop: "10px",
  },
  customCardHeaderCss: {
    display: "flex",
    padding: "16px",
    alignItems: "center",
    paddingTop: "8px !important",
    paddingBottom: "8px !important",
    background: "#3f51b5",
    color: "white",
    marginBottom: "10px",
  },
}));

export default function Login() {
  const classes = useStyles();
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  const notify = (message) =>
    toast.error(message, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });

  const handleLogin = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      username: userName,
      password: password,
    };
    fetchAPIData("/signin", formData, "POST", true).then((json) => {
      if (json.status === "Success") {
        const user = jwt_decode(json.userData);
        sessionStorage.setItem("token", json.userData);
        if (user.USER_TYPE === "S") {
          router.push("/superadmin");
        } else {
          router.push("/dashboard");
        }
      } else {
        notify(json.message);
        setShowSnackbar(true);
        setLoading(false);
      }
    });
  };
  const handleClickPassword = () => {
    setShowPassword((prev) => !prev);
  };
  useEffect(() => {
    document.title = "Login into Clinic";
  }, []);
  return (
    <div>
      {showSnackbar === true ? <ToastContainer /> : null}
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        style={{ minHeight: "100vh" }}
      >
        <Grid item xs={3} style={{ maxWidth: "90%" }}>
          <Card
            style={{
              border: "2px solid #3f51b5",
              width: "100%",
            }}
          >
            <CardHeader
              title="Clinic 💉"
              className={classes.customCardHeaderCss}
            />
            <Avatar
              alt="avatar"
              src="https://cdn-icons-png.flaticon.com/512/2991/2991292.png"
              className={classes.large}
              style={{ border: "1px solid lightblue" }}
            />
            <CardContent>
              <form onSubmit={handleLogin}>
                <TextField
                  label="Enter Username"
                  variant="outlined"
                  style={{ width: "100%", marginBottom: "10px" }}
                  onChange={(e) => setUserName(e.target.value)}
                  required
                  autoComplete="off"
                />
                <TextField
                  label="Enter Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  style={{ width: "100%", marginBottom: "10px" }}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="off"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton onClick={handleClickPassword} edge="end">
                          {showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <Link to="/forgotpassword">
                <span
                  style={{
                    fontWeight: "bold",
                    color: "blue",
                    textDecoration: "underline",
                  }}
                >
                  Forgot Password?
                </span>
                </Link> */}
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    endIcon={<SendIcon />}
                    style={{ width: "100%", marginBottom: "10px" }}
                    disabled={loading}
                  >
                    Login
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={classes.buttonProgress}
                    />
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
}
