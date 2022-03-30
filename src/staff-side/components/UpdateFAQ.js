import React, { useState, useEffect } from "react";
import { List, PageHeader, Tag, Card, Button, message, Row, Col, Input, Popconfirm } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../../api/api";

const UpdateFAQ = () => {
  const [currFAQ, setCurrFAQ] = useState({});
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
      const response = await api.put("/faq", currFAQ);
      const { FAQ } = response.data;
      console.log(FAQ);
      message.success("Successfully saved changes");
    } catch (e) {
      console.log(e);
      message.error(e.response.data.error);
    }
  };

  const addFAQ = async () => {
    const { tag, patterns, responses } = currFAQ;
    if (tag === "" || patterns.length === 0 || responses.length === 0) {
      message.error("You must add a tag and at least 1 valid response and possible question");
      return;
    }
    try {
      const response = await api.post("/faq", currFAQ);
      const { FAQ } = response.data;
      console.log(FAQ);
      message.success("You successfully added to the FAQ");
      navigate("/staff/faq");
    } catch (e) {
      console.log(e);
      message.error(e.response.data.error);
    }
  };
  const deleteFAQ = async () => {
    try {
      const { id } = currFAQ;
      console.log("id", id);
      const response = await api.delete(`/faq/${id}`);
      const { FAQ } = response.data;
      console.log(FAQ);
      message.success("Successfully saved changes");
      navigate("/staff/faq");
    } catch (e) {
      console.log(e);
      message.error(e.response.data.error);
    }
  };

  const addPattern = (value) => {
    let newFAQ = { ...currFAQ, patterns: [...currFAQ.patterns, value] };
    console.log(newFAQ);
    setCurrFAQ(newFAQ);
  };
  const addResponse = (value) => {
    let newFAQ = { ...currFAQ, responses: [...currFAQ.responses, value] };
    console.log(newFAQ);
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
                  onCancel={() => console.log("cancelled")}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button>Commit Changes</Button>
                </Popconfirm>,
                <Popconfirm
                  placement="bottomRight"
                  title="Are you sure to delete this from the FAQ?"
                  onConfirm={() => deleteFAQ()}
                  onCancel={() => console.log("cancelled")}
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
                  onCancel={() => console.log("cancelled")}
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
                title="Unique Tag/Label"
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
              header={<div style={{ fontSize: 18 }}>Possible Questions/Input</div>}
              footer={
                <Input.TextArea
                  // className="elevated"
                  rows={2}
                  allowClear
                  maxLength={200}
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
                  <List.Item.Meta description={item} />
                </List.Item>
              )}
            />

            <List
              className="elevated2"
              header={<div style={{ fontSize: 18 }}>Valid Responses</div>}
              footer={
                <Input.TextArea
                  className="elevated"
                  rows={4}
                  maxLength={1000}
                  allowClear
                  placeholder="Add a valid response and press enter"
                  onPressEnter={(e) => {
                    e.preventDefault();
                    addResponse(e.target.value);
                  }}
                />
              }
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
                  <List.Item.Meta description={item} />
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
