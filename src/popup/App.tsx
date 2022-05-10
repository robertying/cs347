import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { useMemo } from "react";
import {
  Box,
  Button,
  createTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from "@mui/material";
import { clearAllData, clearWebsiteData, exportData } from "../helpers";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const handleExportData = () => {
    exportData();
  };

  const handleClearWebsiteData = async () => {
    const tabs = await chrome.tabs.query({
      active: true,
    });
    clearWebsiteData(new URL(tabs[0].url!).origin);
  };

  const handleClearAllData = () => {
    clearAllData();
  };

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: 200,
          height: 300,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Button onClick={handleExportData}>Export Data</Button>
        <Button onClick={handleClearWebsiteData}>Clear Website Data</Button>
        <Button onClick={handleClearAllData}>Clear All Data</Button>
      </Box>
    </ThemeProvider>
  );
}

export default App;
