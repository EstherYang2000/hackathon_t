import { Card, Row, Col } from "antd";
import { Link } from "react-router-dom";
function NoMatchPage() {
  return (
    <Row style={{ marginTop: "20%" }}>
      <Col xs={{ span: 12, offset: 6 }}>
        <Card>
          <div className="card-body">
            <div className="d-flex flex-column align-items-center justify-content-center">
              <h2>Page not found</h2>
              <Link to="/upload">back to APP</Link>
            </div>
          </div>
        </Card>
      </Col>
    </Row>
  );
}
export default NoMatchPage;
