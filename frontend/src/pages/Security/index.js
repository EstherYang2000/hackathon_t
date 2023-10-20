import Layouts from "../../components/Layouts";
import React from "react";
import { Outlet } from "react-router-dom";

function Security() {
  return (
    <Layouts>
      <Outlet />
    </Layouts>
  );
}
export default Security;
