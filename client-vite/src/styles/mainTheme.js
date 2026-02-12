import { createTheme } from "@mui/material";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#9a9eb1",
    },
    secondary: {
      main: "#f50057",
    },
    background: {
      paper: "rgba(100, 106, 113, 0.87)",
      default: "rgba(65, 80, 91, 0.86)",
    },
    male: {
      main: "#AAAAFF",
    },
    female: {
      main: "#FFAAAA",
    },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: () => ({
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          border: 0,
          borderRadius: 10,
          color: "white",
          height: 38,
          padding: "0 20px",
        }),
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiPaper: {
      variants: [
        {
          props: { variant: "subtle" },
          style: ({ theme }) => ({
            border: `1px solid ${theme.palette.mode === "dark" ? "rgba(255,255,255,0.04)" : "rgba(15,23,42,0.06)"}`,
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.02)"
                : "rgba(15,23,42,0.01)",
            borderRadius: theme.spacing(1.5),
          }),
        },
      ],
    },
    MuiCard: {
      defaultProps: {
        variant: "subtle",
      },
    },
    MuiAccordion: {
      defaultProps: {
        variant: "subtle",
      },
    },
  },
  props: {
    MuiAppBar: {
      color: "transparent",
    },
  },
  spacing: 8,
  typography: {
    fontSize: 12,
    caption: {
      fontSize: "0.7rem",
      fontWeight: 600,
      letterSpacing: "0.2em",
      lineHeight: 1.25,
    },
    button: {
      fontSize: "0.8rem",
    },
  },
});
