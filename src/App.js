import React, { useState } from "react";
import "antd/dist/antd.min.css";
import { Row, Col } from "antd";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import Header from "./components/Header";
import Footer from "./components/Footer";
import data from "./data";
import "./App.css";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [searchMode, setSearchMode] = useState(false);

  return (
    <div className="App">
      <Row>
        <Col span={24}>
          <Row style={{ backgroundColor: "skyblue", padding: 30, paddingBottom: 50 }}>
            <Col xs={0} md={4}></Col>
            <Col xs={24} md={16}>
              <Header />
            </Col>
            <Col xs={0} md={4}></Col>
          </Row>

          <Row>
            <Col xs={1} md={4}></Col>
            <Col xs={22} md={16}>
              <SearchBar data={data} setSearchResults={setSearchResults} setSearchMode={setSearchMode} />

              {searchMode &&
                (searchResults.length > 0 ? (
                  <p style={{ marginLeft: 5, marginTop: 5 }}>
                    <em>{searchResults.length} results found</em>
                  </p>
                ) : (
                  <p style={{ marginLeft: 5, marginTop: 5 }}>
                    <em>
                      0 results found. Click{" "}
                      <button className="buttonLink" onClick={() => setSearchResults(data)}>
                        <em>here</em>
                      </button>{" "}
                      to view the entire FAQ instead
                    </em>
                  </p>
                ))}
              <SearchResults results={searchResults} />
            </Col>
            <Col xs={1} md={4}></Col>
          </Row>
        </Col>
      </Row>
      <Row
        style={{
          backgroundColor: "#fcfcfc",
          paddingTop: 40,
          paddingBottom: 40,
          marginTop: 50,
        }}
      >
        <Col span={4}></Col>
        <Col span={16}>
          <Footer></Footer>
        </Col>
        <Col span={4}></Col>
      </Row>
    </div>
  );
}

export default App;
