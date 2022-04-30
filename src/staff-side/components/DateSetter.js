import React, { useState, useEffect } from "react";
import { Select, DatePicker } from "antd";
const { Option } = Select;
const { RangePicker } = DatePicker;

const DateSetter = ({ getByDate, getByDateRange, getAll }) => {
  const [custom, setCustom] = useState(false);
  const [dateRange, setDateRange] = useState([]);

  useEffect(() => {
    let isReady = true;
    const setUp = () => {
      if (isReady) {
        setDateRange([]);
        setCustom(false);
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
  const getStartOfMonth = (d) => {
    d = new Date(d.getFullYear(), d.getMonth(), 1);
    return d;
  };

  const getStartOfYear = (d) => {
    return new Date(d.getFullYear(), 0, 1);
  };

  const handleChange = (value) => {
    if (value === "custom") {
      setCustom(true);
    } else {
      handleDate(value);
      setCustom(false);
      setDateRange([]);
    }
  };

  const handleDate = (mode) => {
    const currentDate = new Date();
    let fromDate = null;
    if (mode === "alltime") {
      getAll();
    } else {
      if (mode === "week") {
        fromDate = getStartOfWeek(currentDate);
      } else if (mode === "month") {
        fromDate = getStartOfMonth(currentDate);
      } else if (mode === "year") {
        fromDate = getStartOfYear(currentDate);
      }
      let year = fromDate.getFullYear();
      let month = fromDate.getMonth() + 1;
      let day = fromDate.getDate();
      getByDate(year, month, day);
    }
  };

  const handleDateChange = (dates, dateStrings) => {
    let startDate = dateStrings[0].split("-");
    const startYear = parseInt(startDate[0]);
    const startMonth = parseInt(startDate[1]);
    const startDay = parseInt(startDate[2]);

    const endDate = dateStrings[1].split("-");
    const endYear = parseInt(endDate[0]);
    const endMonth = parseInt(endDate[1]);
    const endDay = parseInt(endDate[2]);
    setDateRange(dates);
    getByDateRange(startYear, startMonth, startDay, endYear, endMonth, endDay);
  };
  return (
    <>
      <Select defaultValue="alltime" style={{ width: 180 }} onChange={handleChange}>
        <Option value="week">This Week</Option>
        <Option value="month">This Month</Option>
        <Option value="year">This Year</Option>
        <Option value="alltime">All Time</Option>
        <Option value="custom">Custom Date Range</Option>
      </Select>
      {custom && <RangePicker value={dateRange} onChange={handleDateChange} />}
    </>
  );
};

export default DateSetter;
