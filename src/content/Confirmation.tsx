import { useState } from "react";
import { Box, Button, Popover, Typography } from "@mui/material";
import { receiveConfirmation } from "./process";

const Confirmation: React.FC<{ anchor: HTMLElement }> = ({ anchor }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(anchor);

  const handleYes = () => {
    receiveConfirmation(anchorEl!, true);
    setAnchorEl(null);
  };

  const handleNo = () => {
    receiveConfirmation(anchorEl!, false);
    setAnchorEl(null);
  };

  return (
    <Popover
      sx={{
        ".MuiPaper-root": {
          mt: 1,
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
      <Box sx={{ p: 2, width: 200 }}>
        <Typography>
          You seem to click this element a lot. Would you like it to be bigger?
          😀
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
    </Popover>
  );
};

export default Confirmation;
