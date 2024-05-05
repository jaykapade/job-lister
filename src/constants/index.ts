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
  label: `${index + 1} ${index + 1 === 1 ? "year" : "years"}`,
  value: `${index + 1}`,
}));

const minBaseSalaryOptions = Array.from({ length: 50 }, (_, index) => {
  const value = (index * 5 + 5).toString();
  return { label: `${value} LPA`, value };
});

export { roleOptions, remoteOptions, experienceOptions, minBaseSalaryOptions };
