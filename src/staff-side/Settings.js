import React, { useState, useEffect } from "react";
import { Collapse, Row, Col, PageHeader, List, Avatar, message, Form, Input, Button, Popconfirm } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { api, setTokenHeader } from "../api/api";
import { useNavigate } from "react-router-dom";
const { Panel } = Collapse;

const Settings = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        getStaff();
      }
    };

    setUp();
    return () => {
      isReady = false;
    };
  }, []);

  const getStaff = async () => {
    try {
      const response = await api.get("/staff");
      const { staff } = response.data;
      setStaffMembers(staff);
    } catch (e) {
      message.error(e.response.data.error);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const removeStaff = async (id) => {
    try {
      const response = await api.delete(`/staff/${id}`);
      const { staff } = response.data;
      setStaffMembers(staff);
      message.success("Successfully removed staff member");
    } catch (e) {
      message.error(e.response.data.error);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const addStaff = async (email) => {
    try {
      const response = await api.post("/staff", { email });
      const { staff } = response.data;
      setStaffMembers(staff);
      message.success("Successfully added staff member");
    } catch (e) {
      message.error(e.response.data.error);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const onFinish = (values) => {
    const { email } = values;
    if (email.indexOf("@") === -1) {
      message.error("Invalid email");
      return;
    }
    const isRyersonEmail = email.split("@").at(1).startsWith("ryerson");
    if (!isRyersonEmail) {
      message.error("Must be a Ryerson email");
      return;
    }
    addStaff(email);
    form.resetFields();
  };

  const signOut = () => {
    setTokenHeader();
    localStorage.removeItem("token");
    navigate("/");
  };

  const [form] = Form.useForm();
  return (
    <>
      <PageHeader
        ghost={false}
        style={{ backgroundColor: "#e6f7ff", marginBottom: 10, minHeight: "150px" }}
        title="Settings"
      ></PageHeader>
      <Row style={{ padding: 20 }}>
        <Col span={24} style={{ position: "relative", top: -60 }}>
          <Collapse className="elevated2" defaultActiveKey={["1"]} accordion>
            <Panel header="Staff Access" key="1">
              <List
                itemLayout="horizontal"
                dataSource={staffMembers}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Popconfirm
                        placement="bottomRight"
                        title="Are you sure you want to remove this staff member and their access?"
                        onConfirm={(e) => {
                          e.preventDefault();
                          removeStaff(item.id);
                        }}
                        onCancel={(e) => {
                          message.error("Canceled");
                        }}
                        okText="Continue"
                        cancelText="Cancel"
                      >
                        <Button key="1" style={{ color: "red" }}>
                          Remove
                        </Button>
                      </Popconfirm>,
                    ]}
                  >
                    <List.Item.Meta avatar={<Avatar icon={<UserOutlined />} />} title={item.email} />
                  </List.Item>
                )}
              />
            </Panel>
            <Panel header="Add Staff Member" key="2">
              <Form
                name="basic"
                form={form}
                layout="inline"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={() => {}}
                autoComplete="off"
              >
                <Form.Item
                  label="Ryerson Email"
                  name="email"
                  rules={[{ required: true, message: "Please enter the staff member's ryerson email" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit">
                    Add
                  </Button>
                </Form.Item>
              </Form>
            </Panel>
            <Panel header="Sign Out" key="3">
              <Button type="primary" onClick={signOut}>
                Sign Out
              </Button>
            </Panel>
          </Collapse>
        </Col>
      </Row>
    </>
  );
};

export default Settings;
