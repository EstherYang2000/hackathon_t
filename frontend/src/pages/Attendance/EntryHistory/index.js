import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Col, Row, Table, Button, DatePicker, Input, Form, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import mock from "../../../utils/mock";

const { RangePicker } = DatePicker;

// SearchBar
const SearchForm = () => {
  const form = Form.useFormInstance();
  // TODO - fetch from data
  const zoneOptions = [
    {
      label: "HQ",
      value: "HQ",
    },
    {
      label: "AZ",
      value: "AZ",
    },
  ];
  const initialValue = zoneOptions;

  const handleSearchClick = () => {
    const date = form.getFieldValue("date");
    const zone = form.getFieldValue("zone");
    const empId = form.getFieldValue("empId");
  };

  return (
    <div style={{ display: "contents" }}>
      <Form.Item name="date" label="日期範圍">
        <RangePicker placeholder={["開始時間", "結束時間"]} />
      </Form.Item>
      <Form.Item name="zone" label="廠區" initialValue={initialValue}>
        <Select
          mode="multiple"
          placeholder="Please select"
          style={{
            width: "100%",
          }}
          options={zoneOptions}
        />
      </Form.Item>
      <Form.Item name="empId">
        <Input placeholder="搜尋員工編號" />
      </Form.Item>
      <div style={{ display: "flex", marginLeft: "auto" }}>
        <Form.Item name="search">
          <Button type="primary" onClick={() => handleSearchClick()}>
            查詢
          </Button>
        </Form.Item>
        <Button
          style={{ justifyContent: "flex-end" }}
          type="primary"
          icon={<DownloadOutlined />}
        />
      </div>
    </div>
  );
};

// Table
const columns = [
  {
    title: "入廠時間",
    dataIndex: "DateTime",
  },
  {
    title: "廠區",
    dataIndex: "Zone",
  },
  {
    title: "員工編號",
    dataIndex: "EmpId",
  },
  {
    title: "部門",
    dataIndex: "DeptId",
  },
  {
    title: "結果",
    dataIndex: "TimeDifferenceMinutes",
    render: (time) => {
      if (time > 0) {
        return "遲到";
      }
      return "早到";
    },
  },
];

function EntryHistory() {
  const [entryHis, setEntryHis] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // var url = "contrabandHis";
    // api.get(url).then(res => {
    //     setScanHis(res)
    //     setLoading(false)
    // })
    mock.fetchEntryHis().then((res) => {
      setEntryHis(res);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: "16px 16px" }}>
      <Form layout="inline" style={{ padding: "0 0 16px 0" }}>
        <SearchForm />
      </Form>
      <Col span={24}>
        <Table
          dataSource={entryHis}
          columns={columns}
          loading={loading}
          rowKey={(record) => record.Id}
        />
      </Col>
    </div>
  );
}
export default EntryHistory;
