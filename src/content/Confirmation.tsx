import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  Slider,
  Stack,
  ToggleButton,
  Typography,
  useTheme,
} from "@mui/material";
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
  const theme = useTheme();

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

  const initialStyle = useMemo(
    () => ({ ...window.getComputedStyle(anchor) }),
    [anchor]
  );

  const [customizationEnabled, setCustomizationEnabled] = useState(false);
  const [scale, setScale] = useState(150);
  const [fontSize, setFontSize] = useState(100);
  const [color, setColor] = useState(initialStyle.color);
  const [backgroundColor, setBackgroundColor] = useState(
    initialStyle.backgroundColor
  );
  const [colorMode, setColorMode] = useState<"color" | "backgroundColor">(
    "color"
  );

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
        {
          type: "backgroundColor",
          value: backgroundColor,
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

  const handleReset = () => {
    setScale(150);
    setFontSize(100);
    setColor(initialStyle.color);
    setBackgroundColor(initialStyle.backgroundColor);
  };

  useEffect(() => {
    if (!customizationEnabled) {
      return;
    }

    anchor.style.transform = `scale(${scale / 100})`;
    anchor.style.fontSize = `calc(${initialStyle.fontSize} * ${
      fontSize / 100
    })`;
    anchor.style.setProperty("color", color, "important");
    anchor.style.setProperty("background-color", backgroundColor, "important");
  }, [
    customizationEnabled,
    scale,
    fontSize,
    color,
    backgroundColor,
    anchor,
    initialStyle,
  ]);

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
          <Stack
            sx={{ mt: 2 }}
            direction="row"
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography>Text Color</Typography>
            <ToggleButton
              sx={{
                backgroundColor: `${
                  color === "rgba(0, 0, 0, 0)"
                    ? theme.palette.text.primary
                    : color
                } !important`,
                background:
                  color === "rgba(0, 0, 0, 0)"
                    ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center'
                    : undefined,
                borderWidth: "0.25rem",
                borderColor:
                  colorMode === "color"
                    ? theme.palette.primary.main
                    : theme.palette.primary.light,
                width: "1rem",
                height: "1rem",
              }}
              value="color"
              selected={colorMode === "color"}
              onClick={() => setColorMode("color")}
            />
          </Stack>
          <Stack
            sx={{ mt: 2 }}
            direction="row"
            spacing={2}
            justifyContent="flex-start"
            alignItems="center"
          >
            <Typography>Background Color</Typography>
            <ToggleButton
              sx={{
                backgroundColor: `${
                  backgroundColor === "rgba(0, 0, 0, 0)"
                    ? theme.palette.text.primary
                    : backgroundColor
                } !important`,
                background:
                  backgroundColor === "rgba(0, 0, 0, 0)"
                    ? 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAADFJREFUOE9jZGBgEGHAD97gk2YcNYBhmIQBgWSAP52AwoAQwJvQRg1gACckQoC2gQgAIF8IscwEtKYAAAAASUVORK5CYII=") left center'
                    : undefined,
                borderWidth: "0.25rem",
                borderColor:
                  colorMode === "backgroundColor"
                    ? theme.palette.primary.main
                    : theme.palette.primary.light,
                width: "1rem",
                height: "1rem",
              }}
              value="backgroundColor"
              selected={colorMode === "backgroundColor"}
              onClick={() => setColorMode("backgroundColor")}
            />
          </Stack>
          <Box
            sx={{
              mt: 2,
              "& .chrome-picker": {
                mx: "auto",
                boxShadow: "none !important",
              },
            }}
          >
            <ChromePicker
              color={colorMode === "color" ? color : backgroundColor}
              onChange={(c) =>
                colorMode === "color"
                  ? setColor(
                      `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${
                        c.rgb.a ?? 1
                      })`
                    )
                  : setBackgroundColor(
                      `rgba(${c.rgb.r}, ${c.rgb.g}, ${c.rgb.b}, ${
                        c.rgb.a ?? 1
                      })`
                    )
              }
            />
          </Box>
          <Stack
            sx={{ mt: 2 }}
            direction="row"
            spacing={2}
            justifyContent="space-between"
          >
            <Button fullWidth onClick={handleReset}>
              Reset
            </Button>
            <Button fullWidth onClick={handleEnableCustomization}>
              Ok
            </Button>
          </Stack>
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
