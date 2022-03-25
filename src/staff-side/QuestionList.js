import React, { useState, useEffect } from "react";
import { PageHeader, Tag, Statistic, Row, Space } from "antd";
import { api } from "../api/api";
import DataTable from "./components/DataTable";
import DateSetter from "./components/DateSetter";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        console.log("Retrieving all questions");
        getAllQuestions();
      }
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, []);
  const getAllQuestions = async () => {
    try {
      const response = await api.get("/queries");
      const { queries } = response.data;
      console.log("Questions: ", queries);
      setQuestions(queries);
    } catch (e) {
      console.log(e);
    }
  };

  const getQuestionsByDate = async (year, month, day) => {
    try {
      console.log(year, month, day);
      const response = await api.get(`/queries/date?year=${year}&month=${month}&day=${day}`);
      const { queries } = response.data;
      console.log("Questions by date: ", queries);
      setQuestions(queries);
    } catch (e) {
      console.log(e);
    }
  };

  const getQuestionsByDateRange = async (startYear, startMonth, startDay, endYear, endMonth, endDay) => {
    try {
      console.log(startYear, startMonth, startDay, endYear, endMonth, endDay);
      const response = await api.get(
        `/queries/daterange?startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`
      );
      const { queries } = response.data;
      console.log("Questions by date range: ", queries);
      setQuestions(queries);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <PageHeader
        title="Questions"
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="Student questions and their corresponding chatbot response"
        extra={[
          <DateSetter
            key={1}
            getByDate={getQuestionsByDate}
            getByDateRange={getQuestionsByDateRange}
            getAll={getAllQuestions}
          />,
        ]}
      >
        <Row>
          <Space size={30}>
            <Statistic title="# Questions" value={questions.length} />
            <Statistic title="# Inaccurate Responses" value={questions.filter((c) => !c.resolved).length} />
          </Space>
        </Row>
      </PageHeader>

      <DataTable data={questions} type="questions" />
    </>
  );
};

export default QuestionList;
