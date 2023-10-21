const countData = (dataList, count_label) => {
  if ((dataList === undefined) | !Array.isArray(dataList)) {
    return [];
  }
  const data = dataList.map((item) => item[count_label]);
  return [
    {
      name: "總數",
      data: data,
    },
  ];
};

const groupZone = (dataList, count_label) => {
  if (dataList === undefined) {
    return [];
  }
  const groupedData = dataList.reduce((acc, item) => {
    if (!acc[item.zone]) {
      acc[item.zone] = [];
    }
    acc[item.zone].push(item[count_label]);
    return acc;
  }, {});

  const series = Object.keys(groupedData).map((zone) => ({
    name: zone,
    data: groupedData[zone],
  }));
  return series;
};

export default { countData, groupZone };
