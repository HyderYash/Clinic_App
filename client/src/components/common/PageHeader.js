import React, { useEffect, useState } from "react";
import Link from "next/link";
import { makeStyles } from "@material-ui/core/styles";
import { useRouter } from "next/router";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import EmojiPeopleIcon from "@material-ui/icons/EmojiPeople";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DateRangeIcon from "@material-ui/icons/DateRange";
import jwt_decode from "jwt-decode";
import PhoneIcon from "@material-ui/icons/Phone";
import BusinessIcon from "@material-ui/icons/Business";
import VpnKeyIcon from "@material-ui/icons/VpnKey";

const drawerWidth = 200;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  drawerContainer: {
    overflow: "auto",
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  toolbarButtons: {
    marginLeft: "auto",
  },
}));

export default function PageHeader({ children }) {
  const classes = useStyles();
  const router = useRouter();
  const [clinicDetails, setClinicDetails] = useState([]);
  const logoutUser = () => {
    sessionStorage.removeItem("token");
    router.push("/");
  };

  useEffect(() => {
    setClinicDetails(jwt_decode(sessionStorage.getItem("token")).clinic[0]);
  }, []);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={classes.appBar}
        style={{ backgroundColor: `${clinicDetails.CLINIC_THEME}` }}
      >
        <Toolbar>
          <Typography variant="h6" noWrap>
            {clinicDetails.CLINIC_NAME}
          </Typography>
          <div className={classes.toolbarButtons}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <PhoneIcon style={{ fontSize: 15 }} />
              {clinicDetails.CLINIC_PHONE}
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <BusinessIcon style={{ fontSize: 15 }} />
              {clinicDetails.CLINIC_ADDRESS}
            </div>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <Link href="/dashboard" passHref>
              <ListItem button>
                <ListItemIcon style={{ minWidth: "30px" }}>
                  <DashboardIcon />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItem>
            </Link>
            <Divider />
            <Link href="/dashboard/appointments" passHref>
              <ListItem button>
                <ListItemIcon style={{ minWidth: "30px" }}>
                  <DateRangeIcon />
                </ListItemIcon>
                <ListItemText primary="Appointments" />
              </ListItem>
            </Link>
            <Divider />
            <Link href="/dashboard/patients" passHref>
              <ListItem button>
                <ListItemIcon style={{ minWidth: "30px" }}>
                  <EmojiPeopleIcon />
                </ListItemIcon>
                <ListItemText primary="Patients" />
              </ListItem>
            </Link>
            <Divider />
            <Link href="/dashboard/doctors" passHref>
              <ListItem button>
                <ListItemIcon style={{ minWidth: "30px" }}>
                  <AccountBoxIcon />
                </ListItemIcon>
                <ListItemText primary="Doctors" />
              </ListItem>
            </Link>
            <Divider />
            <Link href="/changepassword" passHref>
              <ListItem button>
                <ListItemIcon style={{ minWidth: "30px" }}>
                  <VpnKeyIcon />
                </ListItemIcon>
                <ListItemText primary="Change Password" />
              </ListItem>
            </Link>
            <Divider />
            <ListItem button onClick={() => logoutUser()}>
              <ListItemIcon style={{ minWidth: "30px" }}>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </div>
      </Drawer>
      <main className={classes.content}>
        <Toolbar />
        {children}
      </main>
    </div>
  );
}
