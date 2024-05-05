import { useEffect, useRef, useState } from "react";
import { Autocomplete, Box, Stack, TextField } from "@mui/material";

import JobItem from "./components/jobItem";
import EmptyPage from "../../components/EmptyPage";

import ArrowDown from "../../assets/svgs/arrow_down.svg";
import { JobDetails, JobListResponse } from "../../types";
import {
  experienceOptions,
  minBaseSalaryOptions,
  remoteOptions,
  roleOptions,
} from "../../constants";

const JobListing = () => {
  const hasMounted = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState(0);
  const [totalRecords, setTotalRecords] = useState(10);
  const [loading, setLoading] = useState(false);
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

  const selectProps: {
    size: "small" | "medium";
    sx: { flex: number };
    popupIcon: JSX.Element;
  } = {
    size: "small",
    sx: { flex: 1 },
    popupIcon: (
      <Box component="img" src={ArrowDown} alt="arrow" sx={{ width: 24 }} />
    ),
  };

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
      const valStr = key === "remote" ? value : filters["remote"];
      const valArr = valStr?.split(",");

      const isRemote = valArr.includes("remote");
      const isHybrid = valArr.includes("hybrid");
      const isOnSite = valArr.includes("on-site");

      if ((isRemote || isHybrid) && !isOnSite)
        tempList = tempList.filter((job) => {
          return valArr?.includes(job?.location?.toLowerCase());
        });

      if (isOnSite && !isRemote && !isHybrid)
        tempList = tempList.filter((job) => {
          return !["remote", "hybrid"]?.includes(job?.location?.toLowerCase());
        });
    }
    if (key === "techStack" || filters["techStack"]) {
      //TODO: After checking with API
    }
    if (key === "role" || filters["role"]) {
      tempList = tempList.filter((job) => {
        const valStr = key === "role" ? value : filters["role"];
        const valArr = valStr?.split(",");
        return valArr?.includes(job?.jobRole?.toLowerCase());
      });
    }
    if (key === "minBaseSalary" || filters["minBaseSalary"]) {
      tempList = tempList.filter((job) => {
        if (!job?.minJdSalary) return false;
        const minSal =
          key === "minBaseSalary" ? value : filters["minBaseSalary"];
        return job?.minJdSalary >= parseInt(minSal);
      });
    }
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
    if (loading || offset >= totalRecords) return;

    setLoading(true);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const body = JSON.stringify({
      // Loading 30 initially and then 10 at a time
      limit: hasMounted.current ? 10 : 30,
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
          setTotalRecords(res.totalCount);
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
        setOffset((prev) => prev + 10);
      }
    });
    if (bottomRef.current) observer.observe(bottomRef.current);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    fetchJobList(offset);
  }, [offset]);

  return (
    <Stack
      sx={{
        height: "100vh",
        p: 2,
        gap: 2,
      }}
    >
      <Stack
        direction="row"
        component="header"
        sx={{
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Autocomplete
          multiple
          options={roleOptions}
          value={roleOptions.filter((option) => {
            const valArr = filters.role?.split(",");
            return valArr?.includes(option.value);
          })}
          {...selectProps}
          onChange={(_event, newValue) => {
            const valStr = newValue.map((val) => val.value).join(",");
            onFilterChange("role", valStr || "");
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
          {...selectProps}
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
          multiple
          {...selectProps}
          options={remoteOptions}
          value={remoteOptions.filter((option) => {
            const valArr = filters.remote?.split(",");
            return valArr?.includes(option.value);
          })}
          onChange={(_event, newValue) => {
            const valStr = newValue.map((val) => val.value).join(",");
            onFilterChange("remote", valStr || "");
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
          {...selectProps}
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
