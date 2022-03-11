import React, { useState } from "react";
import { Input, AutoComplete, Row, Col } from "antd";

const SearchBar = ({ data, setSearchResults, setSearchMode }) => {
  const [options, setOptions] = useState([]);
  const [results, setResults] = useState("");

  const copyData = data.slice();
  const handleSearch = (value) => {
    let options = [];
    let res = [];
    if (!value) {
      options = [];
    } else {
      copyData.forEach((questionObj) => {
        if (
          questionObj["Question"].toLowerCase().includes(value.toLowerCase()) ||
          questionObj["Category"].toLowerCase().includes(value.toLowerCase())
        ) {
          options.push({
            value: questionObj["Question"],
            label: (
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                {questionObj["Question"]}
              </div>
            ),
          });
          res.push(questionObj);
        }
      });
    }

    setOptions(options);
    setResults(res);
  };

  const handleEnter = () => {
    setSearchMode(true);
    setSearchResults(results);
  };
  const handleSelect = (value) => {
    let searchResults = results.filter((r) => r["Question"] === value);
    setSearchResults(searchResults);
  };

  return (
    <Row>
      <Col span={24}>
        <AutoComplete
          style={{ position: "relative", zIndex: 5, width: "100%" }}
          options={options}
          onSearch={handleSearch}
          onSelect={handleSelect}
        >
          <Input.Search
            style={{ position: "relative", zIndex: 5, top: -20 }}
            size="large"
            placeholder="Ask your question here"
            enterButton
            className="elevated"
            onSearch={handleEnter}
          />
        </AutoComplete>
      </Col>
    </Row>
  );
};

export default SearchBar;
