import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Card, Statistic, Segmented } from "antd";
import Chart from "react-apexcharts";
import chartFormatter from "../../../utils/chartFormatter";
import mock from "../../../utils/mock";
import getLineChartOptions from "../../../components/chart/LineChartOptions";

const weekDayList = ["星期一", "星期二", "星期三", "星期四", "星期五"];

// Tabs

const zoneOptions = [
  {
    value: "All",
    label: "All",
    key: "All",
  },
  {
    value: "AZ",
    label: "AZ",
    key: "AZ",
  },
  {
    value: "HQ",
    label: "HQ",
    key: "HQ",
  },
];

const tabOnChange = (key) => {
  console.log(key);
};

function AttendanceDashboard() {
  const [loading, setLoading] = useState(true);
  const [weekLateEntryList, setWeekLateEntryList] = useState();

  useEffect(() => {
    mock.fetchWeekContrabandHis().then((res) => {
      setWeekLateEntryList(res);
      setLoading(false);
    });
  }, []);
  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        {/* <Tabs defaultActiveKey="1" items={zoneOptions} onChange={tabOnChange} /> */}
        <Segmented
          size="large"
          options={["All", "AZ", "HQ"]}
          onChange={tabOnChange}
        />
      </Col>
      <Col span={6}>
        <Card span={6}>
          <Row gutter={[5, 5]}>
            <Col span={12}>
              <Statistic title="員工人數" value={112893} />
            </Col>
            <Col span={12}>
              <Statistic title="入廠人數" value={112893} />
            </Col>
            <Col span={12}></Col>
            <Col span={12}>
              <Statistic title="遲到人數" value={112893} />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={18}>
        <Card>
          <Chart
            type="line"
            width="100%"
            options={getLineChartOptions(weekDayList, "遲到人數統計")}
            series={chartFormatter.countData(weekLateEntryList)}
          />
        </Card>
      </Col>
    </Row>
  );
}
export default AttendanceDashboard;
