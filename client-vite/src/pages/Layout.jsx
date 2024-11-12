import {
  Outlet,
  Link,
  //Navigate,
  //useLocation,
  useNavigate,
} from "react-router-dom";
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
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import SearchIcon from "@mui/icons-material/Search";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ScienceIcon from "@mui/icons-material/Science";
import SnackBar from "../components/SnackBar/SnackBar";
//import { useAuth } from "../hooks/auth.hook";
import { Collapse, Typography, useMediaQuery } from "@mui/material";
import PrintDialog from "../components/PrintDialog";
import CollectionsIcon from "@mui/icons-material/Collections";
import PropTypes from "prop-types";
import { AppBarContext } from "../context/AppBarContext";
import { useContext } from "react";

// function PrivateOutlet() {
//   const { isAuth } = useAuth();
//   const location = useLocation();

//   return isAuth ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/auth" state={{ from: location }} />
//   );
// }

const CollapseList = ({ obj, onClick }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <ListItem>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary={obj.text} />
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </ListItem>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div">
          {obj.collapsed.map((obj, i) => {
            if (obj.collapsed) {
              return <CollapseList key={i} obj={obj} onClick={onClick} />;
            } else {
              return (
                <ListItem
                  key={obj.text}
                  sx={{
                    pl: "60px",
                  }}
                  disablePadding
                >
                  <ListItemButton
                    component={Link}
                    to={obj.href}
                    onClick={onClick}
                  >
                    <ListItemText primary={obj.text} />
                  </ListItemButton>
                </ListItem>
              );
            }
          })}
        </List>
      </Collapse>
    </>
  );
};

CollapseList.propTypes = {
  obj: PropTypes.object,
  onClick: PropTypes.func,
};

const drawerWidth = 240;

const Main = styled("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    position: "relative", 
    flexGrow: 1,
    top: "64px",
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    left: { md: `${drawerWidth}px`, sm: 0 },
    ...(open && {
      transition: theme.transitions.create("margin", {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  })
);
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    left: drawerWidth+"px",
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
//   ({ theme, open }) => ({
//     '& .MuiDrawer-paper': {
//       position: 'relative',
//       whiteSpace: 'nowrap',
//       width: drawerWidth,
//       transition: theme.transitions.create('width', {
//         easing: theme.transitions.easing.sharp,
//         duration: theme.transitions.duration.enteringScreen,
//       }),
//       boxSizing: 'border-box',
//       ...(!open && {
//         overflowX: 'hidden',
//         transition: theme.transitions.create('width', {
//           easing: theme.transitions.easing.sharp,
//           duration: theme.transitions.duration.leavingScreen,
//         }),
//         width: theme.spacing(7),
//         [theme.breakpoints.up('sm')]: {
//           width: theme.spacing(9),
//         },
//       }),
//     },
//   }),
// );


export const Layout = () => {
  const navigate = useNavigate();
  const { appBar } = useContext(AppBarContext);
  const isSmall = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [open, setOpen] = React.useState(!isSmall && true);
  const handleToggleDrawer = () => {
    if (isSmall) {
      setOpen(!open);
    }
  };
  const handleDrawerClose = () => {
    if (isSmall) {
      setOpen(false);
    }
  };

  React.useEffect(() => {
    if (isSmall) {
      setOpen(!open);
    }
  }, [isSmall]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar open={open} position="absolute" >
      <Toolbar>
        <IconButton
          aria-label="open drawer"
          onClick={handleToggleDrawer}
          edge="start"
          sx={{ p: "10px", ml: 2, mr: 2, ...(open && { display: "none" }) }}
        >
          <MenuIcon />
        </IconButton>
        <IconButton aria-label="back" onClick={() => navigate(-1)}>
          <ChevronLeftIcon />
        </IconButton>
        {appBar?.toolbar && appBar.toolbar}
        <Typography variant="h5" marginLeft={2} noWrap>
          {appBar?.title}
        </Typography>
        <Box
          sx={{
            flexGrow: 1,
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          {appBar?.right}
        </Box>
      </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
        variant={isSmall ? "temporary" : "permanent"}
        anchor="left"
        open={open}
      >
          <Toolbar
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              px: [1],
            }}
          >
            <IconButton onClick={handleToggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
        <Divider />
        <Box role="presentation">
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
                text: "Gallery",
                href: "/gallery",
                icon: <CollectionsIcon />,
              },
              {
                text: "Map",
                icon: <InboxIcon />,
                collapsed: [
                  {
                    text: "Hangar1",
                    icon: <InboxIcon />,
                    collapsed: [
                      {
                        text: "Main room",
                        href: "/map/Hangar1/Main_room",
                        icon: <InboxIcon />,
                      },
                      {
                        text: "Laboratory",
                        href: "/map/Hangar1/Laboratory",
                        icon: <InboxIcon />,
                      },
                    ],
                  },
                  {
                    text: "Hangar2",
                    icon: <InboxIcon />,
                    collapsed: [
                      {
                        text: "Main room",
                        href: "/map/Hangar2/Main_room",
                        icon: <InboxIcon />,
                      },
                      {
                        text: "Small room",
                        href: "/map/Hangar2/Small_room",
                        icon: <InboxIcon />,
                      },
                    ],
                  },
                ],
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
              {
                text: "Nutrients",
                href: "/nutrients",
                icon: <ScienceIcon />,
              },
            ].map((obj, i) => {
              if (obj.collapsed) {
                return (
                  <CollapseList key={i} obj={obj} onClick={handleDrawerClose} />
                );
              } else {
                return (
                  <ListItem key={obj.text} disablePadding>
                    <ListItemButton
                      component={Link}
                      to={obj.href}
                      onClick={handleDrawerClose}
                    >
                      <ListItemIcon>{obj.icon}</ListItemIcon>
                      <ListItemText primary={obj.text} />
                    </ListItemButton>
                  </ListItem>
                );
              }
            })}
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
