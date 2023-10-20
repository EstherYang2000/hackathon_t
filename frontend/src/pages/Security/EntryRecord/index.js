import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Col,
  Card,
  Table,
  Button,
  Input,
  Form,
  Select,
  DatePicker,
} from "antd";
import { DownloadOutlined } from "@ant-design/icons";

import mock from "../../../utils/mock";

const { RangePicker } = DatePicker;

// Search Bar
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

const ItemMapping = {
  0: "物品一",
  1: "物品二",
  2: "物品三",
  3: "物品四",
  4: "物品五",
};

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
    title: "物品",
    dataIndex: "Object",
    render: (items) => {
      const itemText = items.map((item) => ItemMapping[item]).join(", ");
      return itemText;
    },
  },
];

const EntryRecord = () => {
  const [contrabandHis, setContrabandHis] = useState();
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();

  // const navigate = useNavigate();
  // const handleViewInfoClick = (id) => {
  //   navigate(`/dashboard/detail/${id}`);
  // };

  useEffect(() => {
    // var url = "contrabandHis";
    // api.get(url).then(res => {
    //     setScanHis(res)
    //     setLoading(false)
    // })
    mock.fetchContrabandHis().then((res) => {
      setContrabandHis(res);
      setLoading(false);
    });
  }, []);

  return (
    <Card>
      <Form form={form} layout="inline" style={{ padding: "0 0 16px 0" }}>
        <SearchForm />
      </Form>
      <Col span={24}>
        <Table
          dataSource={contrabandHis}
          columns={columns}
          loading={loading}
          rowKey={(record) => record.Index}
        />
      </Col>
    </Card>
  );
};
export default EntryRecord;
