import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Modal, Form, Input, Button } from "antd";
import { api, setTokenHeader } from "../../api/api";
import { message } from "antd";

const Footer = () => {
  const [showLogin, setShowLogin] = useState(false);
  let navigate = useNavigate();

  const handleOk = () => {
    setShowLogin(false);
  };
  const handleCancel = () => {
    setShowLogin(false);
  };

  const onFinish = async (values) => {
    try {
      console.log("Success:", values);
      const response = await api.post("/login", values);
      const { token } = response.data;
      console.log("token: ", token);
      localStorage.setItem("token", token);
      setTokenHeader(token);
      setShowLogin(false);
      navigate("/staff");
    } catch (e) {
      console.log(e);
      message.error(e.response.data.error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <div style={{ marginRight: 50 }}>
          <h3 style={{ fontWeight: "bold" }}>Question not answered?</h3>
          <p>Contact us at firstyeareng@ryerson.ca</p>
        </div>
        <div>
          <h3 style={{ fontWeight: "bold" }}>Are you an FYEO employee? </h3>
          <Button onClick={() => setShowLogin(true)}>Sign in</Button>
        </div>
      </div>
      <Modal
        title="Staff Login"
        bodyStyle={{ minHeight: "400px" }}
        maskClosable={true}
        centered={true}
        onOk={handleOk}
        onCancel={handleCancel}
        visible={showLogin}
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
              label="Email"
              name="email"
              rules={[{ required: true, message: "Please input your Ryerson email" }]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="FYEO password"
              name="password"
              rules={[{ required: true, message: "Please input the FYEO password" }]}
            >
              <Input.Password />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 6, span: 18 }}>
              <Button type="primary" htmlType="submit">
                Login
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default Footer;
