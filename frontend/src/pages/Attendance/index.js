import Layouts from "../../components/Layouts";
import React from "react";
import { Outlet } from "react-router-dom";
import { Card } from "antd";
function Attendance() {
  return (
    <Layouts>
      <Outlet />
    </Layouts>
  );
}
export default Attendance;
