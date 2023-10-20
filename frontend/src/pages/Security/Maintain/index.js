import React, { useState, useEffect } from "react";
import { Col, Row, Table, Card } from "antd";
import mock from "../../../utils/mock";

import ReactApexChart from "react-apexcharts";
import areaChartOptions from "../../../components/chart/AreaChartOptions";

// Table
const columns = [
  {
    title: "時間",
    dataIndex: "DateTime",
  },
  {
    title: "掃描時間",
    dataIndex: "ToolScanTime",
  },
  {
    title: "Zone",
    dataIndex: "Zone",
  },
];

// Chart
const processData = (data) => {
  if (data === undefined) {
    return [];
  }
  const datasets = [];
  const uniqueZones = [...new Set(data.map((item) => item.Zone))];
  uniqueZones.forEach((zone, index) => {
    const dataForZone = data.filter((item) => item.Zone === zone);

    const dataset = {
      name: zone,
      data: dataForZone.map((item) => ({
        x: new Date(item.DateTime).getTime(),
        y: parseFloat(item.ToolScanTime),
      })),
    };

    datasets.push(dataset);
  });
  return datasets;
};

const Maintain = () => {
  const [scanHis, setScanHis] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // var url = "scanHis";
    // api.get(url).then(res => {
    //     setScanHis(res)
    //     setLoading(false)
    // })
    mock.fetchScanHis().then((res) => {
      setScanHis(res);
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <Row gutter={[16, 16]}>
        <Col span={12} style={{ alignSelf: "center" }}>
          <ReactApexChart
            className="full-width"
            options={areaChartOptions}
            series={processData(scanHis)}
            type="area"
            height="300px"
            width="100%"
          />
        </Col>
        <Col span={12}>
          <Table
            dataSource={scanHis}
            columns={columns}
            loading={loading}
            rowKey="DateTime"
          />
        </Col>
      </Row>
    </Card>
  );
};
export default Maintain;
