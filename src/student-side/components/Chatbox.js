import React, { useState, useEffect } from "react";
import { Modal, Button, Input, Tooltip, Form, Select } from "antd";
import { MessageOutlined } from "@ant-design/icons";
import axios from "axios";

const NORMAL_STATE = "normal";
const CHECK_RESPONSE_STATE = "check";
const CONTACT_STATE = "contact";

const Chatbox = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [convo, setConvo] = useState([]);
  const [value, setValue] = useState("");
  const [chatState, setChatState] = useState(NORMAL_STATE);
  const [conversationDetails, setConversationDetails] = useState({});
  const [queries, setQueries] = useState([]);

  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady)
        setConvo([
          {
            user: "bot",
            response:
              "Welcome to Ask FYEO. Have any questions that you can't find on the FAQ? Ask your questions to our chatbot.",
          },
        ]);
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, []);

  const showModal = () => {
    console.log("Show form", showForm);
    if (showForm) {
      setIsModalVisible2(true);
    } else {
      setIsModalVisible(true);
    }
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const handleOk2 = () => {
    setIsModalVisible2(false);
  };
  const handleCancel2 = () => {
    setIsModalVisible2(false);
  };

  const displayConvo = () => {
    return convo.map((r, i) => {
      if (r.user === "bot") {
        return (
          <div key={i} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-start" }}>
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
          <div key={i} style={{ display: "flex", flexDirection: "row", justifyContent: "flex-end" }}>
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

  const fetchResponse = async (question) => {
    console.log("QUESTION: ", question);
    try {
      const conversation_id = conversationDetails.id;
      console.log("CONVO ID: ", conversation_id);
      const botResponse = await axios.post(`http://127.0.0.1:5000/chat/answer`, {
        question,
        conversation_id,
      });
      const { query } = botResponse.data;
      const { id, response } = query;
      console.log("BOT RESPONSE: ", query);
      setConvo([
        ...convo,
        { user: "123", response: question },
        { user: "bot", response },
        { user: "bot", response: "Was I able to answer your question?" },
      ]);

      //Update the queries object
      setQueries([...queries, id]);
      setChatState(CHECK_RESPONSE_STATE);
    } catch (err) {
      console.log(err);
    }
  };

  const onFinish = async (values) => {
    try {
      console.log("Success:", values);
      const response = await axios.post("http://127.0.0.1:5000/chat/start", values);
      const { conversation } = response.data;
      console.log("Conversation: ", conversation);
      setConversationDetails(conversation);
      setConvo([
        {
          user: "bot",
          response: "Hello I am the Ask FYEO chatbot. Ask me your question!",
        },
      ]);
      setIsModalVisible2(false);
      setIsModalVisible(true);
      setShowForm(false);
    } catch (e) {
      console.log(e);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const resolveQuery = async () => {
    try {
      const conversation_id = conversationDetails.id;
      const query_id = queries[queries.length - 1];
      console.log("RESOLVE QUERY:");
      console.log("conversation_id: ", conversation_id);
      console.log("query_id: ", query_id);
      const response = await axios.put(`http://127.0.0.1:5000/chat/resolve`, { conversation_id, query_id });
      const { query } = response.data;
      setQueries([...queries, query.id]);
    } catch (e) {
      console.log(e);
    }
  };

  const contactStudent = async () => {
    try {
      const conversation_id = conversationDetails.id;
      const response = await axios.put(`http://127.0.0.1:5000/chat/contact`, { conversation_id });
      const { conversation } = response.data;
      setConversationDetails(conversation);
    } catch (e) {
      console.log(e);
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
        footer={
          chatState !== NORMAL_STATE
            ? [
                <Button
                  type="primary"
                  onClick={() => {
                    if (chatState === CHECK_RESPONSE_STATE) {
                      resolveQuery();
                      setConvo([
                        ...convo,
                        { user: "123", response: "Yes" },
                        { user: "bot", response: "Great! ask me another question" },
                      ]);
                      setChatState(NORMAL_STATE);
                    } else {
                      contactStudent();
                      setConvo([
                        ...convo,
                        { user: "123", response: "Yes" },
                        {
                          user: "bot",
                          response: "Great one of our FYEO staff members will contact you in the upcoming days.",
                        },
                        { user: "bot", response: "Ask me another question!" },
                      ]);
                      setChatState(NORMAL_STATE);
                    }
                  }}
                >
                  Yes
                </Button>,
                <Button
                  onClick={() => {
                    if (chatState === CHECK_RESPONSE_STATE) {
                      setConvo([
                        ...convo,
                        { user: "123", response: "No" },
                        {
                          user: "bot",
                          response:
                            "If we are unable to answer your question you can either ask your question again or send an email to firstyeareng@ryerson.ca or one of our FYEO staff can reach out to you",
                        },
                        {
                          user: "bot",
                          response: "Do you prefer to be contacted by a staff member instead?",
                        },
                      ]);
                      setChatState(CONTACT_STATE);
                    } else {
                      setConvo([
                        ...convo,
                        { user: "123", response: "No" },
                        { user: "bot", response: "Ok then! Ask me another question if you have more" },
                      ]);
                      setChatState(NORMAL_STATE);
                    }
                  }}
                >
                  No
                </Button>,
              ]
            : [
                <Input
                  style={{ flex: 1, height: 40, borderWidth: 0 }}
                  placeholder="Ask your question here"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  bordered={false}
                  onPressEnter={(e) => {
                    fetchResponse(value);
                    setValue("");
                  }}
                />,
              ]
        }
      >
        <div style={{ display: "flex", flexDirection: "column" }}>{displayConvo()}</div>
      </Modal>
      <Modal
        title="FYEO Chatbot"
        bodyStyle={{ minHeight: "400px" }}
        maskClosable={true}
        centered={true}
        onOk={handleOk2}
        onCancel={handleCancel2}
        visible={isModalVisible2}
        footer={null}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="First Name"
              name="firstname"
              rules={[{ required: true, message: "Please input your first name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Last Name"
              name="lastname"
              rules={[{ required: true, message: "Please input your last name" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item name="program" label="Program" rules={[{ required: true }]}>
              <Select placeholder="Select your program" allowClear>
                <Select.Option value="Aerospace">Aerospace</Select.Option>
                <Select.Option value="Biomedical">Biomedical</Select.Option>
                <Select.Option value="Chemical">Chemical</Select.Option>
                <Select.Option value="Civil">Civil</Select.Option>
                <Select.Option value="Computer">Computer</Select.Option>
                <Select.Option value="Electrical">Electrical</Select.Option>
                <Select.Option value="Industrial">Industrial</Select.Option>
                <Select.Option value="Mechanical">Mechanical</Select.Option>
                <Select.Option value="Undeclared">Undeclared</Select.Option>
                <Select.Option value="Other">Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your Ryerson email" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Chatbox;
