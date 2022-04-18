import React, { useState } from "react";
import { Layout, Menu, Image } from "antd";
import Logo from "../images/logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../App.css";
const { Sider, Content } = Layout;

const StaffHome = () => {
  const [menuKey, setMenuKey] = useState("1");
  const location = useLocation();

  const getKey = () => {
    let key = "1";
    console.log(location.pathname);
    if (location.pathname.indexOf("conversations") !== -1) {
      key = "2";
    } else if (location.pathname.indexOf("questions") !== -1) {
      console.log("ARRIVED");
      key = "3";
    } else if (location.pathname.indexOf("faq") !== -1) {
      key = "4";
    } else if (location.pathname.indexOf("settings") !== -1) {
      key = "5";
    }
    return key;
  };
  return (
    <Layout className="dashboard" hasSider>
      <Sider
        style={{
          backgroundColor: "white",
        }}
        breakpoint="lg"
        collapsedWidth="0"
      >
        <Link to="/">
          <Image width={125} src={Logo} preview={false} />
        </Link>
        <Menu
          style={{ marginTop: 25 }}
          theme="light"
          mode="inline"
          key={menuKey}
          defaultSelectedKeys={[getKey()]}
          onSelect={({ key }) => setMenuKey(key)}
        >
          <Menu.Item key="1">
            <Link to="">Dashboard</Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="conversations">Conversations</Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="questions">Questions</Link>
          </Menu.Item>
          <Menu.Item key="4">
            <Link to="faq">FAQ</Link>
          </Menu.Item>
          <Menu.Item key="5">
            <Link to="settings">Settings</Link>
          </Menu.Item>
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
