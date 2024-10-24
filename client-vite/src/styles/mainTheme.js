import { createTheme } from "@mui/material";


export const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      paper: 'rgba(104,104,125,0.9)',
      default: 'rgba(31,39,45,0.86)',
    },
    male:{
      main:'#AAAAFF'
    },
    female:{
      main:'#FFAAAA'
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          border: 0,
          borderRadius: 10,
          color: 'white',
          height: 38,
          padding: '0 20px',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
  },
  props: {
    MuiAppBar: {
      color: 'transparent',
    },
  },
  spacing: 8,
  typography: {
    fontSize: 12,
    caption: {
      fontSize: '0.7rem',
      fontWeight: 600,
      letterSpacing: '0.2em',
      lineHeight: 1.25,
    },
    button: {
      fontSize: '0.8rem',
    },
  },
})