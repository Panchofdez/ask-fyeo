import React, { useEffect, useState } from "react";
import { List, PageHeader, Tag, Card, Button, Space } from "antd";
import { api } from "../api/api";
import { useNavigate } from "react-router-dom";

const FAQList = () => {
  const [faq, setFaq] = useState([]);

  const navigate = useNavigate();
  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        console.log("Retrieving all convos");
        getFAQ();
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
      console.log(FAQ);
      setFaq(FAQ);
    } catch (e) {
      console.log(e);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  return (
    <>
      <PageHeader
        title="FAQ"
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="Frequently asked questions"
        extra={[
          <Button
            onClick={() =>
              navigate("/staff/faq/update", { state: { faq: { tag: "", patterns: [], responses: [] }, mode: "add" } })
            }
          >
            Add To FAQ
          </Button>,
          <Button>Train Model</Button>,
        ]}
      >
        {/* <Row>
          <Space size={30}>
            <Statistic title="# Convos" value={conversations.length} />
            <Statistic title="# Pending" value={conversations.filter((c) => c.contact).length} />
            <Statistic title="# Unresolved" value={conversations.reduce((prev, c) => prev + c.unresolved, 0)} />
          </Space>
        </Row> */}
      </PageHeader>
      <List
        itemLayout="vertical"
        size="large"
        dataSource={faq}
        renderItem={(item) => (
          <List.Item key={item.tag}>
            <Card
              className="elevated2"
              title={item.tag}
              extra={
                <Space>
                  <Button onClick={() => navigate("/staff/faq/update", { state: { faq: item, mode: "update" } })}>
                    Update
                  </Button>
                </Space>
              }
            >
              <Card.Meta
                style={{ marginBottom: 10 }}
                description={item.patterns.map((p) => (
                  <Tag color="cyan" style={{ marginBottom: 5 }}>
                    {p}
                  </Tag>
                ))}
              />
              {item.responses.map((r) => (
                <Card type="inner">{r}</Card>
              ))}
            </Card>
          </List.Item>
        )}
      />
    </>
  );
};

export default FAQList;
