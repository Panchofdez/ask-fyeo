import React, { useState, useRef } from "react";
import { Table, Tag, Badge, Input, Button, Space } from "antd";
import { useNavigate } from "react-router-dom";
import Highlighter from "react-highlight-words";
import { SearchOutlined, CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const DataTable = ({ data, type }) => {
  let navigate = useNavigate();
  const formatData = (data) => {
    return data.map((o) => ({ ...o, key: o.id }));
  };
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleClear(clearFilters)} size="small" style={{ width: 90 }}>
            Clear
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => () => searchInput && searchInput.current && searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleClear = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const formatDate = (date) => {
    let newDate = date.split(" ");
    newDate[0] = newDate[0].slice(0, newDate[0].length - 1);
    newDate[1] = newDate[1][0] === "0" ? newDate[1].slice(1) : newDate[1];
    return newDate.slice(0, 4).join(" ");
  };

  const conversationsColumns = [
    {
      title: "First Name",
      dataIndex: "firstname",
      key: "firstname",
      ellipsis: true,
      filterSearch: (input, record) => record.value.indexOf(input) > -1,
      ...getColumnSearchProps("firstname"),
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      key: "lastname",
      ellipsis: true,
      filterSearch: (input, record) => record.value.indexOf(input) > -1,
      ...getColumnSearchProps("lastname"),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      filterSearch: true,
      ellipsis: true,
      ...getColumnSearchProps("email"),
    },
    {
      title: "Program",
      dataIndex: "program",
      key: "program",
      ellipsis: true,
      filterSearch: true,
      ...getColumnSearchProps("program"),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (text) => formatDate(text),
    },
    {
      title: "Contact",
      key: "contact",
      dataIndex: "contact",
      render: (contact) => <>{contact && <Tag color="success">Yes</Tag>}</>,
      filters: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      onFilter: (value, record) => record.contact === value,
    },
    {
      title: "Unresolved",
      key: "unresolved",
      dataIndex: "unresolved",
      render: (unresolved) => <Badge count={unresolved} />,
      filters: [
        {
          text: "greater than 0",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.unresolved > value,
    },
  ];

  const questionsColumns = [
    {
      title: "Question",
      dataIndex: "question",
      key: "question",
      filterSearch: (input, record) => record.value.indexOf(input) > -1,
      ...getColumnSearchProps("question"),
    },
    {
      title: "Response",
      dataIndex: "response",
      key: "response",
      ellipsis: true,
      filterSearch: (input, record) => record.value.indexOf(input) > -1,
      ...getColumnSearchProps("response"),
    },
    {
      title: "Resolved",
      key: "resolved",
      dataIndex: "resolved",
      render: (resolved) => (
        <>
          {resolved ? (
            <Tag icon={<CheckCircleOutlined />} color="success">
              success
            </Tag>
          ) : (
            <Tag icon={<CloseCircleOutlined />} color="error">
              error
            </Tag>
          )}
        </>
      ),
      filters: [
        {
          text: "Yes",
          value: true,
        },
        {
          text: "No",
          value: false,
        },
      ],
      onFilter: (value, record) => record.resolved === value,
    },
  ];
  return (
    <>
      <Table
        onRow={(record, rowIndex) => {
          return {
            onClick: (event) => {
              navigate(`/staff/conversations/${type === "conversations" ? record.id : record.conversation_id}`);
            }, // click row
          };
        }}
        columns={type === "conversations" ? conversationsColumns : questionsColumns}
        dataSource={formatData(data)}
        pagination={{ pageSize: 10, showSizeChanger: false }}
      />
    </>
  );
};

export default DataTable;
