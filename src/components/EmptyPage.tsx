import { Box, Stack, SxProps, Theme, Typography } from "@mui/material";
import NotFound from "../assets/svgs/not_found.svg";

type Props = {
  title: string;
  subTitle: string;
  sx?: SxProps<Theme>;
};

const EmptyPage = ({ title, subTitle, sx }: Props) => {
  return (
    <Stack
      sx={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        ...sx,
      }}
    >
      <Box
        component="img"
        src={NotFound}
        alt="empty icon"
        sx={{
          width: 160,
          height: 160,
          mb: 2,
        }}
      />
      <Typography variant="h5">{title}</Typography>
      <Typography
        variant="body1"
        sx={{
          color: "darkgray",
        }}
      >
        {subTitle}
      </Typography>
    </Stack>
  );
};

export default EmptyPage;
