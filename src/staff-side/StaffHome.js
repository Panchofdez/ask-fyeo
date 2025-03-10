import React, { useState, useEffect } from "react";
import { Layout, Menu, Image } from "antd";
import Logo from "../images/logo.png";
import { Link, Outlet, useLocation } from "react-router-dom";
import "../App.css";
const { Sider, Content } = Layout;
const { SubMenu } = Menu;

const StaffHome = () => {
  const location = useLocation();

  useEffect(() => {
    let isReady = true;

    const setUp = () => {
      if (isReady) {
        if (
          sessionStorage.getItem("hasRefreshedStaff") === null ||
          sessionStorage.getItem("hasRefreshedStaff") === "false"
        ) {
          // Reload the page
          window.location.reload();

          // Set a flag in sessionStorage to prevent further reloads
          sessionStorage.setItem("hasRefreshedStaff", "true");
          sessionStorage.setItem("hasRefreshedHome", "false");
        }
      }
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, [location]);

  const getKey = () => {
    let key = "1";
    if (location.pathname.indexOf("conversations") !== -1) {
      key = "2";
    } else if (location.pathname.indexOf("questions") !== -1) {
      key = "3";
    }else if (location.pathname.indexOf("faq/staff") !== -1) {
      key = "5";
    }else if (location.pathname.indexOf("faq") !== -1) {
      key = "4";
      
    } else if (location.pathname.indexOf("settings") !== -1) {
      key = "6";
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
          defaultSelectedKeys={[getKey()]}
          defaultOpenKeys={['faq']}
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
          <SubMenu key="faq" title="FAQ">
            <Menu.Item key="4">
              <Link to="faq">Student</Link>
            </Menu.Item>
            <Menu.Item key="5">
              <Link to="faq/staff">Staff</Link>
            </Menu.Item>
          </SubMenu>
          <Menu.Item key="6">
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
