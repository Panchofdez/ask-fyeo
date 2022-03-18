import React, { useState } from "react";
import { Layout, Menu, Image } from "antd";
import Logo from "../images/logo.png";
import { Link, Outlet } from "react-router-dom";
import "../App.css";
const { Sider, Content } = Layout;

const StaffHome = () => {
  const [menuKey, setMenuKey] = useState("1");
  return (
    <Layout className="dashboard">
      <Sider style={{ backgroundColor: "white" }} breakpoint="lg" collapsedWidth="0">
        <Image width={125} src={Logo} preview={false} />
        <Menu
          style={{ marginTop: 25 }}
          theme="light"
          mode="inline"
          defaultSelectedKeys={[menuKey]}
          onSelect={({ key }) => setMenuKey(key)}
        >
          <Menu.Item key="1">
            <Link to="">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="conversations">Conversations</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="settings">Settings</Link>
          </Menu.Item>
          {/* <Menu.Item key="4">
            <Link to="settings">Settings</Link>
          </Menu.Item> */}
        </Menu>
      </Sider>
      <Layout>
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StaffHome;
