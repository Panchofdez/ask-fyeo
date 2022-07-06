import React, { useState, useEffect, useCallback } from "react";
import { PageHeader, Statistic, Row, Space, message } from "antd";
import { api } from "../api/api";
import DataTable from "./components/DataTable";
import DateSetter from "./components/DateSetter";
import { useNavigate } from "react-router-dom";

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  const getAllConversations = useCallback(async () => {
    try {
      const response = await api.get("/conversations");
      const { conversations } = response.data;
      setConversations(conversations);
    } catch (e) {
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  }, [navigate]);

  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        getAllConversations();
      }
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, [getAllConversations]);

  const getConversationsByDate = async (year, month, day) => {
    try {
      const response = await api.get(`/conversations/date?year=${year}&month=${month}&day=${day}`);
      const { conversations } = response.data;
      setConversations(conversations);
    } catch (e) {
      message.error(e.response.data.error);
    }
  };

  const getConversationsByDateRange = async (startYear, startMonth, startDay, endYear, endMonth, endDay) => {
    try {
      const response = await api.get(
        `/conversations/daterange?startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`
      );
      const { conversations } = response.data;
      setConversations(conversations);
    } catch (e) {
      message.error(e.response.data.error);
    }
  };
  console.log(conversations);
  return (
    <>
      <PageHeader
        title="Conversations"
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
        subTitle="Student convos with the chatbot"
        extra={[
          <DateSetter
            key={1}
            getByDate={getConversationsByDate}
            getByDateRange={getConversationsByDateRange}
            getAll={getAllConversations}
          />,
        ]}
      >
        <Row>
          <Space size={30}>
            <Statistic title="# Convos" value={conversations.length} />
            <Statistic title="# Pending" value={conversations.filter((c) => c.contact).length} />
            <Statistic title="# Unresolved" value={conversations.reduce((prev, c) => prev + c.unresolved, 0)} />
          </Space>
        </Row>
      </PageHeader>

      <DataTable data={conversations} type="conversations" />
    </>
  );
};

export default ConversationList;
