import React, { useState, useEffect } from "react";
import { PageHeader, Tag, Statistic, Row, Space } from "antd";
import { api } from "../api/api";
import DataTable from "./components/DataTable";
import DateSetter from "./components/DateSetter";

const ConversationList = () => {
  const [conversations, setConversations] = useState([]);
  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        console.log("Retrieving all convos");
        getAllConversations();
      }
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, []);
  const getAllConversations = async () => {
    try {
      const response = await api.get("/conversations");
      const { conversations } = response.data;
      console.log("Conversations: ", conversations);
      setConversations(conversations);
    } catch (e) {
      console.log(e);
    }
  };

  const getConversationsByDate = async (year, month, day) => {
    try {
      console.log(year, month, day);
      const response = await api.get(`/conversations/date?year=${year}&month=${month}&day=${day}`);
      const { conversations } = response.data;
      console.log("Conversations by date: ", conversations);
      setConversations(conversations);
    } catch (e) {
      console.log(e);
    }
  };

  const getConversationsByDateRange = async (startYear, startMonth, startDay, endYear, endMonth, endDay) => {
    try {
      console.log(startYear, startMonth, startDay, endYear, endMonth, endDay);
      const response = await api.get(
        `/conversations/daterange?startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`
      );
      const { conversations } = response.data;
      console.log("Conversations by date: ", conversations);
      setConversations(conversations);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <PageHeader
        title="Conversations"
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
        tags={<Tag color="blue">Running</Tag>}
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
