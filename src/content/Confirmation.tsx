import { useState } from "react";
import { Box, Button, Popover, Slider, Stack, Typography } from "@mui/material";
import { receiveConfirmation } from "./process";

const Confirmation: React.FC<{ anchor: HTMLElement }> = ({ anchor }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(anchor);
  const [customizationEnabled, setCustomizationEnabled] = useState(false);
  const [scale, setScale] = useState(150);

  const handleEnableCustomization = () => {
    receiveConfirmation(anchorEl!, {
      enabled: true,
      type: "scale",
      value: scale / 100,
    });
    setAnchorEl(null);
  };

  const handleYes = () => {
    setCustomizationEnabled(true);
  };

  const handleNo = () => {
    receiveConfirmation(anchorEl!, {
      enabled: false,
    });
    setAnchorEl(null);
  };

  return (
    <Popover
      id="grogu-popover"
      sx={{
        ".MuiPaper-root": {
          mt: 1.5,
        },
      }}
      open={anchorEl ? true : false}
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      {customizationEnabled ? (
        <Box sx={{ p: 2, width: 300 }}>
          <Typography>How much bigger do you want?</Typography>
          <Stack spacing={1} direction="row" sx={{ my: 2 }} alignItems="center">
            <Typography>100%</Typography>
            <Slider
              defaultValue={150}
              min={100}
              max={300}
              valueLabelDisplay="auto"
              value={scale}
              onChange={(e, value) => setScale(value as number)}
            />
            <Typography>300%</Typography>
          </Stack>
          <Button fullWidth onClick={handleEnableCustomization}>
            Ok
          </Button>
        </Box>
      ) : (
        <Box sx={{ p: 2, width: 200 }}>
          <Typography>
            You seem to click this element a lot. Would you like it to be
            bigger? 😀
          </Typography>
          <Box
            sx={{
              mt: 1,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-around",
            }}
          >
            <Button onClick={handleNo}>No</Button>
            <Button onClick={handleYes}>Yes</Button>
          </Box>
        </Box>
      )}
    </Popover>
  );
};

export default Confirmation;
