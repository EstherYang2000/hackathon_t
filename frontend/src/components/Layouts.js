import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout, Menu, theme } from "antd";
import {
  AlertOutlined,
  BarsOutlined,
  ScanOutlined,
  UserOutlined,
  LineChartOutlined,
  SecurityScanOutlined,
  DashboardOutlined,
  ToolOutlined,
} from "@ant-design/icons";

import "../styles/global.css";

const { Header, Content, Sider, Footer } = Layout;
const { SubMenu } = Menu;

const Layouts = (props) => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const location = useLocation();
  const showAttendenceSider = location.pathname.startsWith("/attendance");
  const showSecuritySider = location.pathname.startsWith("/security");

  const mainMenuItems = [
    {
      key: "0",
      icon: React.createElement(ScanOutlined),
      label: <Link to="/upload">圖片上傳</Link>,
      path: "/upload",
    },
    {
      key: "1",
      icon: React.createElement(UserOutlined),
      label: <Link to="/attendance">出勤管理</Link>,
      path: "/attendance",
    },
    {
      key: "2",
      icon: React.createElement(SecurityScanOutlined),
      label: <Link to="/security">維安管理</Link>,
      path: "/security",
    },
  ];

  const attendanceMenuItems = [
    {
      key: "0",
      icon: React.createElement(DashboardOutlined),
      label: <Link to="/attendance/dashboard">儀表板</Link>,
      path: "/attendance/dashboard",
    },
    {
      key: "1",
      icon: React.createElement(LineChartOutlined),
      label: <Link to="/attendance/report">週報</Link>,
      path: "/attendance/report",
    },
    {
      key: "2",
      icon: React.createElement(BarsOutlined),
      label: <Link to="/attendance/entry-history">出勤紀錄</Link>,
      path: "/attendance/entry-history",
    },
  ];

  const securityMenuItems = [
    {
      key: "0",
      icon: React.createElement(BarsOutlined),
      label: <Link to="/security/entry-record">入廠紀錄</Link>,
      path: "/security/entry-record",
    },
    {
      key: "1",
      icon: React.createElement(LineChartOutlined),
      label: <Link to="/security/report">週報</Link>,
      path: "/security/report",
    },
    {
      key: "2",
      icon: React.createElement(ToolOutlined),
      label: <Link to="/security/maintain">維護</Link>,
      path: "/security/maintain",
    },
  ];

  return (
    <Layout className="layout">
      <Header
        style={{
          alignItems: "center",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          items={mainMenuItems}
          selectedKeys={mainMenuItems
            .filter((item) => location.pathname.startsWith(item.path))
            .map((item) => item.key)}
        />
      </Header>
      <Layout>
        {showAttendenceSider && (
          <Sider width={200}>
            <Menu
              mode="inline"
              style={{
                height: "100%",
                borderRight: 0,
              }}
              items={attendanceMenuItems}
              selectedKeys={attendanceMenuItems
                .filter((item) => location.pathname.startsWith(item.path))
                .map((item) => item.key)}
            />
          </Sider>
        )}
        {showSecuritySider && (
          <Sider width={200}>
            <Menu
              mode="inline"
              style={{
                height: "100%",
                borderRight: 0,
              }}
              items={securityMenuItems}
              selectedKeys={securityMenuItems
                .filter((item) => location.pathname.startsWith(item.path))
                .map((item) => item.key)}
            />
          </Sider>
        )}
        <Content style={{ padding: "16px 16px 0" }}>
          <div
            className="site-layout-content"
            // style={{
            //   background: colorBgContainer,
            // }}
          >
            {props.children}
          </div>
        </Content>
      </Layout>

      <Footer
        style={{
          textAlign: "center",
          // bottom: 0,
          // width: "100%",
          // position: "fixed",
        }}
      >
        Meichu Hackthon ©2023
      </Footer>
    </Layout>
  );
};
export default Layouts;
