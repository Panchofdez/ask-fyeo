import React from "react";
import { Row, Col, Image, Space } from "antd";
import Logo from "../../images/logo.png";
import Ryerson from "../../images/Ryerson.png";

const Header = () => {
  return (
    <Row justify="space-between" style={{ height: "100%" }}>
      <Col xs={24} md={2}></Col>
      <Col
        xs={{ span: 24, order: 3 }}
        md={{ span: 20, order: 1 }}
        style={{ display: "flex", flexDirection: "column", alignItems: "start", justifyContent: "center", padding: 20 }}
      >
        <Row>
          <Col
            span={24}
            style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}
          >
            <Space size={40}>
              <Image width={200} src={Logo} preview={false} />
              <Image width={200} src={Ryerson} preview={false} />
            </Space>
          </Col>
        </Row>
        <h1 style={{ fontSize: 50, fontWeight: 800, letterSpacing: 1, marginTop: 20 }}>Ask FYEO</h1>
        <h4>
          A web-based resource for first year engineering students. This tool is available to you 24 hours a day, 7 days
          a week, and 365 days a year
        </h4>
      </Col>
      <Col xs={24} md={2}></Col>
      {/* <Col xs={{ span: 24, order: 2 }} md={{ span: 2, order: 2 }}></Col>
      <Col xs={{ span: 24, order: 1 }} md={{ span: 8, order: 3 }} className="logoContainer"></Col> */}
    </Row>
  );
};

export default Header;
