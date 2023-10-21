import result from "./data/Result";
import attendanceLLMResult from "./data/AttendenceLLM";
import securityLLMResult from "./data/SecurityLLM";

const fetchScanResult = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = result;
      resolve(mockData);
    }, 0);
  });
};

const fetchAttendanceLLMResult = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = attendanceLLMResult;
      resolve(mockData);
    }, 0);
  });
};

const fetchSecurityLLMResult = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = securityLLMResult;
      resolve(mockData);
    }, 0);
  });
};

export default {
  fetchScanResult,
  fetchAttendanceLLMResult,
  fetchSecurityLLMResult,
};
