import React, { useState, useEffect } from "react";
import { Row, Col } from "antd";
import { useParams } from "react-router-dom";
import { Content } from "antd/es/layout/layout";
import mock from "../../../utils/mock";

const EntryInfo = () => {
  //   const { id } = match.params;
  const { id } = useParams();
  const [contrabandHisInfo, setContrabandHisInfo] = useState({
    // a state contains form data
    EmpId: "",
    Zone: "",
    DeptId: "",
    DateTime: "",
    Img: "",
  });

  useEffect(() => {
    // var url = "contrabandHis";
    // api.get(url).then(res => {
    //     setScanHis(res)
    //     setLoading(false)
    // })
    mock
      .fetchContrabandHisInfo(id)
      .then((res) => {
        setContrabandHisInfo({
          EmpId: res.EmpId,
          Zone: res.Zone,
          DeptId: res.DeptId,
          DateTime: res.DateTime,
          Img: res.Img,
        });
      })
      .then
      // TODO - fetch image
      ();
  }, []);

  return (
    <Content>
      <Row gutter={[16, 16]}>
        {/* TODO - breadcrumb*/}
        <Col span={24}>
          <h2>入廠資訊</h2>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <p>員工編號：{contrabandHisInfo.EmpId}</p>
          <p>廠區：{contrabandHisInfo.Zone}</p>
          <p>部門：{contrabandHisInfo.DeptId}</p>
          <p>入廠時間：{contrabandHisInfo.DateTime}</p>
        </Col>
        <Col span={12}>{contrabandHisInfo.Img}</Col>
      </Row>
    </Content>
  );
};
export default EntryInfo;
