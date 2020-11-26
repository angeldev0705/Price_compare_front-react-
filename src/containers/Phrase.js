/*jshint esversion: 8 */
import React, { Component } from "react";
import "./css/Home.css";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Button,
  Container,
  ProgressBar,
  Modal
} from 'react-bootstrap';
import ImportFromFileBodyComponent from "../components/PhraseFromFileBodyComponent";
import LoaderButton from "../components/LoaderButton";
import FormAlerts from "../components/Home/FormAlerts";

export default class Phrase extends Component {

  constructor(props) {
    super(props);
    this.state = {
      title: "",
      upload_good: false,
      upload_bad: false,
      data: "",
      uuid: "",
      email: "",
      reports: [],
      priority: false,
      submit_messages: [],
      email_messages: [],
      data_messages: [],
      title_messages: [],
      requesting: false,
      react_form: null,
      request_progress: 0,
      total_requests: 0,
      progress_bar: 0,
      total_pages: 0,
      infomodal: false,
      infomodal_details_title: "",
      infomodal_details_group: "",
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
        }).filter((value)=>{
            return value[1].replace("*","").length === value[1].length;
        });

        if ("success" === json_data.status) {
          this.setState({ available_reports: reports });
          return true;
        }
        return false;
      }
      ).catch(err => console.log(err));
  }

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
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
    form_data.append("total", 1);
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
      submit_messages: []
    });

    let valid_email = this.validEmail(document.getElementById('requestForm.emails'));

    if (valid_email && "" !== this.state.data[0]) {
      this.setState({
        submit_messages: [{ 'level': "info", 'message': "Data loaded, processing." }]
      });

      if ("" === this.title) {
        var now = new Date();
        var date_string = now.toISOString();
        date_string = date_string.slice(0, -1);
        this.title = date_string;
      }


      var form_data = new FormData();

      form_data.append("email", this.state.email);
      form_data.append("uuid", this.state.uuid);
      form_data.append("title", this.title);
      form_data.append("cache", 0);
      form_data.append("type", "PH");
      form_data.append("priority", this.state.priority);
      form_data.append("group", 'n/a');
      form_data.append("reports", JSON.stringify(this.state.reports));

      const result = await this.setInit(form_data);

      var report_string = this.state.reports.join(',');

      if (0 < report_string.length) {
        report_string = report_string.substring(0, report_string.length - 2);
      }
      var submit_messages = [];
      if ("success" === result.state) {
        var post_data = [];

        this.state.data.split(/\r|\n/).forEach(element=>{
          
          if(element !== "") {
            post_data.push({"bar_code":element});
          }
        });

        var post_set = [];
        var post_block = [];
        post_data.forEach(element=>{
          post_set.push(element);
          if (post_set.length === 100){
            post_block.push(this.requestPromise(post_set));
            post_set = [];
          }
        });

        if (100 !== post_set.length) {
          post_block.push(this.requestPromise(post_set));
        }

        console.dir(post_block);

        await this.returnResults(post_block);
        
        const uuid = this.uuidv4();

        submit_messages.push({ 'level': "success", 'message': "Request Accepted" });
        this.setState({
          submit_messages,
          data_messages: [],
          infomodal_details_errors: "",
          infomodal_details_title: this.state.phrase,
          infomodal_details_email: this.state.email,
          infomodal: true,
          total_pages: 1,
          phrase_data: [],
          uuid,
          upload_good: false,
          data: ""
        });
        document.getElementById('requestForm.emails').value = "";
        document.getElementById('requestForm.phrase').value = "";
        document.getElementById('requestForm.reports').value = 0;
      } else {
        this.setState({
          submit_messages: [{ 'level': "warning", 'message': "Failed to create request" }],
          infomodal_details_title: this.title,
          infomodal_details_email: this.state.email
        });
      }
    } else {
      if("" === this.state.data[0]){
        this.setState({ data_messages: [{ 'level': "danger", "message": "Please enter a search phrase" }] });
      } else {
        this.setState({ data_messages: [{ 'level': "danger", "message": "There has been an error submitting your request" }] });
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
      )
    });
  }

  renderReports() {
    return this.state.available_reports.concat().map((report, index) => {
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
        <h2 className="guide_h2">Phrase Search</h2>
        <p style={{ marginTop: "10px" }}>Please fill in and select from the options below.  You can search using a phrase up to 150 characters in length.</p>
        <Container className="Home request_form">
          <Form onSubmit={this.handleSubmit} id="form1" className="request-form">
            <Row>
              <Col lg={6}>
              <Form.Group controlId="requestForm.title" style={{ marginBottom: "0px" }}>
                  <Form.Label className="first-input">Title</Form.Label>
                  <Form.Control type="input" onChange={(event) => { this.handleTitle(event.target.value); }} />
                  <Form.Text className="text-muted">
                    <span style={{ marginTop: "4px", fontSize: "10pt", fontWeight: "normal" }}>
                      If left blank a title will automatically be generated.<br />(Date + Time).</span></Form.Text>
                  <FormAlerts messages={this.state.title_messages} />
                </Form.Group>
                </Col>
                <Col>
                <Form.Group controlId="requestForm.emails">
                  <Form.Label className="first-input">
                    {this.state.email_messages.length > 0 ? <span style={{ color: "#721c24" }}>Email</span> : "Email"}</Form.Label>
                  <Form.Control type="input" placeholder="@jtf.com" onChange={(event) => { this.setState({ email: event.target.value }); }} />
                  <Form.Text className="text-muted">
                    <span style={{ marginTop: "4px", fontSize: "10pt", fontWeight: "normal" }}>
                    Only JTF emails are accepted. To enter multiple email addresses each must be separated with a coma.
                     </span>
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Row>
            <Col lg={6}>
            <Form.Group controlId="requestForm.phrase">
            <Form.Label className="first-input">
                  {this.state.data_messages.length > 0 ? <span style={{ color: "#721c24" }}>Search Using Keyword or Phrase</span> : "Search By Keyword or Phrase"}
                  <Link className=".App-link" to="/guide/home/phrase">
                    <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-info-sign" />
                  </Link></Form.Label>

                <Form.Text className="text-muted"><div style={{ marginTop: "4px", marginBottom: "10px", fontSize: "10pt", fontWeight: "normal" }}>
                  Please enter a single search phrase or word in the box below.
                      </div>
                </Form.Text>
                <Form.Control size="150" maxLength="150" type="input" placeholder="Phrase or Word Search" onChange={(event) => { this.setState({ data:event.target.value }); }} />
            </Form.Group>
            <p style={{ fontSize: "10pt"}}>or<br/>upload a file, each line is a search request.</p>
            <Form.Group controlId="requestForm.upload">
            <ImportFromFileBodyComponent upload={this} />
                    <div style={{ marginTop: "4px", fontSize: "9pt" }}>Phrases queued : {((this.state.data.split("\n").length) - 2) > 0 ?
                      <span style={{ fontWeight: "bold" }}>{((this.state.data.split("\n").length) - 2)}</span>
                      : "0"}
                    </div>
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
              </Col>
              <Col lg={6}> 
                <Container>
                  <Form.Label className="first-input">Reports<Link className=".App-link" to="/guide/home/reports">
                    <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-info-sign" />
                  </Link></Form.Label>
                  <Form.Group controlId="requestForm.reports">
                    <Form.Text className="text-muted">
                      <div style={{ marginTop: "4px", marginBottom: "10px", fontSize: "10pt", fontWeight: "normal" }}>
                        Hold Ctrl to select multiple reports.  You are not required to select any reports. <br />
                      </div>
                    </Form.Text>
                    <Form.Control style={{ height: "Paste" === this.state.current_tab && this.state.react_form ? 400 : 292 }} className="form-input multiple-select" as="select" onBlur={(event) => { var reports = [...document.getElementById('requestForm.reports').selectedOptions].map(o => o.value); this.setState({ reports: reports }); }} multiple>
                      {this.renderReports()}
                    </Form.Control>
                  </Form.Group>
                </Container>
              </Col>
            </Row>
            <Row>
              <Col style={{ textAlign: "center", marginTop: "10px !important" }}>
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