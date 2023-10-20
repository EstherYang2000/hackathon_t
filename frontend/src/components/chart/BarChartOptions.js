const getBarChartOptions = (x_categories, title = "") => {
  return {
    chart: {
      type: "bar",
    },
    dataLabels: {
      enabled: true,
      offsetX: -4,
      style: {
        fontSize: "12px",
        colors: ["#fff"],
      },
    },
    title: {
      text: title,
      align: "left",
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
      categories: x_categories,
    },
  };
};
export default getBarChartOptions;
