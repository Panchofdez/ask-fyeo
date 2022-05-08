import React from "react";
import { Row, Col, Image, Space, Tooltip } from "antd";
import Logo from "../../images/logo.png";
import TMU from "../../images/TMU.png";
import {
  InstagramOutlined,
  LoginOutlined,
  MailOutlined,
  FacebookFilled,
  TwitterOutlined,
  YoutubeFilled,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import useWindowDimensions from "../../hooks/windowDimensions";

const Header = () => {
  const { height, width } = useWindowDimensions();

  return (
    <Row justify="space-between" style={{ height: "100%" }}>
      <Col xs={24} md={2}></Col>
      <Col
        xs={24}
        md={20}
        style={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", padding: 20 }}
      >
        <Row>
          <Col
            span={24}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 20,
            }}
          >
            <Space size={width >= 768 ? "large" : "small"} direction={width >= 768 ? "horizontal" : "vertical"}>
              <Image width={200} src={Logo} preview={false} />
              <Image width={200} src={TMU} preview={false} />
            </Space>
          </Col>
        </Row>
        <h1 style={{ fontSize: 60, fontWeight: 800, letterSpacing: 1, marginTop: 20 }}>Ask FYEO</h1>
        <h4>
          A web-based resource for first year engineering students. This tool is available to you 24 hours a day, 7 days
          a week, and 365 days a year
        </h4>
        <Space size={width >= 768 ? "large" : "small"} style={{ marginTop: 40 }}>
          <a href="mailto:firstyeareng@ryerson.ca" target="_blank" rel="noreferrer">
            <MailOutlined style={{ fontSize: 25 }} />
          </a>
          |
          <a href="https://www.instagram.com/firstyeareng/?hl=en" target="_blank" rel="noreferrer">
            <InstagramOutlined style={{ fontSize: 25 }} />
          </a>
          |
          <a href="https://twitter.com/firstyeareng?lang=en" target="_blank" rel="noreferrer">
            <TwitterOutlined style={{ fontSize: 25 }} />
          </a>
          |
          <a href="https://www.facebook.com/firstyeareng/" target="_blank" rel="noreferrer">
            <FacebookFilled style={{ fontSize: 25 }} />
          </a>
          |
          <a href="https://www.youtube.com/channel/UC1Vx71yURzRH3YpOh1uQgng" target="_blank" rel="noreferrer">
            <YoutubeFilled style={{ fontSize: 25 }} />
          </a>
          |
          <Tooltip title="Staff Login">
            <Link to="/staff">
              <LoginOutlined style={{ fontSize: 25 }} />
            </Link>
          </Tooltip>
        </Space>
      </Col>
      <Col xs={24} md={2}></Col>
      {/* <Col xs={{ span: 24, order: 2 }} md={{ span: 2, order: 2 }}></Col>
      <Col xs={{ span: 24, order: 1 }} md={{ span: 8, order: 3 }} className="logoContainer"></Col> */}
    </Row>
  );
};

export default Header;
