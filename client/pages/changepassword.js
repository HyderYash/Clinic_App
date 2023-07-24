import React, { useEffect, useState } from "react";
import PageHeader from "../src/components/common/PageHeader";
import {
  Button,
  DialogActions,
  IconButton,
  InputAdornment,
  TextField,
} from "@material-ui/core";
import { fetchAPIData } from "../src/utils/Common";
import { ToastContainer, toast } from "react-toastify";
import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { useRouter } from "next/router";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import jwt_decode from "jwt-decode";
import SuperAdminPageHeader from "../src/components/superadmin_components/SuperAdminHeader";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const changepassword = () => {
  const router = useRouter();
  const [oldPassword, setOldPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [open, setOpen] = useState(false);
  const [userId, setUserId] = useState("");

  const notify = (message) =>
    toast.error(message, {
      position: "bottom-left",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
    });

  const handleChangePassword = (e) => {
    setLoading(true);
    e.preventDefault();
    const formData = {
      OLD_PASS: oldPassword,
      NEW_PASS: newPassword,
    };
    fetchAPIData("/changepassword", formData, "POST").then((json) => {
      if (json.status === "Success") {
        setOpen(true);
      } else {
        notify(json.message);
        setShowSnackbar(true);
        setLoading(false);
      }
    });
  };

  const logoutUser = () => {
    sessionStorage.removeItem("token");
    router.push("/");
  };

  useEffect(() => {
    setUserId(jwt_decode(sessionStorage.getItem("token")).USER_TYPE);
    console.log(jwt_decode(sessionStorage.getItem("token")).USER_TYPE);
  }, []);

  const PageContent = () => (
    <>
      {showSnackbar === true ? <ToastContainer /> : null}
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <CheckCircleIcon style={{ fontSize: 100, color: "green" }} />
          </div>
          Success! Login With Your New Password
        </DialogTitle>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => logoutUser()}
          >
            Ok
          </Button>
        </DialogActions>
      </Dialog>
      <h1>Change Password</h1>
      <div style={{ width: "30%" }}>
        <form onSubmit={handleChangePassword}>
          <TextField
            label="Enter Old Password"
            variant="outlined"
            type={showOldPassword ? "text" : "password"}
            size="small"
            style={{ marginBottom: "10px" }}
            onChange={(e) => setOldPassword(e.target.value)}
            required
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowOldPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showOldPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            label="Enter New Password"
            variant="outlined"
            type={showNewPassword ? "text" : "password"}
            size="small"
            style={{ marginBottom: "10px" }}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="off"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    edge="end"
                  >
                    {showNewPassword ? (
                      <VisibilityIcon />
                    ) : (
                      <VisibilityOffIcon />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div>
            <Button
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              size="small"
            >
              Save
            </Button>
          </div>
        </form>
      </div>
    </>
  );

  return (
    <div>
      {userId === "S" ? (
        <SuperAdminPageHeader>{PageContent()}</SuperAdminPageHeader>
      ) : (
        <PageHeader>{PageContent()}</PageHeader>
      )}
    </div>
  );
};

export default changepassword;
