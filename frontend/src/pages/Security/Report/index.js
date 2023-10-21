import React, { useState, useEffect } from "react";
import { Row, Col, Form, Tabs, Card, Select } from "antd";
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

const weekOptions = [
  {
    value: "1",
    label: "2023-09-10 ~ 2023-09-16",
  },
  {
    value: "2",
    label: "2023-09-18 ~ 2023-09-24",
  },
];

const SecurityReport = () => {
  const [noData, setNoData] = useState(true);
  const [selectedStartDate, setSelectedStartDate] = useState("2023-09-10");
  const [selectedEndDate, setSelectedEndDate] = useState("2023-09-16");
  const [selectedWeek, setSelectedWeek] = useState("1");
  const [contrabandHis, setContrabandHis] = useState();
  const [contrabandHisItems, setContrabandHisItems] = useState([
    null,
    null,
    null,
    null,
    null,
  ]);

  const [lineChartTabItem, setLineChartTabItem] = useState([]);
  const [barChartTabItem, setBarChartTabItem] = useState([]);

  const dateOnChange = (value) => {
    const date_arr = weekOptions[parseInt(value) - 1].label.split(" ~ ");
    setSelectedWeek(value);
    setSelectedStartDate(date_arr[0]);
    setSelectedEndDate(date_arr[1]);
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

    mock.fetchSecurityLLMResult(selectedWeek).then((res) => {
      setLineChartTabItem([
        {
          key: "1",
          label: "中文",
          children: (
            <div
              dangerouslySetInnerHTML={{
                __html: res.linechart.zh.replace(/\n/g, "<br/>"),
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
                __html: res.linechart.en.replace(/\n/g, "<br/>"),
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
                __html: res.linechart.jp.replace(/\n/g, "<br/>"),
              }}
            ></div>
          ),
        },
      ]);

      setBarChartTabItem([
        {
          key: "1",
          label: "中文",
          children: (
            <div
              dangerouslySetInnerHTML={{
                __html: res.barchart.zh.replace(/\n/g, "<br/>"),
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
                __html: res.barchart.en.replace(/\n/g, "<br/>"),
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
                __html: res.barchart.jp.replace(/\n/g, "<br/>"),
              }}
            ></div>
          ),
        },
      ]);
    });
  }, [selectedWeek]);

  return (
    <div style={{ padding: "16px 16px" }}>
      <Select
        placeholder="Please select"
        style={{
          width: "100%",
        }}
        options={weekOptions}
        onChange={dateOnChange}
        defaultValue={weekOptions[0]}
      />
      {noData ? (
        <p>無資料</p>
      ) : (
        <Row gutter={[16, 16]}>
          <Card>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Chart
                  type="bar"
                  width="100%"
                  options={getBarChartOptions(weekDayList)}
                  series={contrabandHis}
                />
              </Col>
              <Col span={12}>
                <Tabs defaultActiveKey="1" items={barChartTabItem} />
              </Col>
            </Row>
          </Card>

          <Card>
            <Row gutter={[16, 16]}>
              <Col span={9}>
                <Col span={24}>
                  <Tabs defaultActiveKey="1" items={lineChartTabItem}></Tabs>
                </Col>
              </Col>
              <Col span={15}>
                <Row>
                  {contrabandHisItems.map((item) => (
                    <Col span={12} key={item.name}>
                      <Chart
                        type="line"
                        width="100%"
                        options={getLineChartOptions(weekDayList, item.name)}
                        series={item.series}
                      />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card>
        </Row>
      )}
    </div>
  );
};
export default SecurityReport;
