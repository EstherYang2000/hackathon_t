const countData = (dataList) => {
  if ((dataList === undefined) | !Array.isArray(dataList)) {
    return [];
  }
  const data = dataList.map((item) => item.Count);
  return [
    {
      name: "總數",
      data: data,
    },
  ];
};

const groupZone = (dataList) => {
  if (dataList === undefined) {
    return [];
  }
  const groupedData = dataList.reduce((acc, item) => {
    if (!acc[item.Zone]) {
      acc[item.Zone] = [];
    }
    acc[item.Zone].push(item.Count);
    return acc;
  }, {});

  const series = Object.keys(groupedData).map((zone) => ({
    name: zone,
    data: groupedData[zone],
  }));
  return series;
};

export default { countData, groupZone };
