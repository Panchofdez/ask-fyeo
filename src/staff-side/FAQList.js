import React, { useEffect, useState } from "react";
import { List, PageHeader, Tag, Card, Button, Space, Statistic } from "antd";
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
            key={1}
            onClick={() =>
              navigate("/staff/faq/update", { state: { faq: { tag: "", patterns: [], responses: [] }, mode: "add" } })
            }
          >
            Add To FAQ
          </Button>,
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
        renderItem={(item, i) => (
          <List.Item key={item.tag}>
            <Card
              className="elevated2"
              title={item.tag}
              extra={
                <Space>
                  <Button onClick={() => navigate("/staff/faq/update", { state: { faq: item, mode: "update" } })}>
                    Update
                  </Button>
                  <Button onClick={() => navigate(`/staff/faq/${item.id}`, { state: { faq: item } })}>
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
              <Card.Meta
                style={{ marginBottom: 10 }}
                description={item.patterns.map((p, i) => (
                  <Tag key={i} color="cyan" style={{ marginBottom: 5 }}>
                    {p}
                  </Tag>
                ))}
              />
              {item.responses.map((r, i) => (
                <Card key={i} type="inner" style={{ wordWrap: "break-word" }}>
                  {r}
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
