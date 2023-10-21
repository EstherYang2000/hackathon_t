import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  DatePicker,
  Select,
  Table,
  Card,
  Button,
  Spin,
  Tabs,
} from "antd";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import getBarChartOptions from "../../../components/chart/BarChartOptions";
import chartFormatter from "../../../utils/chartFormatter";
import mock from "../../../utils/mock";
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

const weekOptions = [
  {
    value: "2023-09-10 ~ 2023-09-17",
    label: "2023-09-10 ~ 2023-09-17",
  },
  {
    value: "2023-09-18 ~ 2023-09-24",
    label: "2023-09-18 ~ 2023-09-24",
  },
];

const SearchForm = (props) => {
  const form = Form.useFormInstance();

  const handleSearchClick = () => {
    const data = form.getFieldValue("dateRange").split(" ~ ");
    const dept = {
      label: form.getFieldValue("dept"),
      value: form.getFieldValue("dept"),
    };
    const zone = {
      label: form.getFieldValue("zone"),
      value: form.getFieldValue("zone"),
    };
    props.search(data[0], data[1], zone, dept);
  };

  return (
    <div style={{ display: "contents" }}>
      <Form.Item name="dateRange" initialValue={weekOptions[0].label}>
        <Select
          placeholder="Please select"
          style={{
            width: "100%",
          }}
          options={weekOptions}
        />
      </Form.Item>
      <Form.Item name="dept" initialValue={deptOptions[0].label}>
        <Select placeholder="Please select" options={deptOptions} />
      </Form.Item>
      <Form.Item name="zone" initialValue={zoneOptions[0].label}>
        <Select placeholder="Please select" options={zoneOptions} />
      </Form.Item>
      <Form.Item name="search">
        <Button type="primary" onClick={() => handleSearchClick()}>
          查詢
        </Button>
      </Form.Item>
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
  const [loading, setLoading] = useState(true);
  const [LLMLoading, setLLMLoading] = useState(true);

  const [entryStat, setEntryStat] = useState([]);
  const [lateDeptHis, setLateDeptHis] = useState([]);
  const [weeklyZoneLateHis, setWeeklyZoneLateHis] = useState([]);

  const [empshiftChartTabItem, setEmpshiftChartTabItem] = useState();
  const [weeklyChartTabItem, setWeeklyChartTabItem] = useState();
  const [tableTabItem, setTableTabItem] = useState();

  const setTabItem = (res) => {
    setEmpshiftChartTabItem([
      {
        key: "1",
        label: "中文",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.lateDeptCount[0].HQ.zh.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
      {
        key: "2",
        label: "English",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.lateDeptCount[0].HQ.en.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
      {
        key: "3",
        label: "日本語",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.lateDeptCount[0].HQ.jp.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
    ]);

    // weeklyZoneLateCount
    setWeeklyChartTabItem([
      {
        key: "1",
        label: "中文",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.weeklyZoneLateCount[0].HQ.zh.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
      {
        key: "2",
        label: "English",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.weeklyZoneLateCount[0].HQ.en.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
      {
        key: "3",
        label: "日本語",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.weeklyZoneLateCount[0].HQ.jp.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
    ]);

    // lateTable 表格
    setTableTabItem([
      {
        key: "1",
        label: "中文",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.lateTable[0].HQ.zh.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
      {
        key: "2",
        label: "English",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.lateTable[0].HQ.en.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
      {
        key: "3",
        label: "日本語",
        children: (
          <div
            dangerouslySetInnerHTML={{
              __html: res.lateTable[0].HQ.jp.replace(/\n/g, "<br/>"),
            }}
          ></div>
        ),
      },
    ]);
  };

  const search = (start_date, end_date, zone, dept) => {
    const rq = {
      start_date: start_date,
      end_date: end_date,
      dept: dept.label,
      zone: zone.label,
    };
    console.log(rq);
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
      });
    // TODO - change mock to call api
    mock.fetchAttendanceLLMResult(rq).then((res) => {
      setTabItem(res);
      setLLMLoading(false);
    });
  };

  useEffect(() => {
    const rq = {
      zone: "ALL",
      dept: "DEPT1",
      start_date: "2023-09-11",
      end_date: "2023-09-17",
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
      });

    // TODO - change mock to call api
    mock.fetchAttendanceLLMResult(rq).then((res) => {
      setTabItem(res);
      setLLMLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "16px 16px" }}>
      <Form layout="inline" style={{ padding: "0 0 16px 0" }}>
        <SearchForm search={search} />
      </Form>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={12}>
                {lateDeptHis.length === 0 ? (
                  <p>Loading...</p>
                ) : (
                  <Chart
                    type="bar"
                    width="100%"
                    options={getBarChartOptions(empShiftList)}
                    series={chartFormatter.groupZone(lateDeptHis, "late_count")}
                  />
                )}
              </Col>
              <Col span={12}>
                {LLMLoading ? (
                  <p>LLM Loading...</p>
                ) : (
                  <Tabs defaultActiveKey="1" items={empshiftChartTabItem} />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={12}>
                {weeklyZoneLateHis.length === 0 ? (
                  <p>Loading...</p>
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
              </Col>
              <Col span={12}>
                {LLMLoading ? (
                  <p>LLM Loading...</p>
                ) : (
                  <Tabs defaultActiveKey="1" items={weeklyChartTabItem} />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <Row>
              <Col span={12}>
                <Table
                  dataSource={entryStat}
                  columns={columns}
                  loading={loading}
                  rowKey="entry_id"
                />
              </Col>
              <Col span={12}>
                {LLMLoading ? (
                  <p>LLM Loading...</p>
                ) : (
                  <Tabs defaultActiveKey="1" items={tableTabItem} />
                )}
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default AttendanceReport;
