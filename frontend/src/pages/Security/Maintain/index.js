import React, { useState, useEffect } from "react";
import { Col, Row, Table, Card } from "antd";
import ReactApexChart from "react-apexcharts";
import areaChartOptions from "../../../components/chart/AreaChartOptions";
import mock from "../../../utils/mock";
import api from "../../../utils/api";

// Table
const columns = [
  {
    title: "時間",
    dataIndex: "dateTime",
  },
  {
    title: "掃描時間",
    dataIndex: "scanTime",
  },
  {
    title: "廠區",
    dataIndex: "zone",
  },
];

// Chart
const processData = (data) => {
  if (data === undefined) {
    return [];
  }
  const datasets = [];

  const uniqueZones = ["AZ_predict", "AZ_real", "HQ_predict", "HQ_real"];
  uniqueZones.forEach((zone) => {
    // const dataForZone = data.filter((item) => item.Zone === zone);
    const dataForZone = data[zone];
    const dataset = {
      name: zone,
      data: dataForZone.map((item) => ({
        x: new Date(item.dateTime),
        y: parseFloat(item.scanTime),
      })),
    };

    datasets.push(dataset);
  });
  return datasets;
};

const Maintain = () => {
  const [scanHis, setScanHis] = useState();
  const [tableData, setTableData] = useState();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    var url = "analysis";
    const tableZone = ["AZ_real", "HQ_real"];

    const tableData = [];
    api
      .get(url)
      .then((res) => {
        setScanHis(res);

        res["AZ_real"].forEach((item) => {
          tableData.push({
            dateTime: item.dateTime,
            scanTime: item.scanTime,
            zone: "AZ",
          });
        });

        res["HQ_real"].forEach((item) => {
          tableData.push({
            dateTime: item.dateTime,
            scanTime: item.scanTime,
            zone: "HQ",
          });
        });
        setTableData(tableData);
        setLoading(false);
      })
      .catch((error) => {
        setScanHis(null);
        // setLoading(false);
      });
  }, []);

  return (
    <Card>
      {!scanHis ? (
        <p>Loading</p>
      ) : (
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ alignSelf: "center" }}>
            <ReactApexChart
              className="full-width"
              options={areaChartOptions}
              series={processData(scanHis)}
              type="area"
              height="300px"
              width="100%"
            />
          </Col>
          <Col span={24}>
            <Table
              dataSource={tableData}
              columns={columns}
              loading={loading}
              rowKey="DateTime"
            />
          </Col>
        </Row>
      )}
    </Card>
  );
};
export default Maintain;
