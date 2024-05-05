import { Box, Button, Link, Stack, Typography } from "@mui/material";
import { JobDetails } from "../../../types";
import { useMemo } from "react";

interface JobItemsProps {
  jobDetails: JobDetails;
}

const JobItem = ({ jobDetails }: JobItemsProps) => {
  const {
    companyName,
    logoUrl,
    jobRole,
    location,
    jobDetailsFromCompany,
    minJdSalary,
    maxJdSalary,
    salaryCurrencyCode,
    jdLink,
    minExp,
  } = jobDetails;

  const esimatedSalaryLabel = useMemo(() => {
    if (minJdSalary && maxJdSalary) {
      return `${salaryCurrencyCode} ${minJdSalary} - ${maxJdSalary} LPA`;
    } else if (minJdSalary) {
      return `${salaryCurrencyCode} ${minJdSalary} LPA (Min.)`;
    } else if (maxJdSalary) {
      return `${salaryCurrencyCode} ${maxJdSalary} LPA (Max.)`;
    } else {
      return "Not Mentioned";
    }
  }, [minJdSalary, maxJdSalary, salaryCurrencyCode]);

  return (
    <Stack
      component={Link}
      href={jdLink}
      target="_blank"
      sx={{
        p: 2,
        gap: 1,
        borderRadius: 2,
        position: "relative",
        color: "inherit",
        textDecoration: "none",
        border: "1px solid lightgray",
        "&:hover": {
          boxShadow: "0px 0px 10px 0px rgba(0,0,0,0.1)",
        },
      }}
    >
      <Stack
        component="section"
        direction="row"
        sx={{
          alignItems: "flex-start",
          justifyContent: "start",
          gap: 1.5,
        }}
      >
        <Box
          component="img"
          sx={{ width: 32, height: 32, borderRadius: "50%" }}
          alt="company logo"
          src={logoUrl || "https://placehold.co/60"}
        />
        <Stack gap={0.2}>
          <Typography
            component="p"
            variant="subtitle2"
            sx={{
              fontWeight: "bold",
              fontSize: "0.8rem",
              color: "gray",
            }}
          >
            {companyName}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
            }}
          >
            {jobRole}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textTransform: "capitalize",
              fontSize: "0.7rem",
            }}
          >
            {location}
          </Typography>
        </Stack>
      </Stack>
      <Typography
        variant="body2"
        sx={{
          color: "gray",
          fontSize: "0.8rem",
        }}
      >
        Estimated Salary: {esimatedSalaryLabel} ✅
      </Typography>
      <Typography
        component="p"
        variant="body2"
        sx={{
          height: 250,
          overflow: "hidden",
          maskImage:
            "linear-gradient(rgb(255, 255, 255), rgb(255, 255, 255), rgba(255, 255, 255, 0));",
        }}
      >
        {jobDetailsFromCompany}
      </Typography>
      <Stack
        component="section"
        sx={{
          gap: 1.5,
        }}
      >
        <Stack gap={0.5}>
          <Typography
            variant="body2"
            sx={{
              color: "darkgray",
              fontWeight: "bold",
            }}
          >
            Minimum Experience
          </Typography>
          <Typography variant="body2">
            {minExp ? `${minExp} Years` : "NA"}
          </Typography>
        </Stack>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#55EFC4",
            color: "black",
            textTransform: "none",
          }}
        >
          ⚡ Easy Apply
        </Button>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#6C48FF",
            textTransform: "none",
          }}
        >
          Unlock Referral asks
        </Button>
      </Stack>
    </Stack>
  );
};

export default JobItem;
