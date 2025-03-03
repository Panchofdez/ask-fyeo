import React, { useState, useEffect } from "react";
import { PageHeader, Statistic, Row, Space, message } from "antd";
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
      const response = await api.get(`/faq/${faq.tag.toLowerCase() === "other" ? -1 : faq.id}/queries`);
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
      const response = await api.get(
        `/faq/${faq.tag.toLowerCase() === "other" ? -1 : faq.id}/queries/date?year=${year}&month=${month}&day=${day}`
      );
      const { queries } = response.data;
      setQuestions(queries);
    } catch (e) {
      message.error(e.response.data.error);
    }
  };

  const getQuestionsByDateRange = async (startYear, startMonth, startDay, endYear, endMonth, endDay) => {
    try {
      const response = await api.get(
        `/faq/${
          faq.tag.toLowerCase() === "other" ? -1 : faq.id
        }/queries/daterange?startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`
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
        title={faq.tag}
        style={{ backgroundColor: "#e6f7ff", minHeight: "150px" }}
        subTitle="Questions that were allocated by the chatbot for this FAQ"
        onBack={() => navigate(-1)}
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
