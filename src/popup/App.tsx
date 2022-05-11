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
  Divider,
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
          width: 250,
          height: 300,
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{ my: 1, width: 128, height: 128 }}
          component="img"
          src="/logo-128.png"
          alt="Grogu"
        />
        <Button sx={{ mt: "auto" }} onClick={handleExportData}>
          Export Data To Clipboard
        </Button>
        <Divider sx={{ my: 1 }} flexItem variant="middle" />
        <Button color="error" onClick={handleClearWebsiteData}>
          Clear Website Data
        </Button>
        <Button color="error" onClick={handleClearAllData}>
          Clear All Data
        </Button>
      </Box>
    </ThemeProvider>
  );
}

export default App;
