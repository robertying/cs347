import { useState } from "react";
import { Box, Button, Card, Slider, Stack, Typography } from "@mui/material";
import { usePopper } from "react-popper";
import { ChromePicker } from "react-color";
import { receiveConfirmation } from "./process";

const Confirmation: React.FC<{
  anchor: HTMLElement;
  anchorStyle: {
    border: string;
    borderRadius: string;
  };
}> = ({ anchor, anchorStyle }) => {
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    anchor
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);
  const { styles, attributes, update } = usePopper(
    referenceElement,
    popperElement,
    {
      modifiers: [
        {
          name: "preventOverflow",
          options: {
            padding: 8,
          },
        },
        {
          name: "flip",
          options: {
            fallbackPlacements: ["top"],
          },
        },
      ],
    }
  );

  const [customizationEnabled, setCustomizationEnabled] = useState(false);
  const [scale, setScale] = useState(150);
  const [fontSize, setFontSize] = useState(100);
  const initialColor = window.getComputedStyle(anchor).color;
  const [color, setColor] = useState(initialColor);

  const handleEnableCustomization = () => {
    receiveConfirmation(anchor, anchorStyle, {
      enabled: true,
      items: [
        {
          type: "scale",
          value: scale / 100,
        },
        {
          type: "fontSize",
          value: fontSize / 100,
        },
        {
          type: "color",
          value: color,
        },
      ],
    });
    setReferenceElement(null);
  };

  const handleYes = () => {
    setCustomizationEnabled(true);
    update?.();
  };

  const handleNo = () => {
    receiveConfirmation(anchor, anchorStyle, {
      enabled: false,
    });
    setReferenceElement(null);
  };

  if (!referenceElement) {
    return null;
  }

  return (
    <Card
      id="grogu-confirmation-popover"
      sx={{
        mt: 1,
        zIndex: 99999,
      }}
      elevation={4}
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
    >
      {customizationEnabled ? (
        <Box sx={{ p: 2, width: 300 }}>
          <Typography>How much bigger do you want?</Typography>
          <Typography sx={{ mt: 2 }}>Element Size</Typography>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>100%</Typography>
            <Slider
              min={100}
              max={200}
              valueLabelDisplay="auto"
              value={scale}
              onChange={(e, value) => setScale(value as number)}
            />
            <Typography>200%</Typography>
          </Stack>
          <Typography sx={{ mt: 2 }}>Font Size</Typography>
          <Stack spacing={2} direction="row" alignItems="center">
            <Typography>100%</Typography>
            <Slider
              min={100}
              max={200}
              valueLabelDisplay="auto"
              value={fontSize}
              onChange={(e, value) => setFontSize(value as number)}
            />
            <Typography>200%</Typography>
          </Stack>
          <Typography sx={{ mt: 2 }}>Text Color</Typography>
          <Button sx={{ my: 0.5 }} onClick={() => setColor(initialColor)}>
            Reset
          </Button>
          <Box
            sx={{
              "& .chrome-picker": {
                mx: "auto",
                boxShadow: "none !important",
              },
            }}
          >
            <ChromePicker color={color} onChange={(c) => setColor(c.hex)} />
          </Box>
          <Button sx={{ mt: 2 }} fullWidth onClick={handleEnableCustomization}>
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
    </Card>
  );
};

export default Confirmation;
