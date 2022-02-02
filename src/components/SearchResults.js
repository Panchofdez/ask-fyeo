import React from "react";
import { Card, Row, Col } from "antd";

const SearchResults = ({ results }) => {
  if (results.length === 0) {
    return (
      <Card className="elevated" title="Search Tips" style={{ marginTop: 20 }}>
        <ul>
          <li>
            Enter a keyword/phrase related to your question like for example "probation", "academic standing" etc.
          </li>
          <li>Ask simple and complete questions like for example "How do I swap courses?".</li>
          <li>Ask just one question at a time.</li>
        </ul>
      </Card>
    );
  }

  const resultCards = results.map((questionObj, idx) => (
    <Card className="elevated" key={idx} style={{ marginTop: 20 }}>
      <Card.Meta title={questionObj["Question"]} description={questionObj["Category"]} />
      {/* <p>
        <em>Category</em>: {questionObj["Category"]}
      </p> */}
      <hr className="divider" />
      <p>
        <em>Answer</em>: {questionObj["Answer"]["Resource"]}
      </p>
    </Card>
  ));

  console.log(resultCards);
  return (
    <Row>
      <Col span={24}>{resultCards}</Col>
    </Row>
  );
};

export default SearchResults;
