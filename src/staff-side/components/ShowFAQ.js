import React, { useState, useEffect } from "react";
import { PageHeader, Tag, Statistic, Row, Space } from "antd";
import { api } from "../../api/api";
import DataTable from "./DataTable";
import DateSetter from "./DateSetter";
import { useNavigate, useLocation } from "react-router-dom";

const ShowFAQ = () => {
  const [questions, setQuestions] = useState([]);
  const navigate = useNavigate();
  const { state } = useLocation();
  const { faq } = state;
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
      const response = await api.get(`/faq/${faq.tag.toLowerCase() == "other" ? -1 : faq.id}/queries`);
      const { queries } = response.data;
      console.log("Questions: ", queries);
      setQuestions(queries);
    } catch (e) {
      console.log(e);
      if (e.response.status === 403 || e.response.status === 401) {
        navigate("/");
      }
    }
  };

  const getQuestionsByDate = async (year, month, day) => {
    try {
      console.log(year, month, day);

      const response = await api.get(
        `/faq/${faq.tag.toLowerCase() == "other" ? -1 : faq.id}/queries/date?year=${year}&month=${month}&day=${day}`
      );
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
        `/faq/${
          faq.tag.toLowerCase() == "other" ? -1 : faq.id
        }/queries/daterange?startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`
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
        title={faq.tag}
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="Student questions that were allocated by the chatbot for this FAQ"
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
            <Statistic title="Hit Rate" value={faq.hit_rate} precision={2} suffix="%" />
            <Statistic title="Success Rate" value={faq.success_rate} precision={2} suffix="%" />

            <Statistic title="# Questions" value={questions.length} />
            <Statistic title="# Inaccurate Responses" value={questions.filter((c) => !c.resolved).length} />
          </Space>
        </Row>
      </PageHeader>

      <DataTable data={questions} type="questions" />
    </>
  );
};

export default ShowFAQ;
