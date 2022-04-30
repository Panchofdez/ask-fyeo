import React from "react";
import { Row, Col } from "antd";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot";
import "../App.css";

const Home = () => {
  return (
    <div className="home">
      <Row
        style={{
          marginTop: "10vh",
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          zIndex: 3,
          marginBottom: "20vh",
        }}
      >
        <Col xs={24} md={12}>
          <Header />
        </Col>
        <Col xs={24} md={12}>
          <Row>
            <Col xs={0} md={2}></Col>
            <Col xs={24} md={20}>
              <Chatbot />
            </Col>
            <Col xs={0} md={2}></Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default Home;
