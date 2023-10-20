const secondBarChartOptions = {
  chart: {
    type: "bar",
  },
  dataLabels: {
    enabled: true,
    offsetX: -6,
    style: {
      fontSize: "12px",
      colors: ["#fff"],
    },
  },
  stroke: {
    show: true,
    width: 1,
    colors: ["#fff"],
  },
  tooltip: {
    shared: true,
    intersect: false,
  },
  xaxis: {
    categories: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
};

export default secondBarChartOptions;
