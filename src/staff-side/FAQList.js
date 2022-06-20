import React, { useEffect, useState } from "react";
import { List, PageHeader, Tag, Card, Button, Space, Statistic, Row, Col, Input, Popover, message } from "antd";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";
import { InfoCircleOutlined } from "@ant-design/icons";
// Import DOMPurify
const DOMPurify = require("dompurify")(window);

const FAQList = () => {
  const [faq, setFaq] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        getFAQ();
        if (sessionStorage.getItem("searchValue")) {
          setSearchValue(sessionStorage.getItem("searchValue"));
        }
      }
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, []);

  const getFAQ = async () => {
    try {
      const response = await api.get("/faq");
      const { FAQ } = response.data;
      setFaq(FAQ);
    } catch (e) {
      message.error(e.response.data.error);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const filterFAQ = (faq, searchVal) => {
    if (faq.length > 0) {
      return faq.filter(
        (f) =>
          f.tag.toLowerCase().indexOf(searchVal.toLowerCase()) !== -1 ||
          f.patterns.join(" ").toLowerCase().indexOf(searchVal.toLowerCase()) !== -1
      );
    }
    return faq;
  };

  return (
    <>
      <PageHeader
        title="FAQ"
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px", marginBottom: 20 }}
        tags={
          <Popover
            placement="bottom"
            content={
              <div style={{ maxWidth: "400px" }}>
                For each FAQ we have 3 statistics:
                <ul>
                  <li>
                    # Questions: Number of student questions which the chatbot has classified as the corresponding FAQ
                  </li>
                  <li>
                    Hit Rate: The percentage of all total questions asked that have been classified as the corresponding
                    FAQ
                  </li>
                  <li>
                    Success Rate: The percentage of all the questions classified as the corresponding FAQ that have
                    resulted in a successful answer
                  </li>
                </ul>
              </div>
            }
            title="Documentation"
          >
            <InfoCircleOutlined />
          </Popover>
        }
        subTitle="Frequently asked questions"
        extra={[
          <Button
            key={1}
            onClick={() => {
              sessionStorage.setItem("searchValue", searchValue);
              navigate("/staff/faq/update", { state: { faq: { tag: "", patterns: [], responses: [] }, mode: "add" } });
            }}
          >
            Add To FAQ
          </Button>,
        ]}
      >
        <Row>
          <Space size={30}>
            <Statistic title="Total #" value={faq.length - 1} />
          </Space>
        </Row>
        <Row>
          <Col xs={24} md={12}>
            <Input
              size="large"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search"
              className="elevated"
              style={{ borderRadius: 20, position: "relative", top: 35 }}
            />
          </Col>
          <Col xs={24} md={12}></Col>
        </Row>
      </PageHeader>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={filterFAQ(faq, searchValue)}
        renderItem={(item, i) => (
          <List.Item key={item.tag}>
            <Card
              className="elevated2"
              title={item.tag}
              extra={
                <Space>
                  {item.tag !== "Other" && (
                    <Button
                      onClick={() => {
                        sessionStorage.setItem("searchValue", searchValue);
                        navigate("/staff/faq/update", { state: { faq: item, mode: "update" } });
                      }}
                    >
                      Update
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      sessionStorage.setItem("searchValue", searchValue);
                      navigate(`/staff/faq/${item.id}`, { state: { faq: item } });
                    }}
                  >
                    View Details
                  </Button>
                </Space>
              }
              actions={[
                <Statistic
                  key={1}
                  title="# Questions"
                  value={item.queries}
                  precision={0}
                  valueStyle={{ color: "#3f8600" }}
                />,
                <Statistic
                  key={2}
                  title="Hit Rate"
                  value={item.hit_rate}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="%"
                />,
                <Statistic
                  key={3}
                  title="Success Rate"
                  value={item.success_rate}
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
                  suffix="%"
                />,
              ]}
            >
              {item.tag !== "Other" && (
                <Card.Meta
                  style={{ marginBottom: 10 }}
                  title={
                    <p style={{ fontSize: 14, fontWeight: "normal" }}>{`Last Updated: ${
                      item.last_updated ? item.last_updated.split(" ").slice(0, 4).join(" ") : ""
                    }`}</p>
                  }
                  description={item.patterns.map((p, i) => (
                    <Tag key={i} color="cyan" style={{ marginBottom: 5 }}>
                      {p}
                    </Tag>
                  ))}
                />
              )}

              {item.responses.map((r, i) => (
                <Card key={i} type="inner" style={{ wordWrap: "break-word" }}>
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r) }} />
                </Card>
              ))}
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default FAQList;
