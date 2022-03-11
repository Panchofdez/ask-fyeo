import React, { useState } from "react";
import { Select, DatePicker } from "antd";
const { Option } = Select;
const { RangePicker } = DatePicker;

const DateSetter = ({ getByDate, getByDateRange, getAll }) => {
  const [custom, setCustom] = useState(false);
  const [dateRange, setDateRange] = useState([]);
  const getStartOfWeek = (d) => {
    d = new Date(d);
    var day = d.getDay(),
      diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
  };
  const getStartOfMonth = (d) => {
    d = new Date(d.getFullYear(), d.getMonth(), 1);
    console.log("D: ", d);
    return d;
  };

  const getStartOfYear = (d) => {
    return new Date(d.getFullYear(), 0, 1);
  };

  const handleChange = (value) => {
    console.log(`selected ${value}`);
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
      console.log("FROM DATE", fromDate);
      let year = fromDate.getFullYear();
      let month = fromDate.getMonth() + 1;
      let day = fromDate.getDate();
      console.log(year, month, day);
      getByDate(year, month, day);
    }
  };

  const handleDateChange = (dates, dateStrings) => {
    console.log(dateStrings[0], dateStrings[1]);
    const startDate = new Date(dateStrings[0]);
    const startYear = startDate.getFullYear();
    const startMonth = startDate.getMonth();
    const startDay = startDate.getDate();

    const endDate = new Date(dateStrings[1]);
    const endYear = endDate.getFullYear();
    const endMonth = endDate.getMonth() + 1;
    const endDay = endDate.getDate() + 1;
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
