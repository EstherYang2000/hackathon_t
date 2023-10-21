import React, { useState, useEffect } from "react";
import { Row, Col, Form, DatePicker, Card } from "antd";
import dayjs from "dayjs";
import Chart from "react-apexcharts";
import mock from "../../../utils/mock";
import api from "../../../utils/api";
import getBarChartOptions from "../../../components/chart/BarChartOptions";
import getLineChartOptions from "../../../components/chart/LineChartOptions";
import chartFormatter from "../../../utils/chartFormatter";

// Search Bar
const weekFormat = "YYYY-MM-DD";
const weekDayList = ["星期一", "星期二", "星期三", "星期四", "星期五"];

const customWeekStartEndFormat = (value) =>
  `${dayjs(value).startOf("week").format(weekFormat)} ~ ${dayjs(value)
    .endOf("week")
    .format(weekFormat)}`;

// Chart

const itemList = ["電子設備", "筆記型電腦", "剪刀", "刀", "槍枝"];

const SecurityReport = () => {
  const [noData, setNoData] = useState(true);

  const [selectedStartDate, setSelectedStartDate] = useState("2023-09-10");
  const [selectedEndDate, setSelectedEndDate] = useState("2023-09-16");

  const [contrabandHis, setContrabandHis] = useState();
  const [contrabandHisItems, setContrabandHisItems] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);

  const dateOnChange = (dates, dateString) => {
    const date_arr = dateString.split(" ~ ");
    if (date_arr.length === 2) {
      setSelectedStartDate(date_arr[0]);
      setSelectedEndDate(date_arr[1]);
    }
  };

  useEffect(() => {
    const rs = {
      start_time: selectedStartDate,
      end_time: selectedEndDate,
    };

    api
      .post("security/dashboard", rs)
      .then((res) => {
        const series = Object.keys(res).map((zone) => ({
          name: zone,
          data: res[zone],
        }));
        setContrabandHis(series);
      })
      .catch((error) => {
        setNoData(true);
      });

    api
      .post("security/chart", rs)
      .then((res) => {
        const hisItem = [];
        for (let i = 1; i <= 5; i++) {
          const slicedData = res[i.toString()].slice(0, 5);
          const series = [
            {
              name: "總數",
              data: slicedData,
            },
          ];

          hisItem.push({
            series: series,
            name: itemList[i - 1],
          });
        }
        setContrabandHisItems(hisItem);
        if (res["1"][0] === null) {
          setNoData(true);
        } else {
          setNoData(false);
        }
      })
      .catch((error) => {
        setNoData(true);
      });
  }, [selectedStartDate]);

  return (
    <div style={{ padding: "16px 16px" }}>
      <Form layout="inline" style={{ padding: "0 0 16px 0" }}>
        <DatePicker
          picker="week"
          format={customWeekStartEndFormat}
          onChange={dateOnChange}
          defaultValue={dayjs(selectedStartDate, weekFormat)}
        />
      </Form>
      {noData ? (
        <p>無資料</p>
      ) : (
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
                series={contrabandHis}
              />
            </Card>
          </Col>
          <Col span={9}>
            {contrabandHisItems.map((item) => (
              <Col span={24} key={item.name}>
                <Card>
                  <Chart
                    type="line"
                    width="100%"
                    options={getLineChartOptions(weekDayList, item.name)}
                    series={item.series}
                  />
                </Card>
              </Col>
            ))}
          </Col>
        </Row>
      )}
      <Row gutter={[16, 16]}></Row>
    </div>
  );
};
export default SecurityReport;
