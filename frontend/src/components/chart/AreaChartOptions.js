const areaChartOptions = {
  chart: {
    width: "100%",
    height: 350,
    type: "area",
    toolbar: {
      show: true,
    },
  },
  legend: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
  },

  yaxis: {
    labels: {
      style: {
        colors: "#8e8da4",
      },
      offsetX: 0,
      formatter: function (val) {
        return val;
      },
    },
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
  },
  xaxis: {
    type: "datetime",
    labels: {
      style: {
        fontSize: "14px",
        fontWeight: 600,
      },
    },
    min: new Date("12/01/2022").getTime(),
    max: new Date("09/22/2023").getTime(),
  },
  annotations: {
    yaxis: [
      {
        y: 1.5,
        borderColor: "#00E396",
        label: {
          borderColor: "#00E396",
          style: {
            color: "#fff",
            background: "#00E396",
          },
          text: "Threshold = 1.5",
        },
      },
    ],
  },
};

export default areaChartOptions;
