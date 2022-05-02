import React, { useEffect } from "react";
import { Row, Col } from "antd";
import Header from "./components/Header";
import Chatbot from "./components/Chatbot";
import "../App.css";
import { api } from "../api/api";
const Home = () => {
  useEffect(() => {
    const pingAPI = () => {
      api.get("/");
    };
    pingAPI();
  }, []);
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
