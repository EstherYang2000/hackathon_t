import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Card, Statistic, Segmented, DatePicker } from "antd";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import chartFormatter from "../../../utils/chartFormatter";
import mock from "../../../utils/mock";
import api from "../../../utils/api";
import getLineChartOptions from "../../../components/chart/LineChartOptions";

const weekDayList = ["星期一", "星期二", "星期三", "星期四", "星期五"];

// Search Bar
const weekFormat = "YYYY-MM-DD";
const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;

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

function AttendanceDashboard() {
  const [noData, setNoData] = useState(false);
  const [dailyAttendence, setDailyAttendence] = useState([]);
  const [weekLateList, setWeekLateList] = useState([]);
  const [selectedZone, setSelectedZone] = useState("ALL");
  const [selectedStartDate, setSelectedStartDate] = useState("2023-09-10");
  const [selectedEndDate, setSelectedEndDate] = useState("2023-09-16");

  const tabOnChange = (key) => {
    setSelectedZone(key);
  };

  const dateOnChange = (dates, dateString) => {
    const date_arr = dateString.split(" ~ ");
    if (date_arr.length === 2) {
      setSelectedStartDate(date_arr[0]);
      setSelectedEndDate(date_arr[1]);
    }
  };

  useEffect(() => {
    const rq = {
      zone: selectedZone,
      start_date: selectedStartDate,
      end_date: selectedEndDate,
    };

    api
      .post("hr/dashboard", rq)
      .then((res) => {
        setDailyAttendence(res["dailyAttendence"][0]);

        const weeklyLate = res["weeklyLate"];
        weeklyLate.sort((a, b) => new Date(a.date) - new Date(b.date));

        setWeekLateList(weeklyLate);
        if (weeklyLate.length === 0) {
          setNoData(true);
        } else {
          setNoData(false);
        }
      })
      .catch((error) => {
        setNoData(true);
      });
  }, [selectedZone, selectedStartDate]);

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <DatePicker
          picker="week"
          format={customWeekStartEndFormat}
          onChange={dateOnChange}
          defaultValue={dayjs(selectedStartDate, weekFormat)}
        />
        <Segmented
          size="large"
          options={["ALL", "AZ", "HQ"]}
          onChange={tabOnChange}
          default={selectedZone}
        />
      </Col>
      <Col span={6}>
        <Card span={6}>
          {noData ? (
            <p>無資料</p>
          ) : (
            <Row gutter={[5, 5]}>
              <Col span={12}>
                <Statistic
                  title="入廠人數"
                  value={dailyAttendence["entry_count"]}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="出勤正常人數"
                  value={dailyAttendence["normal_count"]}
                />
              </Col>
              <Col span={12}></Col>
              <Col span={12}>
                <Statistic
                  title="遲到人數"
                  value={dailyAttendence["late_count"]}
                />
              </Col>
            </Row>
          )}
        </Card>
      </Col>
      <Col span={18}>
        <Card>
          {weekLateList.length === 0 ? (
            <p>無資料</p>
          ) : (
            <Chart
              type="line"
              width="100%"
              options={getLineChartOptions(weekDayList, "遲到人數統計")}
              series={chartFormatter.countData(weekLateList, "late_count")}
            />
          )}
        </Card>
      </Col>
    </Row>
  );
}
export default AttendanceDashboard;
