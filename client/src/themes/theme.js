import { createTheme } from "@material-ui/core";

export const theme = createTheme({
  spacing: 10,
  typography: {
    fontFamily: "Open Sans, sans-serif",
    fontSize: 14,
    button: {
      textTransform: "none",
      letterSpacing: 0,
      fontWeight: "bold",
    },
  },
  overrides: {
    MuiInput: {
      input: {
        fontWeight: "bold",
      },
    },
    MuiButton: {
      containedSizeLarge: {
        padding: "13px 55px",
        borderRadius: 3,
      },
    },
  },
  palette: {
    primary: { main: "#3A8DFF" },
    secondary: { main: "#B0B0B0" },
  },
});
