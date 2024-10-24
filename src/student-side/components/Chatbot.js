import React, { useState } from "react";
import { Card, Form, Select, Button, Input, message, Space } from "antd";
import { api } from "../../api/api";
import Mascot from "./Mascot";
const NORMAL_STATE = "normal";
const CHECK_RESPONSE_STATE = "check";
const CONTACT_STATE = "contact";
const WAITING_STATE = "wait";

// Import DOMPurify
const DOMPurify = require("dompurify")(window);

const Chatbot = () => {
  const [chatState, setChatState] = useState(NORMAL_STATE);
  const [conversationDetails, setConversationDetails] = useState({});
  const [queries, setQueries] = useState([]);
  const [showForm, setShowForm] = useState(true);
  const [convo, setConvo] = useState([]);
  const [value, setValue] = useState("");
  const [mascotType, setMascotType] = useState(4);

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
                wordWrap: "break-word",
              }}
              className="elevated"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(r.response) }}
            ></div>
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
                wordWrap: "break-word",
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

  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  const fetchResponse = async (question, convoState) => {
    convoState = [...convoState, { user: "123", response: question }];
    setConvo(convoState);
    try {
      setChatState(WAITING_STATE);
      await sleep(2000);
      const conversation_id = conversationDetails.id;
      const botResponse = await api.post("/chat/answer", {
        question,
        conversation_id,
      });
      const { query } = botResponse.data;
      const { id, response } = query;
      convoState = [
        ...convoState,
        { user: "bot", response },
        { user: "bot", response: "Was I able to answer your question?" },
      ];
      setConvo(convoState);

      //Update the queries object
      setQueries([...queries, id]);
      setMascotType(3);
      setChatState(CHECK_RESPONSE_STATE);
    } catch (e) {
      message.error(e.response.data.error);
      setConvo([
        ...convoState,
        {
          user: "bot",
          response: "I'm sorry there seems to be an error please try again",
        },
      ]);
      setChatState(NORMAL_STATE);
    }
  };

  const onFinish = async (values) => {
    try {
      let email = values.email;
      let studentId = values.student_id;
      if (email.toLowerCase().indexOf("ryerson.ca") === -1 && email.toLowerCase().indexOf("torontomu.ca") === -1) {
        message.error("Invalid Email, please try again");
        return;
      }

      if (!/^[0-9]+$/.test(studentId)) {
        message.error("Invalid student id format, please try again");
        return;
      }
      const response = await api.post("/chat/start", values);
      const { conversation } = response.data;

      setConversationDetails(conversation);
      setConvo([
        ...convo,
        {
          user: "bot",
          response: `Hello ${values.firstname}, it's nice to meet you! I am the FYEO chatbot and I'm here to answer any of your questions about your first year of engineering. Ask me your question!`,
        },
      ]);
      setMascotType(2);
      setShowForm(false);
    } catch (e) {
      message.error(e.response.data.error);
    }
  };

  const resolveQuery = async (convoState) => {
    convoState = [...convoState, { user: "123", response: "Yes" }];
    setConvo(convoState);
    try {
      setChatState(WAITING_STATE);
      await sleep(1000);
      const conversation_id = conversationDetails.id;
      const query_id = queries[queries.length - 1];
      const response = await api.put("chat/resolve", { conversation_id, query_id });
      const { query } = response.data;
      setQueries([...queries, query.id]);
      convoState = [...convoState, { user: "bot", response: "Great! Do you have any other questions?" }];
      setConvo(convoState);
      setChatState(NORMAL_STATE);
      setMascotType(0);
    } catch (e) {
      message.error(e.response.data.error);
      setConvo([
        ...convoState,
        {
          user: "bot",
          response: "I'm sorry there seems to be an error please try again",
        },
      ]);
      setChatState(CHECK_RESPONSE_STATE);
    }
  };

  const contactStudent = async (convoState) => {
    convoState = [...convoState, { user: "123", response: "Yes" }];
    setConvo(convoState);
    try {
      setChatState(WAITING_STATE);
      await sleep(1000);
      const conversation_id = conversationDetails.id;
      const response = await api.put("/chat/contact", { conversation_id });
      const { conversation } = response.data;
      setConversationDetails(conversation);
      convoState = [
        ...convoState,
        {
          user: "bot",
          response:
            "Ok! One of our FYEO team members will contact you in the next 2-3 working days. You can also drop by the FYEO in ENG 340A Monday to Friday from 9 am to 5 pm.",
        },
        { user: "bot", response: "Ask me another question!" },
      ];
      setConvo(convoState);
      setChatState(NORMAL_STATE);
      setMascotType(2);
    } catch (e) {
      message.error(e.response.data.error);
      setConvo([
        ...convoState,
        {
          user: "bot",
          response: "I'm sorry there seems to be an error please try again",
        },
      ]);
      setChatState(CONTACT_STATE);
    }
  };

  const inaccurateResponse = async (convoState) => {
    convoState = [...convoState, { user: "123", response: "No" }];
    setConvo(convoState);
    setChatState(WAITING_STATE);
    await sleep(1000);

    convoState = [
      ...convoState,
      {
        user: "bot",
        response:
          "I'm sorry that I was not able to answer your question. Please send your question to firstyeareng@torontomu.ca and one of our team members will be able to assist you. ",
      },
      { user: "bot", response: "Ask me another question if you have more" },
    ];
    setConvo(convoState);
    setChatState(NORMAL_STATE);
    setMascotType(1);
  };

  const denyContact = async (convoState) => {
    convoState = [...convoState, { user: "123", response: "No" }];
    setConvo(convoState);
    setChatState(WAITING_STATE);
    await sleep(1000);
    convoState = [...convoState, { user: "bot", response: "Ok then! Ask me another question if you have more" }];
    setConvo(convoState);
    setChatState(NORMAL_STATE);
    setMascotType(2);
  };

  if (!showForm) {
    return (
      <Card
        className="elevated rounded"
        title="FYEO Chatbot"
        bodyStyle={{ height: "70vh", overflowY: "auto", display: "flex", flexDirection: "column-reverse" }}
        actions={
          chatState !== NORMAL_STATE
            ? chatState !== WAITING_STATE
              ? [
                  <Button
                    type="primary"
                    onClick={() => {
                      if (chatState === CHECK_RESPONSE_STATE) {
                        resolveQuery(convo);
                      } else {
                        // contactStudent(convo);
                      }
                    }}
                  >
                    Yes
                  </Button>,
                  <Button
                    onClick={() => {
                      if (chatState === CHECK_RESPONSE_STATE) {
                        inaccurateResponse(convo);
                      } else {
                        // denyContact(convo);
                      }
                    }}
                  >
                    No
                  </Button>,
                ]
              : []
            : [
                <Input
                  style={{ flex: 1, height: 40, borderWidth: 0 }}
                  placeholder="Ask your question here"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  bordered={false}
                  onPressEnter={(e) => {
                    fetchResponse(value, convo);
                    setValue("");
                  }}
                />,
              ]
        }
      >
        <Mascot type={mascotType} />
        {chatState === WAITING_STATE && (
          <div
            style={{
              float: "left",
              padding: 10,
              backgroundColor: "transparent",
              maxWidth: "60%",
              marginBottom: 10,
              paddingLeft: 20,
            }}
          >
            <div className="dot-pulse"></div>
          </div>
        )}
        <div style={{ display: "flex", flexDirection: "column" }}>{displayConvo()}</div>
      </Card>
    );
  } else {
    return (
      <Card
        title="Hello, ask me a question!"
        className="elevated rounded"
        bodyStyle={{ minHeight: "70vh" }}
        footer={null}
        extra={<Mascot type={mascotType} />}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <Form
            name="basic"
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={() => {}}
            autoComplete="off"
          >
            <Form.Item
              label="Student ID"
              name="student_id"
              rules={[{ required: true, message: "Please input your student id" }]}
            >
              <Input />
            </Form.Item>
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
              label="TMU Email"
              name="email"
              rules={[{ required: true, message: "Please input your official school email" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit">
                Ask your question
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Card>
    );
  }
};

export default Chatbot;
