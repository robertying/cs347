import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useMemo } from "react";
import {
  createTheme,
  ScopedCssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import Confirmation from "./Confirmation";

const App: React.FC<{
  anchor: HTMLElement;
  anchorStyle: {
    border: string;
    borderRadius: string;
  };
}> = ({ anchor, anchorStyle }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
        typography: {
          fontSize: 14,
          body1: {
            fontSize: 14,
          },
          button: {
            fontSize: 14,
          },
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <ScopedCssBaseline>
        <Confirmation anchor={anchor} anchorStyle={anchorStyle} />
      </ScopedCssBaseline>
    </ThemeProvider>
  );
};

export default App;
