/*jshint esversion: 8 */
import React, { Component } from "react";
import "./css/Reports.css";
import { Link } from "react-router-dom";
import {
  Container,
  Table,
  Col,
  Row,
  Modal,
  Form,
  ProgressBar
} from 'react-bootstrap';
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group';
import LoaderButton from "../components/LoaderButton";

export default class InProgress extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      progress: [],
      progress_state: "Loading progress",
      reports: [],
      group_uuid: null,
      report_state: "Loading reports",
      data: [],
      available_reports: [],
      is_loading: {
        'refresh': false,
        'generate': false,
        'hot': false,
        'nearly': false,
        'not': false
      },
      progressInt: 0,
      categories: []
    };
  }

  async componentDidMount() {
    try {
      await this.progress();

      var int_id = setInterval(async () => {
        await this.progress();
      }, 20000);
      this.getReports();
      this.setState({ isLoading: false, progressInt: int_id });
    }
    catch (e) {
      alert(e);
    }
  }

  getReports() {
    return fetch('http://127.0.0.1:8000/reports/available', {
      method: 'GET'
    }).then(response => response.text())
      .then((body) => {
        var json_data = JSON.parse(body);
        var decoded = json_data.message;
        var reports = decoded.map((value) => {
          var array_report = [value.id, value.title];
          return array_report;
        });
        if ("success" === json_data.status) {
          this.setState({ available_reports: reports });
          return true;
        }
        return false;
      }
      ).catch(err => console.log(err));
  }

  componentWillUnmount() {
    clearInterval(this.state.progressInt);
  }

  progress() {
    var form_data = new FormData();
    form_data.append("uuid", this.state.uuid);
    console.log("AAAAAAAAAA",form_data);
    return fetch('http://127.0.0.1:8000/reports/progress', {
      method: 'POST',
      body: form_data
    }).then(response => response.text())
      .then((body) => {
        var json_data = JSON.parse(body);
        var decoded = JSON.parse(json_data.message);
        if ("success" === json_data.status) {
          if (0 === decoded.data.reports.total) {
            this.setState({ report_state: "" });
          }
          if (0 === decoded.data.progress.total) {
            this.setState({ progress_state: "No active requests" });
          }
          this.setState({ progress: decoded.data.progress, reports: decoded.data.reports });
        }
        return true;
      }).catch((e) => {
        console.log(e);
        return false;
      });
  }

  async getProgress() {
    return setTimeout(async () => {
      return await this.progress();
    }, 300);
  }

  renderProgressList(reports) {
    let report_types = {
      "PH": "Phrase",
      "BC": "Bar Code",
      "MN": "Model Name",
      "SK": "SKU"
    };
    return [{}].concat(reports.data).map(
      (report, i) =>
        i !== 0 ?
          <CSSTransition
            key={i + '_100'}
            timeout={700}
            classNames="fade"
          >
            <tr onClick={() => { this.setState({ show_in_progress: true, group_uuid: report.group_uuid, download: false }); }}
              style={{ cursor: "pointer" }}>
              <td><div>{report._title}</div></td>
              <td><div>{report_types[report.submission_type]}</div></td>
              <td><div>{report._group}</div></td>
              <td><div>{parseInt(report.total_products)}</div></td>
              <td><div>{parseInt(parseInt(report.requests_active) + parseInt(report.not_found))}</div></td>
              <td><div>{parseInt(parseInt(report.requests_active) - parseInt(report.requests_completed))}</div></td>
              <td><div>{report.not_found}</div></td>
              <td><div>{report.requests_completed}</div></td>
              <td><div>{new Date(report.createdAt.date).toLocaleString("en-GB")}</div></td>
              <td><div className="progress-label">
                {parseInt((100 / (parseInt(report.requests_active) + parseInt(report.not_found))) * parseInt(parseInt(report.not_found) + parseInt(report.requests_completed === undefined ? 0 : report.requests_completed)))}%
              <ProgressBar variant={report._stage ? "success" : "info"} now={parseInt((100 / (parseInt(report.requests_active) + parseInt(report.not_found))) * parseInt(parseInt(report.not_found) + parseInt(report.requests_completed === undefined ? 0 : report.requests_completed)))}>
                </ProgressBar></div></td>
            </tr>
          </CSSTransition>
          : null
    );
  }

  renderAvailableReports() {
    return this.state.available_reports.concat().map((report, index) => {
      return (
        <option key={report[0]} value={report[0]}>{report[1]}</option>
      )
    });
  }

  handleModalClose() {
    this.setState({ show: false })
  }

  generateReport(group_uuid) {
    var form_data = new FormData();
    form_data.append("uuid", group_uuid);
    form_data.append("report_id", parseInt(this.state.generate_report));
    return fetch('http://127.0.0.1:8000/reports/generate', {
      method: 'POST',
      body: form_data
    }).then(response => response.text())
      .then((body) => {
        var json_data = JSON.parse(body);
        var decoded = JSON.parse(json_data.message);
        if ("success" === json_data.status) {
          var is_loading = this.state.is_loading;
          is_loading['generate'] = false;
          this.setState({ is_loading, download: true, download_url: decoded.url, download_size: decoded.size });
        }
        return true;
      }).catch((e) => {
        console.log(e);
        return false;
      });
  }

  renderModal() {

    if (this.state.reports !== undefined && this.state.selected !== null) {
      if (this.state.reports.data !== undefined) {
        var report_data = this.state.reports.data[this.state.selected];
      }
    }

    if (undefined === report_data) {
      return;
    }

    var created_date = report_data.createdAt;
    var created_date_string = "";

    if (undefined !== report_data.createdAt) {
      created_date_string = created_date.date;
    }

    return (
      <Modal show={this.state.show} onHide={() => { this.setState({ show: false }) }} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span style={{ fontSize: "20pt" }} className="glyphicon glyphicon-information-sign" /> Completed Reports
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="show-grid">
              <Col style={{ marginBottom: "5px", textAlign: "center", fontSize: "12.5pt", fontWeight: "bold" }}>
                {true === report_data._cache ?
                  <span className="glyphicon glyphicon-time"
                    style={{ fontSize: "12pt", float: "right" }}></span>
                  : null}
                {report_data._title}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={8} md={6}>
                Group
              </Col>
              <Col xs={10} md={6}>{report_data.group_uuid}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={8} md={6}>
                Group
              </Col>
              <Col xs={10} md={6}>{report_data._group}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col xs={8} md={6}>
                Found
              </Col>
              <Col xs={10} md={6}>
                {report_data._found}
              </Col>
            </Row>
            {0 < report_data._not_found ?
              <Row className="show-grid">
                <Col xs={8} md={6}>
                  Not Found
                </Col>
                <Col xs={10} md={6}>
                  {report_data._not_found}
                </Col>
              </Row>
              :
              null}
            <Row className="show-grid">
              <Col xs={8} md={6}>
                Created @
              </Col>
              <Col xs={10} md={6}>
                {new Date(created_date_string).toLocaleString("en-GB")}
              </Col>
            </Row>
            <Row>
              <Col xs={10} md={8}>
                <Form.Control style={{ marginTop: "5px" }} className="form-input select" as="select" onChange={(event) => { this.setState({ generate_report: event.target.value, download: false }); }}>
                  <option value={-1}>Choose...</option>
                  {this.renderAvailableReports()}
                </Form.Control>
                {this.state.generate_error ?
                  <span style={{ fontSize: "9pt", color: "#f00" }}>Please select a report</span>
                  : null}
              </Col>
              <Col xs={8} md={4}>
                <LoaderButton
                  className="refresh-button"
                  isLoading={this.state.is_loading.generate}
                  text="Generate"
                  loadingText="Please wait"
                  onClick={() => {
                    var is_loading = this.state.is_loading;

                    if (-1 === parseInt(this.state.generate_report)) {
                      is_loading.generate = false;
                      this.setState({ is_loading, generate_error: true });
                    } else {
                      is_loading.generate = true;
                      this.setState({ is_loading, generate_error: false }); this.generateReport(report_data.group_uuid);
                    }
                  }}
                />

              </Col>
            </Row>
            {this.state.download ?
              <Row style={{ marginTop: "10px" }}>
                <Col xs={8} md={3}>Download link</Col>
                <Col xs={10} md={9}><a href={this.state.download_url} download>Click here to download</a></Col>
              </Row>
              :
              null
            }
            {this.state.download ?
              <Row>
                <Col xs={8} md={3}>Size</Col>
                <Col xs={10} md={9}>{this.state.download_size}</Col>
              </Row>
              :
              null
            }
          </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    )
  }

  renderProgressModal() {

    return (
      <Modal show={this.state.show_in_progress} onHide={() => { this.setState({ show_in_progress: false }) }} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span style={{ fontSize: "20pt" }} class="glyphicon glyphicon-information-sign" /> In Progress Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="show-grid">
              <Col style={{ marginBottom: "5px", textAlign: "center", fontSize: "12.5pt", fontWeight: "bold" }}>

              </Col>
            </Row>
            <Row>
              <Col xs={10} md={8}>
                <Form.Control style={{ marginTop: "5px" }} className="form-input select" as="select" onChange={(event) => { this.setState({ generate_report: event.target.value, download: false }); }}>
                  <option value={-1}>Choose...</option>
                  {this.renderAvailableReports()}
                </Form.Control>
                {this.state.generate_error ?
                  <span style={{ fontSize: "9pt", color: "#f00" }}>Please select a report</span>
                  : null}
              </Col>
              <Col xs={8} md={4}>
                <LoaderButton
                  className="refresh-button"
                  isLoading={this.state.is_loading.generate}
                  text="Generate"
                  loadingText="Please wait"
                  onClick={() => {
                    var is_loading = this.state.is_loading;
                    if (-1 === parseInt(this.state.generate_report)) {
                      is_loading.generate = false;
                      this.setState({ is_loading, generate_error: true });
                    } else {
                      is_loading.generate = true;
                      this.setState({ is_loading, generate_error: false }); this.generateReport(this.state.group_uuid);
                    }
                  }}
                />
              </Col>
            </Row>
            {this.state.download ?
              <Row style={{ marginTop: "10px" }}>
                <Col xs={8} md={3}>Download link</Col>
                <Col xs={10} md={9}><a href={this.state.download_url} download>Click here to download</a></Col>
              </Row>
              :
              null
            }
            {this.state.download ?
              <Row>
                <Col xs={8} md={3}>Size</Col>
                <Col xs={10} md={9}>{this.state.download_size}</Col>
              </Row>
              :
              null
            }
          </Container>
        </Modal.Body>
        <Modal.Footer>
        </Modal.Footer>
      </Modal>
    )
  }

  renderProgress() {
    if (this.state.progress.total !== 0 && this.state.progress.total !== undefined) {
      return (
        <Container style={{ margin: "0px", padding: "0px" }}>
          <h2>In Progress</h2>
          <p style={{ textAlign: "left" }}>If a requests contains new products the progress bar appears green and will complete twice. During the first sweep existing product price details are also collected, resulting in a faster second sweep. The first time is to look for the new product and the second to retrieve the latest information.</p>
          <p style={{ fontWeight: "bold" }}>These results are updated every 20 seconds.</p>
          <Container className="pb-2 mt-4 mb-2 border-bottom">
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="fifteen-perc">Type</th>
                  <th className="fifteen-perc">Group</th>
                  <th className="ten-perc">Products</th>
                  <th className="ten-perc">Variations</th>
                  <th className="ten-perc">Active</th>
                  <th className="ten-perc">Not Found</th>
                  <th className="ten-perc">Completed</th>
                  <th>Posted @</th>
                  <th>Progress</th>
                </tr>
              </thead>
              <TransitionGroup
                transitionname="fade"
                transitionentertimeout={800}
                transitionleavetimeout={1500}
                transitionappeartimeout={1500}
                transitionappear="true"
                component="tbody"
              >
                {!this.state.isLoading && this.renderProgressList(this.state.progress)}
              </TransitionGroup>
            </Table>
          </Container>
        </Container>
      );
    } else {
      return (
        <Container style={{ fontWeight: "bold" , minHeight:"200px", paddingTop:"40px"}}>
          <h2 className="guide_h2">No requests in process</h2>
        </Container>
      )
    }
  }

  renderReportsList(reports) {
    let report_types = {
      "PH": "Phrase",
      "BC": "Identifier",
      "MN": "Model Name",
      "SK": "SKU"
    }
    return [{}].concat(reports.data).map(
      (report, i) =>
        i !== 0
          ?
          <CSSTransition
            key={i}
            timeout={700}
            classNames="fade"
          >
            <tr
              key={i + "r"} header={reports.dvc + " :  " + reports.hid}
              to={"#"}
              onClick={() => { this.setState({ selected: i - 1 }); this.setState({ show: true, download: false }); }}
              style={{ cursor: "pointer" }}>
              <td><div>{true === report._cache ? <span class="glyphicon glyphicon-time" style={{ fontSize: "12pt", float: "left", width: "20px", marginRight: "-20px" }}></span> : null}{report._title}</div></td>
              <td><div>{report_types[report.submission_type]}</div></td>
              <td><div>{report._group}</div></td>
              <td><div>{report._requested}</div></td>
              <td><div>{report._found}</div></td>
              <td><div>{report._price_points}</div></td>
              <td><div>{new Date(report.createdAt.date).toLocaleString("en-UK")}</div></td>
              <td><div>{report.duration}</div></td>
              <td><div>{new Date(report.updatedAt.date).toLocaleString("en-UK")}</div></td>
            </tr>
          </CSSTransition>
          : null
    );
  }

  renderReports() {
    if (this.state.reports.total !== 0 && this.state.reports.total !== undefined) {
      return (
        <Container style={{ margin: "0px", padding: "0px" }}>
          <Container className="pb-2 mt-4 mb-2 border-bottom">
            <Container className="pb-2 mt-4 mb-2 border-bottom">
              <p><span style={{ fontStyle: "italic", fontWeight: "bold" }}>Requests Completed Within the last 60 minutes</span>
              <Link className=".App-link" to="/guide/home/products">
                    <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-info-sign" />
                  </Link>
                  <br />Click on a row to view download options.</p>
            </Container>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>Title</th>
                  <th className="fifteen-perc">Type</th>
                  <th className="fifteen-per">Group</th>
                  <th className="six-per">Requested</th>
                  <th className="six-per">Found</th>
                  <th className="eight-per">Price Points</th>
                  <th className="fifteen-per">Started @</th>
                  <th className="ten-per">Duration</th>
                  <th className="fifteen-per">Completed @</th>
                </tr>
              </thead>
              <TransitionGroup
                transitionname="fade"
                transitionentertimeout={1500}
                transitionleavetimeout={1500}
                transitionappeartimeout={1500}
                transitionappear="true"
                component="tbody"
              >
                {!this.state.isLoading && this.renderReportsList(this.state.reports)}
              </TransitionGroup>
            </Table>
          </Container>
        </Container>
      );
    } else {
      return (
        <Container>
          <Container style={{ fontWeight: "bold", marginTop: "10px" }}>
            {this.state.report_state}
          </Container>
          <p style={{fontSize:"14px",padding:"10px 0"}}>Recently generated reports will appear here.  These include scheduled and email requests.</p>
        </Container>
      )
    }
  }

  render() {
    return (
      <div className="InProgress">
        {this.renderModal()}
        {this.renderProgressModal()}
        {this.renderProgress()}
        {this.renderReports()}
      </div>
    );
  }
}