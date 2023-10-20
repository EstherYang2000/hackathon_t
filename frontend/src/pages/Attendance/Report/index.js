import React, { useState, useEffect } from "react";
import { Row, Col, Form, DatePicker, Select, Table, Card, Button } from "antd";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import mock from "../../../utils/mock";
import getBarChartOptions from "../../../components/chart/BarChartOptions";
import chartFormatter from "../../../utils/chartFormatter";
// Search Bar
const weekFormat = "MM/DD";
const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;

// TODO - fetch from data
const deptOptions = [
  {
    label: "DEPT1",
    value: "DEPT1",
  },
  {
    label: "DEPT2",
    value: "DEPT2",
  },
  {
    label: "DEPT3",
    value: "DEPT3",
  },
  {
    label: "DEPT4",
    value: "DEPT4",
  },
];

const zoneOptions = [
  {
    label: "All",
    value: "All",
  },
  {
    label: "AZ",
    value: "AZ",
  },
  {
    label: "HQ",
    value: "HQ",
  },
];

const SearchForm = (props) => {
  const form = Form.useFormInstance();

  const handleSearchClick = () => {
    const dateRange = form.getFieldValue("dateRange");
    const dept = form.getFieldValue("dept");
    const zone = form.getFieldValue("zone");

    // TODO - Request

    // TODO - Change zone
    if (zone === "All") {
      props.updateViewZone(false);
    } else {
      props.updateViewZone(true);
    }
  };

  return (
    <div style={{ display: "contents" }}>
      <Form.Item name="dateRange" initialValue={dayjs()}>
        <DatePicker picker="week" format={customWeekStartEndFormat} />
      </Form.Item>
      <Form.Item name="dept" initialValue={deptOptions[0]}>
        <Select placeholder="Please select" options={deptOptions} />
      </Form.Item>
      <Form.Item name="zone" initialValue={zoneOptions[0]}>
        <Select placeholder="Please select" options={zoneOptions} />
      </Form.Item>

      {/* <div style={{ display: "flex", marginLeft: "auto" }}> */}
      <Form.Item name="search">
        <Button type="primary" onClick={() => handleSearchClick()}>
          查詢
        </Button>
      </Form.Item>
      {/* </div> */}
    </div>
  );
};

// Table
const columns = [
  {
    title: "員工編號",
    dataIndex: "EmpId",
  },
  {
    title: "入場天數",
    dataIndex: "entryCount",
  },
  {
    title: "遲到天數",
    dataIndex: "lateCount",
  },
];

// Chart
const empShiftList = ["6:30", "7:30", "8:30"];
const weekDayList = ["星期一", "星期二", "星期三", "星期四", "星期五"];

const AttendanceReport = () => {
  const [loading, setLoading] = useState(true);
  const [viewByZone, setViewByZone] = useState(false);
  const [entryStat, setEntryStat] = useState();
  const [deptEntryHis, setDeptEntryHis] = useState();
  const [weekDeptEntryHis, setWeekDeptEntryHis] = useState();

  const updateViewZone = (viewByZone) => {
    setViewByZone(viewByZone);

    // TODO - fetch new data
  };

  useEffect(() => {
    mock.fetchEntryStatis().then((res) => {
      setEntryStat(res);
    });

    mock.fetchDeptEntry().then((res) => {
      setDeptEntryHis(res);
    });

    mock.fetchWeekDeptEntry().then((res) => {
      setWeekDeptEntryHis(res);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "16px 16px" }}>
      <Form layout="inline" style={{ padding: "0 0 16px 0" }}>
        <SearchForm updateViewZone={updateViewZone} />
      </Form>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>週報說...</Card>
        </Col>
        <Col span={12}>
          <Card>
            {viewByZone ? (
              <Chart
                type="bar"
                width="100%"
                options={getBarChartOptions(empShiftList)}
                series={chartFormatter.countData(deptEntryHis)}
              />
            ) : (
              <Chart
                type="bar"
                width="100%"
                options={getBarChartOptions(empShiftList)}
                series={chartFormatter.groupZone(deptEntryHis)}
              />
            )}
          </Card>
          <Card>
            {viewByZone ? (
              <Chart
                type="bar"
                width="100%"
                options={getBarChartOptions(empShiftList)}
                series={chartFormatter.countData(deptEntryHis)}
              />
            ) : (
              <Chart
                type="bar"
                width="100%"
                options={getBarChartOptions(weekDayList)}
                series={chartFormatter.groupZone(weekDeptEntryHis)}
              />
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Table
            dataSource={entryStat}
            columns={columns}
            loading={loading}
            rowKey="Id"
          />
        </Col>
      </Row>
    </div>
  );
};
export default AttendanceReport;
