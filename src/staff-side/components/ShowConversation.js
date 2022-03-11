import React, { useEffect, useState } from "react";
import { PageHeader, Button, Descriptions, List, Badge, Tag, Space } from "antd";
import { useParams } from "react-router-dom";
import { api } from "../../api/api";

const data = [
  {
    title: "Ant Design Title 1",
  },
  {
    title: "Ant Design Title 2",
  },
  {
    title: "Ant Design Title 3",
  },
  {
    title: "Ant Design Title 4",
  },
];

const ShowConversation = () => {
  const [convo, setConvo] = useState({});
  let params = useParams();
  useEffect(() => {
    let isReady = true;
    const fetchConvo = async () => {
      try {
        const response = await api.get(`/conversations/${params.id}`);
        console.log("RESPONSE: ", response.data);
        if (isReady) {
          setConvo(response.data);
        }
      } catch (e) {
        console.log(e);
      }
    };

    fetchConvo();

    return () => {
      isReady = false;
    };
  }, []);
  if (Object.keys(convo).length <= 0) {
    return null;
  }
  return (
    <>
      <PageHeader
        ghost={false}
        style={{ backgroundColor: "#e6f7ff", marginBottom: 20 }}
        onBack={() => window.history.back()}
        title="Conversation"
        subTitle={`# ${convo.conversation.id}`}
        extra={[
          <Space>
            <Badge count={convo.queries.filter((q) => !q.resolved).length} />
            {convo.conversation.contact && (
              <>
                <Tag color="success">Contact</Tag>
                <Button key="1" type="primary">
                  Resolve
                </Button>
              </>
            )}
          </Space>,
        ]}
      >
        <Descriptions size="middle" column={2}>
          <Descriptions.Item label="Name">
            {convo.conversation.firstname} {convo.conversation.lastname}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{convo.conversation.email}</Descriptions.Item>
          <Descriptions.Item label="Program">{convo.conversation.program}</Descriptions.Item>
          <Descriptions.Item label="Date">{convo.conversation.date}</Descriptions.Item>
        </Descriptions>
      </PageHeader>

      <List
        itemLayout="horizontal"
        dataSource={convo.queries}
        size="large"
        renderItem={(item) => {
          let color = item.resolved ? "#b7eb8f" : "#ff7875";
          return (
            <List.Item
              className="elevated2"
              style={{ backgroundColor: "white", margin: 20, borderRight: `15px solid ${color}` }}
            >
              <List.Item.Meta title={`Q: ${item.question}`} description={`A: ${item.response}`} />
            </List.Item>
          );
        }}
      />
    </>
  );
};

export default ShowConversation;
