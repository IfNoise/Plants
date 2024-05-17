import { Outlet, Link, Navigate, useLocation } from "react-router-dom";
import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SnackBar from "../components/SnackBar/SnackBar";
import { useAuth } from "../hooks/auth.hook";
import { TrayButton } from "../components/TrayButton/TrayButton";
import { InputBase, Paper, useMediaQuery } from "@mui/material";
import Scanner from "../components/Scanner/Scanner";
import PrintDialog from "../components/PrintDialog";

function PrivateOutlet() {
  const { isAuth } = useAuth();
  const location = useLocation();

  return isAuth ? (
    <Outlet />
  ) : (
    <Navigate to="/auth" state={{ from: location }} />
  );
}

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    marginTop: "64px",
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft:{md: `-${drawerWidth}px`,sm:0},
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));


const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: "flex-end",
}));

export const Layout = () => {
  const theme = useTheme();

  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(!isSmall && true);
  const handleDrawerOpen = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    if (isSmall) {
      setOpen(false);
    }
  }, [isSmall]);

  const handleDrawerClose = () => {
    setOpen(isSmall ? false : true);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ width: "100%" }}>
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{ p: "10px", ml: 2, mr: 2, ...(open && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Scanner />
          <TrayButton />
        </Toolbar>
      </AppBar>
      <Drawer
  sx={{
    width: drawerWidth,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      width: drawerWidth,
      boxSizing: 'border-box',
    },
  }}
        variant={isSmall ? "temporary" : "permanent"}
        anchor="left"
        onClose={handleDrawerClose}
        open={open}
      >
        <DrawerHeader>
          {isSmall && (
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "ltr" ? (
                <ChevronLeftIcon />
              ) : (
                <ChevronRightIcon />
              )}
            </IconButton>
          )}
        </DrawerHeader>
        <Divider />
        <Box role="presentation" onClick={handleDrawerClose}>
          <List>
            {[
              {
                text: "Cycles",
                href: "/cycles",
                icon: <SearchIcon />,
              },
              {
                text: "Dashboard",
                href: "/dashboard",
                icon: <DashboardIcon />,
              },
              {
                text: "Map",
                href: "/map",
                icon: <InboxIcon />,
              },
              {
                text: "Mothers",
                href: "/mothers",
                icon: <MailIcon />,
              },
              {
                text: "Plants",
                href: "/plants",
                icon: <InboxIcon />,
              },
              {
                text: "Strains",
                href: "/strains",
                icon: <MailIcon />,
              },
            ].map((obj) => (
              <ListItem key={obj.text} disablePadding>
                <ListItemButton component={Link} to={obj.href}>
                  <ListItemIcon>{obj.icon}</ListItemIcon>
                  <ListItemText primary={obj.text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider />
      </Drawer>
      <Main open={open}>
        {/* <DrawerHeader /> */}
        <Outlet />
        <SnackBar />
        <PrintDialog />
      </Main>
    </Box>
  );
};
