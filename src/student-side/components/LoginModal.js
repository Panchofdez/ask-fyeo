import React from "react";
import { Modal, Form, Input, Button } from "antd";
import { useNavigate } from "react-router-dom";
import { api, setTokenHeader } from "../../api/api";
import { message } from "antd";

const LoginModal = ({ showLogin, setShowLogin }) => {
  let navigate = useNavigate();
  const [form] = Form.useForm();
  const handleOk = () => {
    setShowLogin(false);
  };
  const handleCancel = () => {
    setShowLogin(false);
  };

  const onFinish = async (values) => {
    try {
      const response = await api.post("/login", values);
      const { token } = response.data;
      form.resetFields();
      localStorage.setItem("token", token);
      setTokenHeader(token);

      setShowLogin(false);
      navigate("/staff");
    } catch (e) {
      message.error(e.response.data.error);
    }
  };

  return (
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
          form={form}
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={() => {}}
          autoComplete="off"
        >
          <Form.Item
            label="TMU Email"
            name="email"
            rules={[{ required: true, message: "Please input your official school email" }]}
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

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default LoginModal;
