import React, { useState, useEffect } from "react";
import { List, PageHeader, Tag, Card, Button, message, Row, Col, Input, Popconfirm, Popover, Space } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";
import { InfoCircleOutlined } from "@ant-design/icons";
// Import DOMPurify
const DOMPurify = require("dompurify")(window);

const UpdateFAQ = () => {
  const [currFAQ, setCurrFAQ] = useState({});
  const [textarea, setTextarea] = useState("");
  const [viewMode, setViewMode] = useState(false);
  const { state } = useLocation();
  const navigate = useNavigate();
  const { faq, mode } = state;
  useEffect(() => {
    let isReady = true;
    const setup = () => {
      if (isReady && faq) {
        setCurrFAQ(faq);
      }
    };
    setup();
    return () => {
      isReady = false;
    };
  }, [faq]);

  const updateFAQ = async () => {
    try {
      await api.put(`/faq/${currFAQ.id}`, currFAQ);
      message.success("Successfully saved changes");
    } catch (e) {
      message.error(e.response.data.error, 10);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const addFAQ = async () => {
    const { tag, patterns, responses, for_staff } = currFAQ;
    if (tag === "" || patterns.length === 0 || responses.length === 0) {
      message.error("You must add a tag and at least 1 valid response and possible question");
      return;
    }
    try {
      await api.post("/faq", currFAQ);
      message.success("You successfully added to the FAQ");
      if (for_staff){
        navigate("/staff/faq/staff");
      }else{
        navigate("/staff/faq");
      }  
    } catch (e) {
      message.error(e.response.data.error, 10);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };
  const deleteFAQ = async () => {
    try {
      const { id, for_staff } = currFAQ;
      await api.delete(`/faq/${id}`);
      message.success("Successfully saved changes");
      if (for_staff){
        navigate("/staff/faq/staff");
      }else{
        navigate("/staff/faq");
      }
    } catch (e) {
      message.error(e.response.data.error);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const addPattern = (value) => {
    let newFAQ = { ...currFAQ, patterns: [...currFAQ.patterns, value] };
    setCurrFAQ(newFAQ);
  };
  const addResponse = (value) => {
    let newFAQ = { ...currFAQ, responses: [...currFAQ.responses, value] };
    setCurrFAQ(newFAQ);
  };

  const removePattern = (pattern) => {
    let newFAQ = { ...currFAQ, patterns: currFAQ.patterns.filter((p) => p !== pattern) };
    setCurrFAQ(newFAQ);
  };
  const removeResponse = (response) => {
    let newFAQ = { ...currFAQ, responses: currFAQ.responses.filter((r) => r !== response) };
    setCurrFAQ(newFAQ);
  };

  const addTag = (tag) => {
    let newFAQ = { ...currFAQ, tag };
    setCurrFAQ(newFAQ);
  };

  if (Object.keys(currFAQ).length === 0) {
    return null;
  }

  return (
    <>
      <PageHeader
        title={mode === "update" ? currFAQ.tag : "Add FAQ"}
        onBack={() => window.history.back()}
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
        tags={<Tag color="blue">{mode}</Tag>}
        extra={
          mode === "update"
            ? [
                <Popconfirm
                  placement="bottomRight"
                  title="Are you sure to commit changes?"
                  onConfirm={() => {
                    updateFAQ();
                  }}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Commit Changes</Button>
                </Popconfirm>,
                <Popconfirm
                  placement="bottomRight"
                  title="Are you sure to delete this from the FAQ?"
                  onConfirm={() => deleteFAQ()}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete</Button>{" "}
                </Popconfirm>,
              ]
            : [
                <Popconfirm
                  placement="bottomRight"
                  title="Are you sure to add this to the FAQ"
                  onConfirm={() => addFAQ()}
                  onCancel={() => {}}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Add</Button>
                </Popconfirm>,
              ]
        }
      ></PageHeader>
      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          flex: 1,
          position: "relative",
          top: -60,
        }}
      >
        <Row>
          <Col span={2}></Col>
          <Col span={20}>
            {mode === "add" && (
              <Card
                style={{ marginBottom: 20 }}
                title={
                  <div style={{ fontSize: "18px", fontWeight: "normal" }}>
                    <Space>
                      Unique Tag/Label
                      <Popover
                        placement="bottom"
                        content={
                          <div style={{ maxWidth: "300px" }}>
                            Each FAQ needs a unique identifier/tag that describes the FAQ
                          </div>
                        }
                      >
                        <InfoCircleOutlined />
                      </Popover>
                    </Space>
                  </div>
                }
                className="elevated2"
                extra={
                  <Input
                    style={{ minWidth: 400 }}
                    allowClear
                    maxLength={100}
                    placeholder="Add a Tag and press enter"
                    onPressEnter={(e) => {
                      e.preventDefault();
                      addTag(e.target.value);
                    }}
                  />
                }
              >
                <h3>{currFAQ.tag}</h3>
              </Card>
            )}

            <List
              className="elevated2"
              header={
                <div style={{ fontSize: 18 }}>
                  <Space>
                    Possible Questions/Input
                    <Popover
                      placement="bottom"
                      content={
                        <div style={{ maxWidth: "300px" }}>
                          Possible ways students can ask their question related to the FAQ. These questions will be used
                          as training data for the chatbot. More questions means the chatbot will understand more types
                          of questions and be more accurate
                        </div>
                      }
                    >
                      <Space>
                        <InfoCircleOutlined />
                      </Space>
                    </Popover>
                  </Space>
                </div>
              }
              footer={
                <Input.TextArea
                  // className="elevated"
                  rows={2}
                  allowClear
                  placeholder="Add a possible question and press enter"
                  onPressEnter={(e) => {
                    e.preventDefault();
                    addPattern(e.target.value);
                  }}
                />
              }
              style={{ backgroundColor: "white", marginBottom: 20 }}
              itemLayout="vertical"
              size="large"
              bordered
              dataSource={currFAQ.patterns}
              renderItem={(item, idx) => (
                <List.Item
                  key={idx}
                  extra={
                    <Button onClick={() => removePattern(item)} danger>
                      Remove
                    </Button>
                  }
                >
                  {item}
                </List.Item>
              )}
            />

            <List
              className="elevated2"
              header={
                <div style={{ fontSize: 18 }}>
                  <Space>
                    Valid Responses
                    <Popover
                      placement="bottom"
                      content={
                        <div style={{ maxWidth: "300px" }}>
                          Possible ways the chatbot can answer. When the chatbot classifies a student response as the
                          current FAQ it will choose randomly from these provided responses
                        </div>
                      }
                    >
                      <Space>
                        <InfoCircleOutlined />
                      </Space>
                    </Popover>
                  </Space>
                </div>
              }
              footer={[
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {viewMode ? (
                    <Card type="inner" style={{ wordWrap: "break-word" }}>
                      <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(textarea) }} />
                    </Card>
                  ) : (
                    <Input.TextArea
                      // className="elevated"
                      rows={8}
                      style={{ width: "100%" }}
                      allowClear
                      placeholder="Add a valid response"
                      value={textarea}
                      onChange={(e) => setTextarea(e.target.value)}
                    />
                  )}

                  <Space>
                    <Button style={{ marginTop: 10 }} onClick={() => addResponse(textarea)}>
                      Add Response
                    </Button>
                    {viewMode ? (
                      <Button style={{ marginTop: 10 }} onClick={() => setViewMode(false)}>
                        Edit
                      </Button>
                    ) : (
                      <Button style={{ marginTop: 10 }} onClick={() => setViewMode(true)}>
                        View
                      </Button>
                    )}
                  </Space>
                </div>,
              ]}
              style={{ backgroundColor: "white", marginBottom: 20 }}
              itemLayout="vertical"
              size="large"
              bordered
              dataSource={currFAQ.responses}
              renderItem={(item, idx) => (
                <List.Item
                  key={idx}
                  extra={
                    <Button onClick={() => removeResponse(item)} danger>
                      Remove
                    </Button>
                  }
                >
                  {item}
                </List.Item>
              )}
            />
          </Col>
          <Col span={2}></Col>
        </Row>
      </div>
    </>
  );
};

export default UpdateFAQ;
