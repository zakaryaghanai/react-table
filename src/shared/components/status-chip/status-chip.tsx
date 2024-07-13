import {
  Box,
  darken,
  lighten,
  Palette,
  PaletteColor,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { ComponentProps, FC } from "react";

interface StatusShipProps extends ComponentProps<"button"> {
  text: string;
  color: keyof Palette;
}

export const StatusChip: FC<StatusShipProps> = (props) => {
  const { text, color } = props;
  const theme = useTheme();
  const paletteColor = theme.palette[color] as PaletteColor;
  const shipBackground =
    theme.palette.mode === "light"
      ? lighten(paletteColor.main, 0.9)
      : darken(paletteColor.main, 0.3);
  const shipColor =
    theme.palette.mode === "light"
      ? darken(paletteColor.main, 0.2)
      : lighten(paletteColor.main, 0.9);
  return (
    <Stack
      direction={"row"}
      alignItems={"center"}
      gap={1}
      sx={{
        background: shipBackground,
        color: shipColor,
        borderRadius: `${theme.shape.borderRadius}px`,
        width: "max-content",
        padding: "2px 12px",
      }}
    >
      <Box
        sx={{
          width: "6px",
          height: "6px",
          backgroundColor: shipColor,
          borderRadius: "100px",
        }}
      />
      <Typography>{text}</Typography>
    </Stack>
  );
};
