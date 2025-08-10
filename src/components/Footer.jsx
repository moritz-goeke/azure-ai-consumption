import { Box, Typography } from "@mui/material";

export default function Footer() {
  return (
    <FooterLine sxObject={{ mt: 1 }}>{new Date().getFullYear()}</FooterLine>
  );
}

export function FooterLine({ children, sxObject = {}, typographySx = {} }) {
  return (
    <Box
      sx={{
        width: 1,
        display: "flex",
        justifyContent: "center",
        ...sxObject,
      }}
    >
      <Typography
        align="center"
        sx={{
          userSelect: "none",
          justifySelf: "center",
          fontFamily: "Inconsolata",
          fontSize: 11,
          ...typographySx,
        }}
      >
        {children}
      </Typography>
    </Box>
  );
}
