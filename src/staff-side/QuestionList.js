import React, { useState, useEffect } from "react";
import { PageHeader, Statistic, Row, Space, message } from "antd";
import { api } from "../api/api";
import DataTable from "./components/DataTable";
import DateSetter from "./components/DateSetter";
import { useNavigate } from "react-router-dom";

const QuestionList = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        const currentDate = new Date();
        let fromDate = getStartOfWeek(currentDate);
        let year = fromDate.getFullYear();
        let month = fromDate.getMonth() + 1;
        let day = fromDate.getDate();
        getQuestionsByDate(year, month, day);
      }
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, []);

  const getStartOfWeek = (d) => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };

  const getAllQuestions = async () => {
    try {
      const response = await api.get("/queries");
      const { queries } = response.data;
      setQuestions(queries);
    } catch (e) {
      message.error(e.response.data.error);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const getQuestionsByDate = async (year, month, day) => {
    try {
      const response = await api.get(`/queries/date?year=${year}&month=${month}&day=${day}`);
      const { queries } = response.data;
      setQuestions(queries);
    } catch (e) {
      message.error(e.response.data.error);
    }
  };

  const getQuestionsByDateRange = async (startYear, startMonth, startDay, endYear, endMonth, endDay) => {
    try {
      const response = await api.get(
        `/queries/daterange?startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`
      );
      const { queries } = response.data;
      setQuestions(queries);
    } catch (e) {
      message.error(e.response.data.error);
    }
  };

  return (
    <>
      <PageHeader
        title="Questions"
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
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
