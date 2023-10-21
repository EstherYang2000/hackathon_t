import React, { useState, useEffect } from "react";
import { Row, Col, Form, DatePicker, Select, Table, Card, Button } from "antd";
import dayjs from "dayjs";
import moment from "moment";

import Chart from "react-apexcharts";
import mock from "../../../utils/mock";
import getBarChartOptions from "../../../components/chart/BarChartOptions";
import chartFormatter from "../../../utils/chartFormatter";
import api from "../../../utils/api";

// Search Bar
const weekFormat = "YYYY-MM-DD";
const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;

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
    label: "ALL",
    value: "ALL",
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
  const [selectedStartDate, setSelectedStartDate] = useState("2023-09-10");
  const [selectedEndDate, setSelectedEndDate] = useState("2023-09-16");

  const form = Form.useFormInstance();

  const handleSearchClick = () => {
    const dept = {
      label: form.getFieldValue("dept"),
      value: form.getFieldValue("dept"),
    };
    const zone = {
      label: form.getFieldValue("zone"),
      value: form.getFieldValue("zone"),
    };
    props.search(selectedStartDate, selectedEndDate, zone, dept);
  };

  const dateOnChange = (dates, dateString) => {
    const date_arr = dateString.split(" ~ ");
    if (date_arr.length === 2) {
      setSelectedStartDate(date_arr[0]);
      setSelectedEndDate(date_arr[1]);
    }
  };

  return (
    <div style={{ display: "contents" }}>
      <Form.Item
        name="dateRange"
        initialValue={dayjs(selectedStartDate, "YYYY-MM-DD")}
      >
        <DatePicker
          picker="week"
          format={customWeekStartEndFormat}
          onChange={dateOnChange}
        />
      </Form.Item>
      <Form.Item name="dept" initialValue={deptOptions[0].label}>
        <Select placeholder="Please select" options={deptOptions} />
      </Form.Item>
      <Form.Item name="zone" initialValue={zoneOptions[0].label}>
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
    dataIndex: "empid",
  },
  {
    title: "廠區",
    dataIndex: "zone",
  },
  {
    title: "入場天數",
    dataIndex: "entry_count",
  },
  {
    title: "遲到天數",
    dataIndex: "late_count",
  },
];

// Chart
const empShiftList = ["6:30", "7:30", "8:30", "9:00", "9:30"];
const weekDayList = ["星期一", "星期二", "星期三", "星期四", "星期五"];

const AttendanceReport = () => {
  const [noData, setNoData] = useState(false);

  const [loading, setLoading] = useState(true);
  const [entryStat, setEntryStat] = useState();
  const [lateDeptHis, setLateDeptHis] = useState();
  const [weeklyZoneLateHis, setWeeklyZoneLateHis] = useState();

  const search = (start_date, end_date, zone, dept) => {
    const rq = {
      start_date: start_date,
      end_date: end_date,
      dept: dept.label,
      zone: zone.label,
    };
    api
      .post("hr/weeklyreport", rq)
      .then((res) => {
        setEntryStat(res["lateTable"]);
        setLateDeptHis(res["lateDeptCount"]);
        setWeeklyZoneLateHis(res["weeklyZoneLateCount"]);
        setLoading(false);
      })
      .catch((error) => {
        setEntryStat([]);
        // setLoading(false);
      });
  };

  useEffect(() => {
    const rq = {
      zone: "ALL",
      dept: "DEPT1",
      start_date: "2023-09-10",
      end_date: "2023-09-16",
    };

    api
      .post("hr/weeklyreport", rq)
      .then((res) => {
        setEntryStat(res["lateTable"]);
        setLateDeptHis(res["lateDeptCount"]);
        setWeeklyZoneLateHis(res["weeklyZoneLateCount"]);
        setLoading(false);
      })
      .catch((error) => {
        setEntryStat([]);
        // setLoading(true);
      });
  }, []);

  return (
    <div style={{ padding: "16px 16px" }}>
      <Form layout="inline" style={{ padding: "0 0 16px 0" }}>
        <SearchForm search={search} />
      </Form>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>週報說...</Card>
        </Col>

        {loading ? (
          <p>loading</p>
        ) : (
          <Col span={12}>
            <Card>
              {lateDeptHis.length === 0 ? (
                <p>無資料</p>
              ) : (
                <Chart
                  type="bar"
                  width="100%"
                  options={getBarChartOptions(empShiftList)}
                  series={chartFormatter.groupZone(lateDeptHis, "late_count")}
                />
              )}
            </Card>
            <Card>
              {weeklyZoneLateHis.length === 0 ? (
                <p>無資料</p>
              ) : (
                <Chart
                  type="bar"
                  width="100%"
                  options={getBarChartOptions(weekDayList)}
                  series={chartFormatter.groupZone(
                    weeklyZoneLateHis,
                    "late_count"
                  )}
                />
              )}
            </Card>
          </Col>
        )}

        <Col span={12}>
          {loading ? (
            <p></p>
          ) : (
            <Table
              dataSource={entryStat}
              columns={columns}
              loading={loading}
              rowKey="entry_id"
            />
          )}
        </Col>
      </Row>
    </div>
  );
};
export default AttendanceReport;
