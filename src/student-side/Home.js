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
    if (sessionStorage.getItem("hasRefreshedHome") === null || sessionStorage.getItem("hasRefreshedHome") === "false") {
      // Reload the page
      window.location.reload();

      // Set a flag in sessionStorage to prevent further reloads
      sessionStorage.setItem("hasRefreshedHome", "true");
      sessionStorage.setItem("hasRefreshedStaff", "false");
    }
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
          // zIndex: 3,
          marginBottom: "10vh",
        }}
      >
        <Col xs={24}>
          <Header />
        </Col>
        {/* <Col xs={24}>
          <Row>
            <Col xs={0} md={2}></Col>
            <Col xs={24} md={20}>
              <Chatbot />
              <iframe src="https://ask-fyeo.streamlit.app/?embed=true" style="height: 450px; width: 100%;"></iframe>
            </Col>
            <Col xs={0} md={2}></Col>
          </Row>
        </Col> */}
      </Row>
    </div>
  );
};

export default Home;
