import React, { useEffect, useState } from "react";
import { PageHeader, Button, Descriptions, List, Badge, Tag, Space, Popconfirm, message } from "antd";
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

  const updateConversation = async (conversationId) => {
    try {
      const response = await api.put(`/conversation/${conversationId}`);
      console.log(response.data);
      setConvo(response.data);
    } catch (e) {
      console.log(e);
      message.error("Error updating conversation");
    }
  };

  function confirm(e) {
    e.preventDefault();
    updateConversation(convo.conversation.id);
    message.success("Successfully updated conversation");
  }

  function cancel(e) {
    console.log(e);
    message.error("Canceled");
  }

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
          <Space key="1">
            <Badge count={convo.queries.filter((q) => !q.resolved).length} />
            {convo.conversation.contact && (
              <>
                <Tag color="success">Contact</Tag>
                <Popconfirm
                  placement="bottomRight"
                  title="This indicates you have contacted the student and handled all their questions"
                  onConfirm={confirm}
                  onCancel={cancel}
                  okText="Continue"
                  cancelText="Cancel"
                >
                  <Button type="primary">Resolve</Button>
                </Popconfirm>
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
