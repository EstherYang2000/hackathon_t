import scanHis from "./data/ScanHist";
import contrabandHis from "./data/Contraband";
import entryHis from "./data/Entry";
import result from "./data/Result";
import entryStatis from "./data/EntryStatis";
import deptEntry from "./data/DeptEntry";
import weekDeptEntryHis from "./data/WeekDeptEntryHis";
import weekContrabandHis from "./data/WeekContrabandHis";

const fetchScanHis = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = scanHis;
      resolve(mockData);
    }, 0);
  });
};

const fetchContrabandHis = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = contrabandHis;
      resolve(mockData);
    }, 0);
  });
};

const fetchEntryHis = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = entryHis;
      resolve(mockData);
    }, 0);
  });
};

const fetchContrabandHisInfo = (idx) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = contrabandHis.find((x) => x.Index.toString() === idx);
      resolve(mockData);
    }, 0);
  });
};

const fetchScanResult = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = result;
      resolve(mockData);
    }, 0);
  });
};

const fetchEntryStatis = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = entryStatis;
      resolve(mockData);
    }, 0);
  });
};

const fetchDeptEntry = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = deptEntry;
      resolve(mockData);
    }, 0);
  });
};

const fetchWeekDeptEntry = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = weekDeptEntryHis;
      resolve(mockData);
    }, 0);
  });
};

const fetchWeekContrabandHis = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = weekContrabandHis;
      resolve(mockData);
    }, 0);
  });
};

const fetchContrabandHisByItem = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const mockData = weekContrabandHis;
      resolve(mockData);
    }, 0);
  });
};

export default {
  fetchScanHis,
  fetchContrabandHis,
  fetchEntryHis,
  fetchContrabandHisInfo,
  fetchScanResult,
  fetchEntryStatis,
  fetchDeptEntry,
  fetchWeekDeptEntry,
  fetchWeekContrabandHis,
  fetchContrabandHisByItem,
};
