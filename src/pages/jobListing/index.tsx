import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Stack, TextField } from "@mui/material";

import JobItem from "./components/jobItem";
import { JobDetails, JobListResponse } from "../../types";
import EmptyPage from "../../components/EmptyPage";

const roleOptions = [
  {
    label: "Frontend",
    value: "frontend",
  },
  {
    label: "Backend",
    value: "backend",
  },
  {
    label: "IOS",
    value: "ios",
  },
  {
    label: "Android",
    value: "android",
  },
];

const remoteOptions = [
  {
    label: "Remote",
    value: "remote",
  },
  {
    label: "Hybrid",
    value: "hybrid",
  },
  {
    label: "On-site",
    value: "on-site",
  },
];

const experienceOptions = Array.from({ length: 10 }, (_, index) => ({
  label: `${index + 1} years`,
  value: `${index + 1}`,
}));

const minBaseSalaryOptions = Array.from({ length: 50 }, (_, index) => {
  const value = (index * 5 + 5).toString();
  return { label: `${value} LPA`, value };
});

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

  const onFilterChange = (key: string, value: string) => {
    const list = handleListFiltering(key, value, jobList);
    setFilteredJobList(list);
  };

  const handleListFiltering = (
    key: string,
    value: string,
    jobList: JobDetails[]
  ) => {
    // Set the temp job list
    let tempList = [...jobList];

    if (key === "minExperience" || filters["minExperience"]) {
      tempList = tempList.filter((job) => {
        const val =
          key === "minExperience"
            ? parseInt(value)
            : parseInt(filters["minExperience"]);
        return job?.minExp >= (val || 0);
      });
    }
    if (key === "companyName" || filters["companyName"]) {
      tempList = tempList.filter((job) => {
        const companyName = job?.companyName?.toLowerCase();
        const val =
          key === "companyName" ? value?.toLowerCase() : filters["companyName"];
        return companyName.includes(val);
      });
    }
    if (key === "location" || filters["location"]) {
      tempList = tempList.filter((job) => {
        const val = key === "location" ? value : filters["location"];
        return job?.location === val;
      });
    }
    if (key === "remote" || filters["remote"]) {
      const isRemote =
        key === "remote" ? value === "remote" : filters["remote"] === "remote";
      const isHybrid =
        key === "remote" ? value === "hybrid" : filters["remote"] === "hybrid";
      const isOnSite =
        key === "remote"
          ? value === "on-site"
          : filters["remote"] === "on-site";

      if (isRemote)
        tempList = tempList.filter(
          (job) => job?.location?.toLowerCase() === "remote"
        );
      else if (isHybrid)
        tempList = tempList.filter(
          (job) => job?.location?.toLowerCase() === "hybrid"
        );
      else if (isOnSite) {
        tempList = tempList.filter(
          (job) => !["remote", "hybrid"].includes(job?.location?.toLowerCase())
        );
      }
    }
    if (key === "techStack" || filters["techStack"]) {
      //TODO: After checking with API
    }
    if (key === "role" || filters["role"]) {
      tempList = tempList.filter((job) => {
        const val = key === "role" ? value : filters["role"];
        return job?.jobRole?.toLowerCase().includes(val?.toLowerCase());
      });
    }
    if (key === "minBaseSalary" || filters["minBaseSalary"]) {
      tempList = tempList.filter((job) => {
        if (!job?.minJdSalary) return false;
        const minSal =
          key === "minBaseSalary" ? value : filters["minBaseSalary"];
        return job?.minJdSalary >= parseInt(minSal);
      });
      console.log("🚀 ~ temp", "minBaseSalary", tempList);
    }
    console.log("🚀 ~ temp", "tempList", tempList);
    // setting filter values
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
    // return filtered list
    return tempList;
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
      limit: 20,
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

          const list = handleListFiltering(
            "",
            "",
            getUniqueListBy([...filteredJobList, ...res.jdList], "jdUid")
          );
          setFilteredJobList(list);
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
      if (entries[0].isIntersecting) {
        // TODO: uncomment below line when filters are done
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
        <Autocomplete
          sx={selectStyles}
          size="small"
          options={roleOptions}
          value={roleOptions.find((option) => option.value === filters.role)}
          onChange={(_event, newValue) => {
            onFilterChange("role", newValue?.value || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                placeholder: "Role",
              }}
            />
          )}
        />
        <Autocomplete
          sx={selectStyles}
          size="small"
          options={experienceOptions}
          value={experienceOptions.find(
            (option) => option.value === filters.minExperience
          )}
          onChange={(_event, newValue) => {
            onFilterChange("minExperience", newValue?.value || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                placeholder: "Experience",
              }}
            />
          )}
        />
        <Autocomplete
          sx={selectStyles}
          size="small"
          options={remoteOptions}
          value={remoteOptions.find(
            (option) => option.value === filters.remote
          )}
          onChange={(_event, newValue) => {
            onFilterChange("remote", newValue?.value || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                placeholder: "Remote",
              }}
            />
          )}
        />
        <Autocomplete
          sx={selectStyles}
          size="small"
          options={minBaseSalaryOptions}
          value={minBaseSalaryOptions.find(
            (option) => option.value === filters.minBaseSalary
          )}
          onChange={(_event, newValue) => {
            onFilterChange("minBaseSalary", newValue?.value || "");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              InputProps={{
                ...params.InputProps,
                placeholder: "Minimum Base Pay Salary",
              }}
            />
          )}
        />
        <TextField
          placeholder="Search Company Name"
          size="small"
          value={filters.companyName}
          onChange={(e) => onFilterChange("companyName", e.target.value)}
        />
      </Stack>
      {filteredJobList.length === 0 && (
        <EmptyPage
          title="No Jobs Found"
          subTitle="Try changing your filters"
          sx={{ marginTop: 10, mx: "auto" }}
        />
      )}
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
        <Box ref={bottomRef} sx={{ margin: 8 }} />
      </Box>
    </Stack>
  );
};

export default JobListing;
