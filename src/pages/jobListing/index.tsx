import { useEffect, useState } from "react";
import { Box, Input, MenuItem, Select, Stack } from "@mui/material";
import { JobDetails, JobListResponse } from "../../types";
import JobItem from "./components/jobItem";

const JobListing = () => {
  const [jobList, setJobList] = useState<JobDetails[]>([]);

  const selectStyles = { flex: 1 };

  useEffect(() => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const body = JSON.stringify({
      limit: 10,
      offset: 0,
    });

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body,
    };

    fetch(
      "https://api.weekday.technology/adhoc/getSampleJdJSON",
      requestOptions
    )
      .then((response) => response.text())
      .then((result) => {
        try {
          const res: JobListResponse = JSON.parse(result);
          setJobList(res.jdList);
        } catch (error) {
          console.error(error);
        }
      })
      .catch((error) => console.error(error));

    return () => {};
  }, []);

  console.log(jobList);

  return (
    <Box
      sx={{
        height: "100vh",
      }}
    >
      <Stack direction="row" component="header">
        <Select
          value={""}
          placeholder="Role"
          onChange={() => {}}
          sx={selectStyles}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          <MenuItem value={10}>Ten</MenuItem>
          <MenuItem value={20}>Twenty</MenuItem>
          <MenuItem value={30}>Thirty</MenuItem>
        </Select>
        <Select placeholder="Number of Employees" sx={selectStyles}></Select>
        <Select placeholder="Experience" sx={selectStyles}></Select>
        <Select placeholder="Remote" sx={selectStyles}></Select>
        <Select placeholder="Minimum Base Salary" sx={selectStyles}></Select>
        <Input placeholder="Search Company Name" />
      </Stack>
      <Box
        sx={{
          display: "grid",
          height: "100%",
          width: "100%",
          overflow: "auto",
          gap: 2,
          p: 2,
          gridTemplateColumns: {
            lg: "1fr 1fr 1fr 1fr",
            md: "1fr 1fr 1fr",
            sm: "1fr 1fr",
            xs: "1fr",
          },
        }}
      >
        {jobList.map((job) => (
          <JobItem jobDetails={job} />
        ))}
      </Box>
    </Box>
  );
};

export default JobListing;
