import React, { useState, useEffect } from "react";
import { Row, Col, Form, DatePicker, Card } from "antd";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import mock from "../../../utils/mock";
import getBarChartOptions from "../../../components/chart/BarChartOptions";
import getLineChartOptions from "../../../components/chart/LineChartOptions";
import chartFormatter from "../../../utils/chartFormatter";

// Search Bar
const weekFormat = "MM/DD";
const weekDayList = ["星期一", "星期二", "星期三", "星期四", "星期五"];

const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;

const SearchForm = () => {
  const form = Form.useFormInstance();
  // TODO - fetch from data
  return (
    <div style={{ display: "contents" }}>
      <Form.Item name="dateRange" initialValue={dayjs()}>
        <DatePicker picker="week" format={customWeekStartEndFormat} />
      </Form.Item>
    </div>
  );
};

// Chart

const itemList = [
  {
    name: "電子設備",
    dataIndex: "0",
  },
  {
    name: "筆記型電腦",
    dataIndex: "1",
  },
  {
    name: "剪刀",
    dataIndex: "2",
  },
  {
    name: "刀",
    dataIndex: "3",
  },
  {
    name: "槍枝",
    dataIndex: "4",
  },
];

const SecurityReport = () => {
  const [loading, setLoading] = useState(true);
  const [contrabandHis, setContrabandHis] = useState();
  const [contrabandHis_1, setContrabandHis_1] = useState();

  useEffect(() => {
    mock.fetchWeekContrabandHis().then((res) => {
      setContrabandHis(res);
    });
    mock.fetchContrabandHisByItem().then((res) => {
      setContrabandHis_1(res);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "16px 16px" }}>
      <Form layout="inline" style={{ padding: "0 0 16px 0" }}>
        <SearchForm />
      </Form>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>週報說...</Card>
        </Col>
        <Col span={15}>
          <Card>
            <Chart
              type="bar"
              width="100%"
              options={getBarChartOptions(weekDayList)}
              series={chartFormatter.countData(contrabandHis)}
            />
          </Card>
        </Col>
        <Col span={9}>
          {itemList.map((item) => (
            <Col span={24}>
              <Card>
                <Chart
                  type="line"
                  width="100%"
                  options={getLineChartOptions(weekDayList, item.name)}
                  series={chartFormatter.countData(contrabandHis_1)}
                />
              </Card>
            </Col>
          ))}
        </Col>
      </Row>
      <Row gutter={[16, 16]}></Row>
    </div>
  );
};
export default SecurityReport;
