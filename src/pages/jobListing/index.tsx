import { useEffect, useRef, useState } from "react";
import { Box, Input, MenuItem, Select, Stack } from "@mui/material";
import { JobDetails, JobListResponse } from "../../types";
import JobItem from "./components/jobItem";

const JobListing = () => {
  const hasMounted = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [jobList, setJobList] = useState<JobDetails[]>([]);
  const [filteredJobList, setFilteredJobList] = useState<JobDetails[]>([]);
  const [filters, setFilters] = useState({
    minExperience: "",
    companyName: "",
    location: "",
    remote: "",
    techStack: "",
    role: "",
    minBaseSalary: "",
  });

  const selectStyles = { flex: 1 };

  const handleFilterChange = (key: string, value: string) => {
    let tempList = [...jobList];
    console.log("🚀 ~ temp before tempList:", tempList, key, value);

    if (key === "minExperience" || filters["minExperience"]) {
      tempList = tempList.filter((job) => job?.minExp <= parseInt(value));
      console.log("🚀 ~ temp", "minExperience", tempList);
    }
    if (key === "companyName" || filters["companyName"]) {
      tempList = tempList.filter((job) =>
        job?.companyName?.toLowerCase().includes(value?.toLowerCase())
      );
      console.log("🚀 ~ temp", "companyName", tempList);
    }
    if (key === "location" || filters["location"]) {
      tempList = tempList.filter((job) => job?.location === value);
      console.log("🚀 ~ temp", "location", tempList);
    }
    if (key === "remote" || filters["remote"]) {
      if (value === "remote")
        tempList = tempList.filter(
          (job) => job?.location?.toLowerCase() === "remote"
        );
      else
        tempList = tempList.filter(
          (job) => job?.location?.toLowerCase() !== "remote"
        );
      console.log("🚀 ~ temp", "remote", tempList);
    }
    if (key === "techStack" || filters["techStack"]) {
      //TODO: After checking with API
    }
    if (key === "role" || filters["role"]) {
      tempList = tempList.filter((job) =>
        job?.jobRole.toLowerCase().includes(value.toLowerCase())
      );
      console.log("🚀 ~ temp", "role", filters["role"], tempList);
    }
    if (key === "minBaseSalary" || filters["minBaseSalary"]) {
      tempList = tempList.filter((job) =>
        job?.minJdSalary ? job?.minJdSalary <= parseInt(value) : true
      );
      console.log("🚀 ~ temp", "minBaseSalary", tempList);
    }
    console.log("🚀 ~ temp", "tempList", tempList);
    // setting filter values
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    // setting filtered list
    setFilteredJobList(tempList);
  };
  const getUniqueListBy = (arr: JobDetails[], key: keyof JobDetails) => {
    return [...new Map(arr.map((item) => [item[key], item])).values()];
  };

  const fetchJobList = (offset: number) => {
    setLoading(true);
    console.log("🚀 ~ fetchJobList", offset);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const body = JSON.stringify({
      limit: 10,
      offset,
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
          setJobList((prev) =>
            getUniqueListBy([...prev, ...res.jdList], "jdUid")
          );
          setFilteredJobList((prev) =>
            getUniqueListBy([...prev, ...res.jdList], "jdUid")
          );
        } catch (error) {
          console.error(error);
        }
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
        hasMounted.current = true;
      });
  };

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMounted.current) {
        setOffset((prev) => prev + 10);
        console.log("bottom reached");
      }
    });
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchJobList(offset);
  }, [offset]);

  console.log(filteredJobList);

  return (
    <Stack
      sx={{
        height: "100vh",
        p: 2,
        gap: 2,
      }}
    >
      <Stack direction="row" component="header" gap={2}>
        <Select
          value={filters.role}
          placeholder="Role"
          onChange={(e) => handleFilterChange("role", e.target.value)}
          size="small"
          sx={selectStyles}
        >
          <MenuItem value="frontend">Frontend</MenuItem>
          <MenuItem value="backend">Backend</MenuItem>
          <MenuItem value="fullstack">Fullstack</MenuItem>
          <MenuItem value="android">Android</MenuItem>
        </Select>
        <Select
          placeholder="Experience"
          sx={selectStyles}
          size="small"
          value={filters.minExperience}
          onChange={(e) => handleFilterChange("minExperience", e.target.value)}
        >
          <MenuItem value="1">1</MenuItem>
          <MenuItem value="2">2</MenuItem>
          <MenuItem value="3">3</MenuItem>
          <MenuItem value="4">4</MenuItem>
          <MenuItem value="5">5</MenuItem>
        </Select>
        <Select
          placeholder="Remote"
          sx={selectStyles}
          size="small"
          value={filters.remote}
          onChange={(e) => handleFilterChange("remote", e.target.value)}
        >
          <MenuItem value="remote">Remote</MenuItem>
          <MenuItem value="onsite">Onsite</MenuItem>
        </Select>
        <Select placeholder="Minimum Base Salary" sx={selectStyles}></Select>
        <Input
          placeholder="Search Company Name"
          size="small"
          value={filters.companyName}
          onChange={(e) => handleFilterChange("companyName", e.target.value)}
        />
      </Stack>
      <Box
        sx={{
          display: "grid",
          width: "100%",
          overflow: "auto",
          gap: 2,
          gridTemplateColumns: {
            lg: "1fr 1fr 1fr 1fr",
            md: "1fr 1fr 1fr",
            sm: "1fr 1fr",
            xs: "1fr",
          },
        }}
      >
        {filteredJobList.map((job) => (
          <JobItem jobDetails={job} key={job.jdUid} />
        ))}
        {loading && <p className="text-center">loading...</p>}
        <Box ref={bottomRef} sx={{ margin: 4 }} />
      </Box>
    </Stack>
  );
};

export default JobListing;
