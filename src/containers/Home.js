/*jshint esversion: 8 */
import React, { Component } from "react";
import "./css/Home.css";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Tabs,
  Tab,
  Form,
  Button,
  Container,
  Jumbotron,
  ProgressBar,
  Modal,
  Alert
} from 'react-bootstrap';
import ImportFromFileBodyComponent from "../components/ImportFromFileBodyComponent";
import LoaderButton from "../components/LoaderButton";
import FormAlerts from "../components/Home/FormAlerts";

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.title = "";
    this.state = {
      upload_good: false,
      upload_bad: false,
      data: "",
      uuid: "",
      email: "",
      group: "Choose...",
      reports: [],
      cache: 0,
      priority: false,
      total_pages: 0,
      current_tab: "upload",
      submit_messages: [],
      email_messages: [],
      data_messages: [],
      group_messages: [],
      title_messages: [],
      requesting: false,
      request_progress: 0,
      total_requests: 0,
      progress_bar: 0,
      react_form: null,
      infomodal: false,
      infomodal_details_title: "",
      infomodal_details_group: "",
      infomodal_details_total: "",
      infomodal_details_email: "",
      infomodal_details_errors: "",
      infomodal_icons: "",
      infomodal_title: "Data Submission Overview",
      available_reports: []
    };
  }

  componentDidMount() {
    try {
      window.addEventListener("resize", this.resize.bind(this));
      this.resize();
      var uuid = this.uuidv4();
      this.getReports();
      this.setState({ uuid: uuid, reports_loading: true });
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

  CSV(csv, reviver) {
    reviver = reviver || function (r, c, v) { return v; };
    var chars = csv.split(''), c = 0, cc = chars.length, start, end, table = [], row;
    while (c < cc) {
      table.push(row = []);
      while (c < cc && '\r' !== chars[c] && '\n' !== chars[c]) {
        start = end = c;
        if ('"' === chars[c]) {
          start = end = ++c;
          while (c < cc) {
            if ('"' === chars[c]) {
              if ('"' !== chars[c + 1]) { break; }
              else { chars[++c] = ''; } // unescape ""
            }
            end = ++c;
          }
          if ('"' === chars[c]) { ++c; }
          while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { ++c; }
        } else {
          while (c < cc && '\r' !== chars[c] && '\n' !== chars[c] && ',' !== chars[c]) { end = ++c; }
        }
        row.push(reviver(table.length - 1, row.length, chars.slice(start, end).join('')));
        if (',' === chars[c]) { ++c; }
      }
      if ('\r' === chars[c]) { ++c; }
      if ('\n' === chars[c]) { ++c; }
    }
    return table;
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  learnMore() {
    this.props.history.push("/guide/learn");
  }

  checkPaste() {
    var paste_data = document.getElementById('requestForm.paste-block').value;
    this.setState({ data: paste_data, upload_good: false, upload_bad: false });
  }

  validEmail(email) {
    var error = false;
    if (0 === email.value.length) {
      this.setState({ email_messages: [{ 'level': "danger", "message": "At least one @jtf.com email address is required." }] });
      error = true;
    } else {
      var email_errors = [];
      var split_email = email.value.split(",");
      split_email.forEach((single_email) => {
        single_email = single_email.trim();
        // if (!/^[a-zA-Z0-9.]+@[a-zA-Z0-9]+\.[A-Za-z]+$/.test(single_email)) {
        //   email_errors.push({ 'level': "danger", 'message': single_email + " (Invalid email address)" });
        //   error = true;
        // } else if (!/@jtf.com\s*$/.test(single_email)) {
        //   email_errors.push({ 'level': "danger", 'message': single_email + " (Not a JTF email)" });
        //   error = true;
        // }
      });
      if (error) {
        this.setState({ email_messages: email_errors });
      }
    }
    if (!error) {
      this.setState({ email_messages: [] });
    }
    return !error;
  }

  requestPromise(data) {
    var jstring = JSON.stringify(data);
    var form_data = new FormData();

    form_data.append("data", jstring);
    form_data.append("uuid", this.state.uuid);
    form_data.append("total", this.state.total_pages);
    return fetch('http://127.0.0.1:8000/request/products', {
      method: 'POST',
      body: form_data
    }).then((response) => {
      if (200 !== response.status) {
        let current_warnings = [];
        current_warnings.push({
          'level': "warning",
          'message': "Response Error : " + response.status.toString()
        });
        var all_current_warnings = this.state.current_warnings;
        all_current_warnings.push(current_warnings);
        this.setState({ submit_messages: all_current_warnings });
      }
      var current_progress = this.state.request_progress;
      current_progress = parseInt(current_progress) + 1;

      var progress_percentage = parseInt((100 / parseInt(this.state.total_pages)) * parseInt(current_progress));
      this.setState({ request_progress: current_progress, progress_bar: progress_percentage });
      return response.text();
    })
      .then((body) => {
        return body;
      });
  }

  setInit(form_data) {
    return fetch('http://127.0.0.1:8000/request/init', {
      method: 'POST',
      body: form_data
    }).then(response => response.json()
    ).then(data => {
      return data;
    }
    ).catch(err => console.log(err));
  }

  async returnResults(promise_array) {
    let submit_messages = [];
    const results = await Promise.all(promise_array).then((result) => { return result; });
    results.forEach((result) => {
      var json_result = JSON.parse(result);
      if ("error" === json_result.state) {
        submit_messages.push({ 'level': "danger", 'message': json_result.message });
      } else if ("warnings" === json_result.state) {
        submit_messages.push({ 'level': "warning", 'message': json_result.message });
      }
    });
    return submit_messages;
  }

  async handleSubmit() {
    this.setState({
      data_messages: [],
      email_messages: [],
      submit_messages: [],
      group_messages: []
    });

    let valid_email = this.validEmail(document.getElementById('requestForm.emails'));

    if (valid_email && 0 !== this.state.data.length && this.state.group !== "Choose...") {
      this.setState({
        submit_messages: [{ 'level': "info", 'message': "Data loaded, processing." }]
      });

      var csv_array = this.CSV(this.state.data);
      var data = [];
      var promise_array = [];
      var columns = { 'sku': 0, 'bar_code': 0, 'category': 0, 'jtf_price': 0, 'jtf_title': 0, 'buyer': 0 };
      var row = 1;
      var total_items = 0;
      var col = 1;
      var found_headers = false;

      if ("" === this.title) {
        var now = new Date();
        var date_string = now.toISOString();
        date_string = date_string.slice(0, -1);
        this.title = date_string + this.state.group + "(" + total_items + ")";
      }

      var form_data = new FormData();

      form_data.append("email", this.state.email);
      form_data.append("uuid", this.state.uuid);
      form_data.append("title", this.title);
      form_data.append("cache", this.state.cache);
      form_data.append("priority", this.state.priority);
      form_data.append("group", this.state.group);
      form_data.append("reports", JSON.stringify(this.state.reports));

      const result = await this.setInit(form_data);

      csv_array[0].forEach(csv_value => {
        var title = csv_value
          .toString()
          .toLowerCase()
          .replace("product", "")
          .replace("jtf", "")
          .trim();
        switch (title.toLowerCase()) {
          case "sku": columns.sku = col;
            found_headers = true;
            break;
          case "_sku": columns.sku = col;
            found_headers = true;
            break;
          case "buyer": columns.buyer = col;
            found_headers = true;
            break;
          case "bar code": columns.bar_code = col;
            found_headers = true;
            break;
          case "bar codes": columns.bar_code = col;
            found_headers = true;
            break;
          case "barcodes": columns.bar_code = col;
            found_headers = true;
            break;
          case "barcode": columns.bar_code = col;
            found_headers = true;
            break;
          case "bar_code": columns.bar_code = col;
            found_headers = true;
            break;
          case "category": columns.category = col;
            found_headers = true;
            break;
          case "level 1": columns.category = col;
            found_headers = true;
            break;
          case "sell price(inc vat.)": columns.jtf_price = col;
           found_headers = true;
            break;
          case "price": columns.jtf_price = col;
            found_headers = true;
            break;
          case "_price": columns.jtf_price = col;
            found_headers = true;
            break;
          case "our price": columns.jtf_price = col;
            found_headers = true;
            break;
          case "RRP": columns.jtf_price = col;
            found_headers = true;
            break;
          case "title": columns.jtf_title = col;
            found_headers = true;
            break;
          case "_title": columns.jtf_title = col;
            found_headers = true;
            break;
          case "description":
            if (0 === columns.jtf_title) {
              columns.jtf_title = col;
              found_headers = true;
            }
            break;
          default:
        }
        col++;
      });

      var total_pages = ((csv_array.length - (csv_array.length % 100)) / 100) + 1;

      this.setState({ total_pages, request_progress: 0 });
      csv_array.forEach(csv_line => {
        var entry = {};
        col = 1;
        csv_line.forEach(csv_value => {
          if (!found_headers || 1 !== row) {
            if (!found_headers) {
              entry = { "sku": csv_value };
            } else {
              for (var key in columns) {
                if (columns[key] === col) {
                  entry[key] = csv_value;
                }
              }
            }
          }
          col++;
        });

        if (!found_headers || 1 !== row) {
          data.push(entry);
          total_items++;
        }

        if (0 === row % 100) {
          promise_array.push(this.requestPromise(data));
          data = [];
        }
        row++;
      });

      if (100 !== row) {
        promise_array.push(this.requestPromise(data));
      }

      var report_string = "";
      this.state.reports.forEach((report) => {
        report_string = report_string + report + ", ";
      });

      if (0 < report_string.length) {
        report_string = report_string.substring(0, report_string.length - 2);
      }
      var submit_messages = [];
      if ("success" === result.state) {
        await this.returnResults(promise_array);
        const uuid = this.uuidv4();
        submit_messages.push({ 'level': "success", 'message': "Request Accepted" });
        this.setState({
          submit_messages,
          progress_bar: 0,
          data_messages: [],
          group_messages: [],
          infomodal_details_errors: "",
          infomodal_details_title: this.title,
          infomodal_details_group: this.state.group,
          infomodal_details_total: total_items,
          infomodal_details_email: this.state.email,
          infomodal: true,
          upload_progress: 0,
          total_pages: 0,
          last_request_total: row,
          uuid,
          upload_good: false,
          data: ""
        });
        document.getElementById('requestForm.emails').value = "";
        document.getElementById('requestForm.paste-block').value = "";
        document.getElementById('requestForm.title').value = "";
        document.getElementById('requestForm.group').selectedIndex = 0;
        document.getElementById('requestForm.reports').value = 0;
      } else {
        this.setState({
          submit_messages: [{ 'level': "warning", 'message': "Failed to create request" }],
          infomodal_details_title: this.title,
          infomodal_details_total: total_items,
          infomodal_details_email: this.state.email
        });
      }
    } else {
      if (this.state.group === "Choose...") {
        let group_messages = [];
        group_messages.push({
          'level': "danger",
          'message': "Please select a group from the dropdown list."
        });
        this.setState({ group_messages: group_messages });
      }
      if (0 === this.state.data.length) {
        let data_messages = [];
        data_messages.push({
          'level': "danger",
          'message': "Missing upload or paste data."
        });
        this.setState({ data_messages: data_messages });
      }
    }
    this.setState({ requesting: false });
    return true;
  }

  handleTitle(title) {
    this.title = title;
  }

  modalReports() {
    return this.state.reports.concat().map((report) => {
      return (
        <Container>{report[1]}</Container>
      );
    });
  }

  renderReports() {
    return this.state.available_reports.concat().map((report) => {
      return (
        <option key={report[0]} value={report[0]}>{report[1]}</option>
      )
    });
  }

  resize() {
    let current_react_form = (window.innerWidth >= 992);
    if (current_react_form !== this.state.react_form) {
      this.setState({ react_form: current_react_form });
    }
  }

  renderModal() {
    return (
      <Modal className={"submit_modal"} show={this.state.infomodal} onHide={() => { this.setState({ infomodal: false }) }} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span style={{ fontSize: "20pt" }} className={this.state.infomodal_icons} /> {this.state.infomodal_title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="show-grid">
              <Col className="title">
                Report Title
                 </Col>
              <Col className="info">
                {this.state.infomodal_details_title}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col className="title">
                Report Group
                 </Col>
              <Col className="info">
                {this.state.infomodal_details_group}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col className="title">
                Total Products
                 </Col>
              <Col className="info">
                {this.state.infomodal_details_total}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col className="title">
                Email(s)
                    </Col>
              <Col className="info">
                {this.state.infomodal_details_email}
              </Col>
            </Row>
            <Row className="show-grid">
              <Col className="title">
                Requested reports
                    </Col>
              <Col className="info">
                {"" === this.state.infomodal_details_reports ? "ALL" : this.modalReports()}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={
            () => {
              this.setState({ infomodal: false })
            }
          }>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render() {
    return (
      <div className="Home content">
        <Jumbotron>
          <h1>Welcome</h1>
          <p>
            The following system allows you to search Google Shopping Platform for product information 
            using bar codes, model numbers, SKU, keywords or phrases.
          <br />
            For help formatting a request upload click 'Learn More'
          </p>
          <div>
            <Button variant="primary" onClick={() => { this.learnMore() }}>Learn more</Button>
          </div>
        </Jumbotron>
        <h2 className="guide_h2">Identifier Request</h2>
        <p style={{ marginTop: "10px" }}>Please fill in and select from the options below.</p>
        <Container className="Home request_form">
          <Form onSubmit={this.handleSubmit} id="form1" className="request-form">
            <Row>
              <Col md={6} lg={4}>
                <Form.Group controlId="requestForm.title" style={{ marginBottom: "0px" }}>
                  <Form.Label className="first-input">Title</Form.Label>
                  <Form.Control type="input" onChange={(event) => { this.handleTitle(event.target.value); }} />
                  <Form.Text className="text-muted">
                    <span style={{ marginTop: "4px", fontSize: "10pt", fontWeight: "normal" }}>
                      Leave this field blank to automatically generated a title with the following format. (Date + Time) (Report Group).</span></Form.Text>
                  <FormAlerts messages={this.state.title_messages} />
                </Form.Group>
              </Col>
              <Col md={6} lg={4}>
                <Form.Group controlId="requestForm.group">
                  <Form.Label className="first-input">
                    {this.state.group_messages.length > 0 ? <span style={{ color: "#721c24" }}>Group</span> : "Group"}
                  </Form.Label>
                  <Form.Control className="form-input select" as="select" onChange={(event) => { this.setState({ group: event.target.value }); }}>
                    <option>Choose...</option>
                    <option>Home</option>
                    <option>Home Textiles</option>
                    <option>Home Furniture</option>
                    <option>Home Office</option>
                    <option>Garden</option>
                    <option>Health and Beauty</option>
                    <option>Toys and Games</option>
                    <option>Stationary</option>
                    <option>Cleaning</option>
                    <option>Pet</option>
                    <option>DIY</option>
                    <option>Car</option>
                    <option>Sports and Leisure</option>
                    <option>Travel</option>
                    <option>Food and Drink</option>
                    <option>Misc</option>
                  </Form.Control>
                  <Form.Text className="text-muted">
                    <span style={{ marginTop: "4px", fontSize: "10pt", fontWeight: "normal" }}>
                      To help you identify this request on the results screen.</span></Form.Text>
                </Form.Group>
              </Col>
              <Col md={6} xs="auto" lg={4}>
                <Form.Group controlId="requestForm.emails">
                  <Form.Label className="first-input">
                    {this.state.email_messages.length > 0 ? <span style={{ color: "#721c24" }}>Email</span> : "Email"}</Form.Label>
                  <Form.Control type="input"  onChange={(event) => { this.setState({ email: event.target.value }); }} />
                  <Form.Text className="text-muted">
                    <span style={{ marginTop: "4px", fontSize: "10pt", fontWeight: "normal" }}>
                      Only JTF emails are accepted. To enter multiple email addresses each must be separated with a coma.
                     </span>
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col lg={6} xs="auto">
                <Form.Label className="first-input">
                  {this.state.data_messages.length > 0 ? <span style={{ color: "#721c24" }}>Products</span> : "Products"}
                  <Link className=".App-link" to="/guide/home/products">
                    <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-info-sign" />
                  </Link></Form.Label>
                <Form.Text className="text-muted"><div style={{ marginTop: "4px", marginBottom: "10px", fontSize: "10pt", fontWeight: "normal" }}>
                  Make a request for product information using its SKU, bar code or model number.  You can include a title,
                  price and category, which will then be available in selected reports.
                      </div>
                </Form.Text>

                <Tabs onClick={
                  (event) => {
                    if ("Paste" === event.target.innerHTML
                      || "Upload" === event.target.innerHTML) {
                      this.setState({ current_tab: event.target.innerHTML });
                    }
                    event.target.blur()
                  }
                } transition={false} defaultActiveKey="first" className="upload-forms">
                  <Tab id="first" eventKey="first" title="Upload">
                    {this.state.upload_bad ?
                      <Alert key={0} variant="danger" visible="true">
                        Please check the file and try again.  Only csv files are allowed.<br />
                        <span style={{ fontSize: "9pt" }}>Maximum file size: 128Mb</span>
                      </Alert> : null}
                    <ImportFromFileBodyComponent upload={this} />
                    <div style={{ marginTop: "4px", fontSize: "9pt" }}>Products queued : {((this.state.data.split("\n").length) - 2) > 0 ?
                      <span style={{ fontWeight: "bold" }}>{((this.state.data.split("\n").length) - 2)}</span>
                      : "0"}
                    </div>
                  </Tab>
                  <Tab id="second" eventKey="second" title="Paste">
                    <Form.Group controlId="requestForm.paste-block">
                      <Form.Text className="text-muted">
                        <div style={{ marginTop: "4px", marginBottom: "10px", fontSize: "10pt", fontWeight: "normal" }}>
                          Type or Paste your data into the box below.</div>
                      </Form.Text>
                      <Form.Control as="textarea" style={{ height: "320px" }} onChange={() => { this.checkPaste(); }} />
                    </Form.Group>
                  </Tab>
                </Tabs>
              </Col>
              <Col lg={6}>
                <Container>
                  <Form.Label className="first-input">Reports<Link className=".App-link" to="/guide/home/reports">
                    <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-info-sign" />
                  </Link></Form.Label>
                  <Form.Group controlId="requestForm.reports">
                    <Form.Text className="text-muted">
                      <div style={{ marginTop: "4px", marginBottom: "10px", fontSize: "10pt", fontWeight: "normal" }}>
                        Hold Ctrl to select multiple reports.<br />
                      </div>
                    </Form.Text>
                    <Form.Control style={{ height: "Paste" === this.state.current_tab && this.state.react_form ? 400 : 292 }} className="form-input multiple-select" as="select" onBlur={(event) => { var reports = [...document.getElementById('requestForm.reports').selectedOptions].map(o => o.value); this.setState({ reports: reports }); }} multiple>
                      {this.renderReports()}
                    </Form.Control>
                    <span style={{ fontSize: "9pt" }}>*conditional on the data provided within this request.</span>
                  </Form.Group>
                  <Form.Group controlId="requestForm.priority">
                    <Form.Check
                      type={'checkbox'}
                      id={'priority'}
                      value={'1'}
                      style={{ display: "inline-block" }}
                      label={'High Priority Request'}
                      onClick={
                        (event) => {
                          event.target.value === true ?
                            this.setState({ priority: true }) :
                            this.setState({ priority: false })
                        }
                      }
                    />
                  </Form.Group>
                  <Form.Group controlId="requestForm.cache">
                    <Form.Check
                      type={'checkbox'}
                      id={'cache'}
                      value={'1'}
                      style={{ display: "inline-block" }}
                      label={'Just search through the existing data'}
                      onClick={
                        (event) => {
                          event.target.value === true ?
                            this.setState({ cache: true }) :
                            this.setState({ cache: false })
                        }
                      }
                    />
                    <span className="glyphicon glyphicon-time" style={{ marginLeft: "5px", fontSize: "12pt", width: "20px" }}></span>
                  </Form.Group>
                </Container>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center", marginTop: "10px !important" }}>
                <FormAlerts messages={this.state.group_messages} />
                <FormAlerts messages={this.state.email_messages} />
                <FormAlerts messages={this.state.data_messages} />
                <FormAlerts messages={this.state.submit_messages} />
              </Col>
            </Row>
            <Row>
              <Col>
                <Container className="button-container" style={{ width: "150px" }}>
                  {1 < this.state.total_pages ?
                    <div style={{ marginBottom: "10px", width: "150px" }}>
                      <div>{this.state.progress_bar}%</div>
                      <ProgressBar now={this.state.progress_bar}></ProgressBar>
                    </div>
                    :
                    null
                  }
                  <LoaderButton
                    isLoading={this.state.requesting}
                    text="Make Request"
                    loadingText="Making Request"
                    onClick={() => { this.setState({ requesting: true }); this.handleSubmit() }}
                  />

                </Container>
              </Col>
            </Row>
          </Form>
        </Container>
        <p style={{ marginTop: "10px", marginBottom: "10px", fontSize: "100%", fontWeight: "normal" }}>
          The request can take up to 24 hours to complete.  
          You can monitor the request by clicking on the `Progress` option on the top navigation menu.
                      </p>
        {this.renderModal()}
      </div>
    );
  }
}