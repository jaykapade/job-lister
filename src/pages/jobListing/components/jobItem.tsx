import { Box, Stack, Typography } from "@mui/material";
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
      return `Min.${salaryCurrencyCode} ${minJdSalary} LPA`;
    } else if (maxJdSalary) {
      return `${salaryCurrencyCode} ${maxJdSalary} LPA`;
    } else {
      return "Not Mentioned";
    }
  }, [minJdSalary, maxJdSalary, salaryCurrencyCode]);

  return (
    <Stack sx={{ p: 2, borderRadius: 2, border: "1px solid lightgray" }}>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          justifyContent: "start",
          gap: 1,
        }}
      >
        <Box
          component="img"
          sx={{ width: 32, height: 32, borderRadius: "50%" }}
          alt=""
          src={logoUrl}
        />
        <Stack>
          <Box component="p">{companyName}</Box>
          <Box component="p">{jobRole}</Box>
          <Box component="p">{location}</Box>
        </Stack>
      </Stack>
      <Typography variant="body2">
        Estimated Salary: {esimatedSalaryLabel}
      </Typography>
      <Typography variant="body2">{jobDetailsFromCompany}</Typography>
    </Stack>
  );
};

export default JobItem;
