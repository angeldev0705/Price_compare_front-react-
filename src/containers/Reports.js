/*jshint esversion: 8 */
import React, { Component } from "react";
import "./css/Reports.css";
import {
  Container,
  Table,
  Col,
  Row,
  Pagination,
  ButtonToolbar,
  Dropdown,
  DropdownButton,
  Button,
  Modal,
  Form,
  Spinner,
  Collapse
} from 'react-bootstrap';
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group';
import DatePicker from "react-datepicker";
import LoaderButton from "../components/LoaderButton";

export default class Reports extends Component {

  constructor(props) {
    super(props);

    this.state = {
      props: props,
      download: false,
      download_url: "",
      download_size: "",
      generating: false,
      generate_report: -1,
      report_link: "",
      page_size: 20,
      page: 1,
      available_reports: [],
      total_products: -1,
      total_price_points: -1,
      reports: [],
      report_total: -1,
      order: undefined,
      orderby: undefined,
      start_date: '',
      end_date: '',
      group: "All",
      subtype: "All",
      datepicker_visible: false,
      data: [],
      start_dates: [],
      end_dates: [],
      groups: [],
      is_loading: {
        'refresh': false,
        'generate': false,
        'hot': false,
        'nearly': false,
        'not': false
      },
      progressInt: 0,
      categories: [],
      subtypes: {'All':"All",'BC':"Identifier",'PH': "Phrase"}
    };
  }

  componentDidMount() {
    this.getAvailableReports();
    this.getReportStats();
    try {
      this.reports(this.state.page, this.state.page_size);
    }
    catch (e) {
      alert(e);
    }
    var is_loading = this.state.is_loading;
    is_loading.refresh = false;
    this.setState({ is_loading });
  }

  getReportStats() {
    var form_data = new FormData();
    console.log(this.state.subtype);
    form_data.append("start_date", this.state.start_date);
    form_data.append("end_date", this.state.end_date);
    form_data.append("group", this.state.group);
    form_data.append("type", this.state.subtype);
    return fetch('http://127.0.0.1:8000/reports/stats', {
      method: 'POST',
      body: form_data
    }).then(response => response.text())
      .then((body) => {
        var json_data = JSON.parse(body);
        if ("success" === json_data.status) {
          const json_reply = JSON.parse(json_data.message);
          this.setState({
            groups: JSON.parse(json_reply.available_groups),
            dates: JSON.parse(json_reply.available_dates),
            total_products: json_reply.total_products,
            total_price_points: json_reply.total_price_points,
            requesting: false
          });
          return true;
        }
        return false;
      }
      ).catch(err => console.log(err));
  }

  getAvailableReports() {
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

  renderAvailableReports() {
    return this.state.available_reports.concat().map((report, index) => {
      return (
        <option key={report[0]} value={report[0]} id={index}>{report[1]}</option>
      )
    });
  }

  reports(page, page_size) {
    var form_data = new FormData();
    form_data.append("uuid", this.state.uuid);
    form_data.append("page", page);
    form_data.append("group", this.state.group);
    form_data.append("type", this.state.subtype);
    form_data.append("page_size", page_size);
    form_data.append("start_date", this.state.start_date);
    form_data.append("end_date", this.state.end_date);

    if (undefined !== this.state.orderby) {
      form_data.append("orderby", this.state.orderby);
    }

    if (undefined !== this.state.order) {
      form_data.append("order", this.state.order);
    }

    return fetch('http://127.0.0.1:8000/reports', {
      method: 'POST',
      body: form_data
    }).then(response => response.text())
      .then((body) => {
        var json_data = JSON.parse(body);
        if ("success" === json_data.status) {
          var json_message = JSON.parse(json_data.message);
          var total_r = json_message.total;
          this.setState({ report_total: total_r, reports: json_message, requesting: false });
        }
        return true;
      }).catch((e) => {
        console.log(e);
        return false;
      });
  }

  async getReports(page) {
    return setTimeout(async () => {
      this.setState({ page })
      return await this.reports(page, this.state.page_size);
    }, 300);
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
              key={i} header={reports.dvc + " :  " + reports.hid}
              to={"#"}
              onClick={() => { this.setState({ selected: i - 1, show: true, generate_error: false, download: false, download_url: "", download_size: "" }); }}
              style={{ cursor: "pointer" }}>
              <td><div>{true === report._cache ? <span class="glyphicon glyphicon-time" style={{ fontSize: "12pt", float: "left", width: "20px", marginRight: "-20px" }}></span> : null}{report._title}</div></td>
              <td><div>{report_types[report.submission_type]}</div></td>
              <td><div>{report._group}</div></td>
              <td><div>{report._requested}</div></td>
              <td><div>{report._found}</div></td>
              <td><div>{report._not_found}</div></td>
              <td><div>{report._price_points}</div></td>
              <td><div>{new Date(report.updatedAt.date).toLocaleString("en-UK")}</div></td>
            </tr>
          </CSSTransition>
          : null
    );
  }

  renderPages() {
    const total_pages = ((this.state.report_total - this.state.report_total % this.state.page_size) / this.state.page_size) + 1
    const active = this.state.page;
    var spread = 5, lw_page_shift = 0, up_page_shift = 0;

    if (total_pages >= 10 && active <= 5) {
      lw_page_shift = 5 - active;
    } else if (total_pages >= 10 && active >= total_pages - 5) {
      up_page_shift = 5 - (total_pages - active);
    }
    const pagination_pages = [...Array(total_pages)].map(
      (number, i) =>
        active - spread - up_page_shift <= i + 1 && active + spread + lw_page_shift >= i + 1 ?
          <Pagination.Item key={i + 1} active={i + 1 === active} onClick={() => { this.getReports(i + 1) }}>
            {i + 1}
          </Pagination.Item>
          : ""
    )
    const pagination = []
    pagination[0] = [];
    pagination[1] = [5, 10, 20, 50, 100].filter((element) => {
      if (element < this.state.report_total) {
        return element;
      }
      return null;
    })

    if (total_pages === 1) return pagination;

    if (active > 1) {
      pagination[0].push(<Pagination.Item key={100} onClick={() => { this.getReports(1) }}>
        ...
          </Pagination.Item>)
      pagination[0].push(<Pagination.Item key={101} onClick={() => { this.getReports(active - 1) }}>
        ..
          </Pagination.Item>)
    }
    pagination[0] = pagination[0].concat(pagination_pages);
    if (active + 1 <= total_pages) {
      pagination[0].push(<Pagination.Item key={total_pages + 1} onClick={() => { this.getReports(active + 1) }}>
        ..
          </Pagination.Item>)
      pagination[0].push(<Pagination.Item key={total_pages + 2} onClick={() => { this.getReports(total_pages) }}>
        ...
          </Pagination.Item>)
    }

    return pagination;
  }

  renderGroups() {
    if (this.state.groups !== undefined) {
      const groups = [].concat(this.state.groups).map((element) => {
        return element
      })
      return [...new Set(groups)].map(
        (group, i) =>
          <Dropdown.Item key={"hub_dd_" + i} eventKey={group}
            active={String(this.state.group) === String(group) ? true : false}
          >
            {group}
          </Dropdown.Item>
      );
    }
  }

  renderPageSize(page_sizes) {
    return page_sizes.map(
      (page_size, i) =>
        <Dropdown.Item key={"page_dd_" + i} eventKey={page_size}
          active={parseInt(this.state.page_size) === parseInt(page_size) ? true : false}
        >
          {page_size}
        </Dropdown.Item>
    )
  }

  handleModalClose() {
    this.setState({ show: false })
  }

  renderModal() {
    if (this.state.reports.data !== undefined && this.state.selected !== null) {
      if (this.state.reports.data.length > 0) {
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
      <Modal show={this.state.show} onHide={() => { this.setState({ show: false, download: false }) }} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span style={{ fontSize: "20pt" }} className="glyphicon glyphicon-information-sign" /> Report
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="show-grid">
              <Col style={{ marginBottom: "5px", textAlign: "center", fontSize: "12.5pt", fontWeight: "bold" }}>
                {true === report_data._cache ?
                  <span class="glyphicon glyphicon-time"
                    style={{ fontSize: "12pt", float: "right" }}></span>
                  : null}
                {report_data._title}
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
              <Col xs={9} md={8}>
                <Form.Control style={{ marginTop: "5px" }} className="form-input select" as="select" onChange={(event) => { this.setState({ generate_report: event.target.value }); }}>
                  <option value={-1}>Choose...</option>
                  {this.renderAvailableReports()}
                </Form.Control>
                {this.state.generate_error ?
                  <span style={{ fontSize: "9pt", color: "#f00" }}>*Please select a report</span>
                  : null}
              </Col>
              <Col xs={8} md={4} style={{textAlign:'left'}}>
                <LoaderButton
                  className="refresh-button"
                  style={{display:'inline-block'}} 
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
                <Button style={{margin:"5px 0 0 5px"}}  onClick ={()=>{
                  var repeat_group = report_data.group_uuid;
                  this.props.history.push({pathname: '/schedule', state: { repeat_group }});
                }}>Set Schedule</Button>
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
      </Modal>
    )
  }

  handleGroupSelect = (group) => {
    this.setState({ report_total: -1, total_products: -1, total_price_points: -1 });
    return setTimeout(Promise.all([this.setState({ page: 1, group })]).then(() => {
      this.getReportStats();
      return this.getReports(1);
    }).catch((err) => console.log(err)), 300);
  }

  handleTypeSelect = (subtype) => {
    console.dir(subtype);
    this.setState({ report_total: -1, total_products: -1, total_price_points: -1 });
    return setTimeout(Promise.all([this.setState({ page: 1, subtype })]).then(() => {
      this.getReportStats();
      return this.getReports(1);
    }).catch((err) => console.log(err)), 300);
  }

  handlePageSize = (page_size) => {
    return setTimeout(Promise.all([this.setState({ page: 1, page_size })]).then(() => {
      return this.getReports(1);
    }).catch((err) => console.log(err)), 300);
  }

  handleOrderClick = (orderby) => {
    if (orderby !== this.state.orderby) {
      this.setState({ orderby, order: "DESC" });
    } else {
      if (this.state.order === "DESC") {
        this.setState({ order: "ASC" })
      } else {
        this.setState({ order: "DESC" })
      }
    }
    return this.getReports(1);
  }

  async handleDateSelect(element, start) {
    var date_element;
    if ('' === element) {
      date_element = '';
    } else {
      date_element = Date.parse(element)
    }
    if (start) {
      await this.setState({
        start_date: date_element
      });
    } else {
      await this.setState({
        end_date: date_element
      });
    }

    await this.setState({
      total_products: -1,
      total_price_points: -1,
      report_total: -1
    });
    this.getReportStats();
    this.getReports(1);

  }

  renderOrderHeader = (header) => {
    var css_string = "";
    if (header === this.state.orderby) {
      css_string = "order-header-selected "
      if (this.state.order === "DESC") {
        css_string = css_string + " order-desc";
      } else {
        css_string = css_string + " order-asc";
      }
      return css_string;
    }
    return "order-header";
  }

  setSchedule(){

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

  renderReports() {
    if (this.state.reports.total !== undefined) {
      var pages = this.renderPages();
      var pagination = pages[0];
      var report_start_dates = [];
      var report_end_dates = [];
      if (this.state.dates !== undefined) {
        report_start_dates = [].concat(this.state.dates).map((element) => {
          return new Date(element);
        }).filter((element) => {
          if ('' !== this.state.end_date) {
            if (Date.parse(element) <= this.state.end_date) {
              return element;
            }
          } else {
            return element;
          }
        });

      } else {
        report_start_dates = [];
      }

      if (this.state.dates !== undefined) {
        report_end_dates = [].concat(this.state.dates).map((element) => {
          return new Date(element);
        }).filter((element) => {
          if ('' !== this.state.start_date) {
            if (Date.parse(element) >= this.state.start_date) {
              return element;
            }
          } else {
            return element;
          }
        });

      } else {
        report_end_dates = [];
      }

      var options = {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "numeric"
      };
      var report_start_class = [{ "react-datepicker__day--highlighted-report": report_start_dates }];
      var report_end_class = [{ "react-datepicker__day--highlighted-report": report_end_dates }];
      var report_url = "http://3.8.200.218/";

      return (
        <Container style={{ margin: "0px", padding: "0px",  textAlign: "left" }}>
          <h2 className="guide_h2">Report History</h2>
          <h4 style={{ textAlign: "left" }}>General Reports</h4>
          <ButtonToolbar style={{ marginBottom: "5px" }}>
            <Button
              className="refresh-button"
              href={report_url + "download-hd"}
            >HotUKDeals Report</Button>
            <Button
              className="refresh-button"
              href={report_url + "download-nearly"}
            >Nearly</Button>
            <Button
              className="refresh-button"
              href={report_url + "download-np"}
            >No Presence</Button>
            <Button
              className="refresh-button"
              href={report_url + "download-np"}
            >Products</Button>
            <Button
              className="refresh-button"
              href={report_url + "download-np"}
            >Competitors</Button>
          </ButtonToolbar>
          <p style={{ textAlign: "left", fontStyle: "italic", marginTop: "10px" }}>
            The information below will automatically update when the filter options are changed.
              </p>
          <Table className={"overview"} bordered responsive>
            <thead>
              <tr className="ten-per">
                <th>Date</th>
                <th>Type</th>
                <th>Group</th>
                <th>Reports</th>
                <th>Unique Products</th>
                <th>Price Points</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{this.state.date === '' ? "All Available Dates" : new Date(this.state.date).toLocaleDateString("en", options)}</td>
                <td>{this.state.subtype === null ? "All" : this.state.subtypes[this.state.subtype]}</td>
                <td>{this.state.group === null ? "All" : this.state.group}</td>
                <td>{-1 === this.state.report_total ?
                  <Spinner size="sm" animation="border" className="loading" as="span"
                    role="status"
                    aria-hidden="true" />
                  :
                  this.state.report_total}</td>
                <td>{-1 === this.state.total_products ?
                  <Spinner size="sm" animation="border" className="loading" as="span"
                    role="status"
                    aria-hidden="true" />
                  :
                  this.state.total_products}</td>
                <td>{-1 === this.state.total_price_points ?
                  <Spinner size="sm" animation="border" className="loading" as="span"
                    role="status"
                    aria-hidden="true" />
                  :
                  this.state.total_price_points}</td>
              </tr>
            </tbody>
          </Table>

          <Container className="pb-2 mt-4 mb-2 border-bottom">
            <ButtonToolbar style={{ marginBottom: "5px" }}>
              {
                10 < this.state.reports.total ?
                  <DropdownButton
                    title={"Page Size"}
                    id={'dropdown-pagesize'}
                    key={'page_dd'}
                    onSelect={(event) => { this.handlePageSize(event) }}
                    style={{ margin: "5px" }}
                  >
                    {this.renderPageSize(pages[1])}
                  </DropdownButton>
                  :
                  null
              }

              <DropdownButton
                title={"Group"}
                id={'dropdown-group'}
                key={'group_dd'}
                onSelect={(event) => { this.handleGroupSelect(event) }}
                style={{ margin: "5px" }}
              >
                <Dropdown.Item key={"group_dd_all"}
                  active={this.state.group === "All" ? true : false}
                >
                  All Groups
        </Dropdown.Item>
                {this.renderGroups()}
              </DropdownButton>

              <Button key={"date_dd_show"}
                onClick={() => { this.setState({ datepicker_visible: !this.state.datepicker_visible }) }}
                style={{ marginLeft: "10px", marginTop: "5px", height: "33px" }}
              >
                Filter Dates
                  </Button>
              <DropdownButton
                title={"Types"}
                id={'dropdown-type'}
                key={'type_dd'}
                onSelect={(event) => { this.handleTypeSelect(event) }}
                style={{ margin: "5px" }}
              >
                <Dropdown.Item key={"type_dd_all"} eventKey={"All"}
                  active={this.state.subtype === "All" ? true : false}
                >
                  All Types
        </Dropdown.Item>
                <Dropdown.Item key={"type_dd_id"} eventKey={"BC"}
                  active={this.state.subtype === "BC" ? true : false}
                >
                  Identifier
        </Dropdown.Item>
                <Dropdown.Item key={"type_dd_ph"} eventKey={"PH"}
                  active={this.state.subtype === "PH" ? true : false}
                >
                  Phrase
        </Dropdown.Item>
              </DropdownButton>
              {this.state.order !== undefined ?
                <Button style={{ marginLeft: "5px", marginTop: "5px", height: "32.5px" }} onClick={() => { this.setState({ order: undefined, orderby: undefined }); this.getReports(1); }}>Clear Sort</Button>
                :
                null}
              <Collapse in={this.state.datepicker_visible}>
                <div style={{ clear: "both", width: "100%", float: "left", textAlign: "left", paddingTop: "10px", marginTop: "10px" }}>
                  <Button key={"date_dd_all"}
                    onClick={() => { this.handleDateSelect('', true); this.handleDateSelect('', false) }}
                    active={this.state.date === '' ? true : false}
                  >
                    Clear Filter
                  </Button>
                  <span style={{ marginLeft: "10px", marginRight: "10px" }}>From</span>
                  <DatePicker
                    onChange={(date) => { this.handleDateSelect(date, true) }}
                    style={{ display: "inline-flex" }}
                    selected={this.state.start_date !== null ? this.state.start_date : null}
                    highlightDates={report_start_class}
                    includeDates={report_start_dates}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Oldest Report" />
                  <span style={{ marginLeft: "10px", marginRight: "10px" }}>To</span>
                  <DatePicker
                    onChange={(date) => { this.handleDateSelect(date, false) }}
                    style={{ display: "inline-block" }}
                    selected={this.state.end_date !== null ? this.state.end_date : null}
                    highlightDates={report_end_class}
                    includeDates={report_end_dates}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Latest Report" />
                </div>
              </Collapse>
            </ButtonToolbar>
            <Pagination>{pagination}</Pagination>
            <Container className="pb-2 mt-4 mb-2 border-bottom">
              <span className={"alarm"}>Click on a row to view the available download options.</span>
            </Container>
            <Table className={"reports"} striped bordered hover responsive>
              <thead>
                <tr>
                  <th className={this.renderOrderHeader('sb._title')} onClick={() => { this.handleOrderClick('sb._title') }}>Title</th>
                  <th className={this.renderOrderHeader('sb.submission_type')} onClick={() => { this.handleOrderClick('sb.submission_type') }}>Type</th>
                  <th className={"fifteen-per " + this.renderOrderHeader('sb._group')} onClick={() => { this.handleOrderClick('sb._group') }}>Group</th>
                  <th className={"ten-per " + this.renderOrderHeader('sb._requested')} onClick={() => { this.handleOrderClick('sb._requested') }}>Requested</th>
                  <th className={"ten-per " + this.renderOrderHeader('sb._found')} onClick={() => { this.handleOrderClick('sb._found') }}>Found</th>
                  <th className={"ten-per " + this.renderOrderHeader('sb._not_found')} onClick={() => { this.handleOrderClick('sb._not_found') }}>Not Found</th>
                  <th className={this.renderOrderHeader('sb._price_points')} onClick={() => { this.handleOrderClick('sb._price_points') }}>New Price Points</th>
                  <th className={this.renderOrderHeader('sb.updatedAt')} onClick={() => { this.handleOrderClick('sb.updatedAt') }}>Completed @</th>
                </tr>
              </thead>
              <TransitionGroup
                transitionname="fade"
                transitionentertimeout={1000}
                transitionleavetimeout={1000}
                transitionappeartimeout={1000}
                transitionappear="true"
                component="tbody"
              >
                {!this.state.is_loading.refresh && this.renderReportsList(this.state.reports)}
              </TransitionGroup>
            </Table>
            <Pagination>{pagination}</Pagination>
          </Container>
        </Container>
      );
    } else {
      return (
        <Container>
          <div style={{ height: "120px", paddingTop: "30px", fontWeight: "bold" }}>
            <h4 style={{ marginBottom: "15px" }}>Loading, please wait.</h4>
            <Spinner
              animation="border"
              className="loading"
              as="span"
              role="status"
              aria-hidden="true" />
          </div>
        </Container>
      )
    }
  }

  render() {
    return (
      <div className="Reports">
        {this.renderReports()}
        {this.renderModal()}
      </div>
    );
  }
}