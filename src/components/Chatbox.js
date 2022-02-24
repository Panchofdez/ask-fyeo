import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Tooltip } from "antd";
import { MessageOutlined } from "@ant-design/icons";

const Chatbox = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [convo, setConvo] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady)
        setConvo([
          {
            user: "bot",
            response: "Welcome to Ask FYEO. How can I help you!?",
          },
        ]);
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, []);

  const showModal = () => {
    setIsModalVisible(true);
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const displayConvo = () => {
    return convo.map((r) => {
      if (r.user === "bot") {
        return (
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
            <div
              style={{
                float: "left",
                borderRadius: 20,
                padding: 10,
                backgroundColor: "#fafafa",
                maxWidth: "60%",
                marginBottom: 10,
              }}
              className="elevated"
            >
              {r.response}
            </div>
          </div>
        );
      } else {
        return (
          <div style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
            <div
              style={{
                borderRadius: 20,
                padding: 10,
                backgroundColor: "skyblue",
                opacity: 0.9,
                maxWidth: "60%",
                marginBottom: 10,
              }}
              className="elevated"
            >
              {r.response}
            </div>
          </div>
        );
      }
    });
  };

  const getBotResponse = () => {
    for (let i = convo.length - 1; i >= 0; i--) {
      if (convo[i].user === "bot") {
        return convo[i].response;
      }
    }
  };
  return (
    <>
      <Tooltip
        style={{ position: "fixed" }}
        title={getBotResponse()}
        trigger="hover"
        placement="topRight"
        defaultVisible
      >
        <Button
          style={{
            position: "fixed",
            bottom: 20,
            right: 20,
            borderRadius: 50,
            height: "5rem",
            width: "5rem",
            zIndex: 5,
          }}
          type="primary"
          onClick={showModal}
          icon={<MessageOutlined style={{ fontSize: "2rem" }} />}
        ></Button>
      </Tooltip>
      <Modal
        title="FYEO Chatbot"
        bodyStyle={{ minHeight: "400px" }}
        maskClosable={true}
        centered={true}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={isModalVisible}
        footer={[
          <Input
            style={{ flex: 1, height: 40 }}
            placeholder="Ask your question here"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            bordered={false}
            onPressEnter={(e) =>
              setConvo([
                ...convo,
                {
                  user: "123",
                  response: value,
                },
              ])
            }
          />,
        ]}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>{displayConvo()}</div>
      </Modal>
    </>
  );
};

export default Chatbox;
