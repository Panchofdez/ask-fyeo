import React, { useState, useEffect } from "react";
import { Row, Col, Statistic, Card, PageHeader, Divider } from "antd";
import { api } from "../api/api";
import DateSetter from "./components/DateSetter";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Label } from "recharts";

const style = { background: "#0092ff", padding: "8px 0" };

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        console.log("Retrieving all stats");
        getAll();
        getChartData();
      }
    };
    setUp();
    return () => {
      isReady = false;
    };
  }, []);
  const getByDate = (year, month, day) => {
    getStatsByDate(year, month, day);
  };
  const getByDateRange = (startYear, startMonth, startDay, endYear, endMonth, endDay) => {
    getStatsByDateRange(startYear, startMonth, startDay, endYear, endMonth, endDay);
  };
  const getAll = () => {
    getStats();
  };

  const getChartData = async () => {
    try {
      const response = await api.get("/stats/chart");
      console.log(response.data);
      setChartData(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getStats = async () => {
    try {
      const response = await api.get("/stats");
      console.log(response.data);
      setStats(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getStatsByDate = async (year, month, day) => {
    try {
      const response = await api.get(`/stats/date?year=${year}&month=${month}&day=${day}`);
      console.log("BY DATE: ", response.data);
      setStats(response.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getStatsByDateRange = async (startYear, startMonth, startDay, endYear, endMonth, endDay) => {
    try {
      const response = await api.get(
        `/stats/daterange?startYear=${startYear}&startMonth=${startMonth}&startDay=${startDay}&endYear=${endYear}&endMonth=${endMonth}&endDay=${endDay}`
      );
      console.log("BY DATE RANGE: ", response.data);
      setStats(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  if (Object.keys(stats).length <= 0) {
    return null;
  }

  return (
    <>
      <PageHeader
        ghost={false}
        style={{ backgroundColor: "#e6f7ff", marginBottom: 10 }}
        title="Dashboard"
        extra={[<DateSetter key={1} getByDate={getByDate} getByDateRange={getByDateRange} getAll={getAll} />]}
      ></PageHeader>
      <div style={{ padding: 20, display: "flex", flexDirection: "column", justifyContent: "space-around", flex: 1 }}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginBottom: 20 }}>
          <Col className="gutter-row" span={6}>
            <Card className="elevated2">
              <Statistic title="Total # Convos" value={stats.conversations.total} />
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card className="elevated2">
              <Statistic title="Daily Average # Convos" value={stats.conversations.dailyAverage} />
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card className="elevated2">
              <Statistic title="Total # Questions Asked" value={stats.queries.total} />
            </Card>
          </Col>
          <Col className="gutter-row" span={6}>
            <Card className="elevated2">
              <Statistic title="Chatbot Accuracy" value={stats.queries.accuracy} suffix="%" />
            </Card>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Card className="elevated2">
              <Statistic title="# Pending Conversations" value={stats.conversations.pending} />
            </Card>
          </Col>
          <Col className="gutter-row" span={12}>
            <Card className="elevated2">
              <Statistic title="# Inaccurate Responses" value={stats.queries.unresolved} />
            </Card>
          </Col>
        </Row>
        <Divider />
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginBottom: 20 }}>
          <Col className="gutter-row" span={24}>
            <Card className="elevated2">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  width={730}
                  height={250}
                  data={chartData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day">
                    <Label value="Day of Month" offset={0} position="bottom" />
                  </XAxis>
                  <YAxis />
                  <Tooltip />
                  <Legend align="left" />
                  <Line type="monotone" dataKey="conversations" stroke="#8884d8" />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Dashboard;
