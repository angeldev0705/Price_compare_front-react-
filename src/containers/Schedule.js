/*jshint esversion: 8 */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Form,
  Container,
  Button,
  Table
} from "react-bootstrap";
import "./css/Schedule.css";
import {
  CSSTransition,
  TransitionGroup
} from 'react-transition-group';
import FormAlerts from "../components/Home/FormAlerts";
import DatePicker from "react-datepicker";

export default class Schedule extends Component {

  constructor(props) {
    super(props);
    this.state = {
      id: null,
      new: false,
      data: "",
      days: [],
      email: "",
      schedule: "",
      schedules: [],
      schedule_error: null,
      repeat_group: "",
      start_date: null,
      start_date_error: null,
      end_date: null,
      end_date_error: null,
      reports: [],
      reports_error: null,
      display: false,
      priority: 1,
      title: "",
      title_error: null,
      active: 0,
      available_reports: [],
      submit_messages: [],
      email_messages: [],
      report_messages: [],
      schedule_messages: [],
      title_messages: []
    };
  }

  componentDidMount() {
    try {
      window.addEventListener("resize", this.resize.bind(this));
      if (undefined !== this.props.location.state) {
        if (undefined !== this.props.location.state.repeat_group) {
          this.setState({ start_date: new Date().getTime(), repeat_group: this.props.location.state.repeat_group, new: true });
        }
      }
      this.resize();
      this.getReports();
      this.getScheduleItems();
      this.setState({ reports_loading: true });
    }
    catch (e) {
      alert(e);
    }
  }

  resize() {
    let current_react_form = (window.innerWidth >= 992);
    if (current_react_form !== this.state.react_form) {
      this.setState({ react_form: current_react_form });
    }
  }

  validEmail(email) {
    var error = false;
    if (0 === email.length) {
      this.setState({ email_messages: [{ 'level': "danger", "message": "At least one @jtf.com email address is required." }] });
      error = true;
    } else {
      var email_errors = [];
      var split_email = email.split(",");
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

  renderReports() {
    return this.state.available_reports.concat().map((report) => {
      return (
        <option key={report[0]} value={report[0]}>{report[1]}</option>
      )
    });
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

  async getScheduleItems() {
    return await fetch('http://127.0.0.1:8000/schedule', {
      method: 'GET'
    }).then(response => response.text())
      .then((body) => {
        var json_data = JSON.parse(body);
        var schedules = JSON.parse(json_data.message);
        if (0 < this.state.schedules.length) {
          let schedule_table = Array.from(document.getElementById('schedule_table').querySelectorAll('tr'));
          schedule_table.forEach((row) => {
              row.classList.remove("selected_row");
          });
        }
        this.setState({ schedules });
        return;
      });
  }

  submitScheduleItem() {

    let submit_messages = [];
    let error = false;

    if ('' !== this.state.email) {
      error = !this.validEmail(this.state.email);
    } else {
      this.setState({ email_messages: [{ 'level': "danger", "message": "At least one @jtf.com email address is required." }] });
      error = true;
    }

    let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].concat().filter((day) => {
      if (undefined !== this.state.days[day]) {
        if (this.state.days[day]) {
          return this.state.days[day];
        }
      }
    });

    var schedule_error = null;
    var start_date_error = null;
    var end_date_error = null;
    var reports_error = null;
    var title_error = null;

    if (0 === days.length) {
      schedule_error = true;
      submit_messages.push({ 'level': "danger", "message": "Please select at least one day" });
      error = true;
    }

    if (null === this.state.end_date) {
      end_date_error = true;
      submit_messages.push({ 'level': "danger", "message": "Please select an end date" });
      error = true;
    } else if (this.state.end_date < this.state.start_date) {
      start_date_error = true;
      submit_messages.push({ 'level': "danger", "message": "End date must be after start date" });
      error = true;
    }

    if (0 === this.state.reports.length) {
      reports_error = true;
      submit_messages.push({ 'level': "danger", "message": "Please select at least one report" });
      error = true;
    }

    if (0 === this.state.title.length) {
      title_error = true;
      submit_messages.push({ 'level': "danger", "message": "Please enter a title" });
      error = true;
    }

    this.setState({
      title_error,
      schedule_error,
      reports_error,
      start_date_error,
      end_date_error
    });

    if (!error) {
      var form_data = new FormData();
      if (null !== this.state.id) {
        form_data.append("id", this.state.id);
      }

      form_data.append("email", this.state.email);
      form_data.append("repeat_group", this.state.repeat_group);
      form_data.append("title", this.state.title);
      form_data.append("active", this.state.active);
      form_data.append("start_date", this.state.start_date);
      form_data.append("end_date", this.state.end_date);
      form_data.append("priority", this.state.priority);
      form_data.append("schedule", JSON.stringify(days));
      form_data.append("reports", JSON.stringify(this.state.reports));
      fetch('http://127.0.0.1:8000/schedule', {
        method: 'POST',
        body: form_data
      })
        .then(response => {
          if (200 !== response.status && 201 !== response.status) {
            throw response.status;
          }
          return response.text();
        })
        .then(body => {
          var response_json = JSON.parse(body);
          var response_message = JSON.parse(response_json.message);
          submit_messages.push({ 'level': "success", "message": "schedule item updated" });
          this.setState({ id: response_message.id, submit_messages });
          this.getScheduleItems();
        })
        .catch(error => {
          submit_messages.push({ 'level': "danger", "message": error });
          this.setState({ submit_messages });
        });
    } else {
      this.setState({ submit_messages });
    }
  }

  async deleteScheduleItem() {
    await fetch('http://127.0.0.1:8000/schedule/' + this.state.id, {
      method: 'DELETE'
    }).then(response => {
      if (200 !== response.status) {
        throw response.status;
      }
    }).catch((error) => {
      console.log(error)
    });
    this.setState({
      id: null,
      title: '',
      repeat_group: '',
      reports: '',
      schedule: '',
      active: '',
      email: '',
      priority: '',
      next: '',
    });
    this.getScheduleItems();
  }

  selectScheduleItem(id, r) {

    let options_1 = Array.from(document.getElementById('requestForm.reports').querySelectorAll('option'));
    options_1.forEach((oelement) => {
      oelement.selected = false;
    });

    this.setState({ id, new: false, email_messages: [], submit_messages: [] });
    const schedule = this.state.schedules.filter(item => {
      if (item.id === id) {
        return item;
      }
    })

    let schedule_table = Array.from(document.getElementById('schedule_table').querySelectorAll('tr'));
    schedule_table.forEach((row) => {
      console.log(r.parentNode.rowIndex + " " +  row.rowIndex)
      if (r.nodeName === 'DIV') {
        r = r.parentNode;
      }
      if (r.parentNode.rowIndex === row.rowIndex) {
        row.classList.add("selected_row");
      } else {
        row.classList.remove("selected_row");
      }
    });


    let report_array = JSON.parse(schedule[0].reports);
    report_array.map((element) => {
      options_1.map((oelement) => {
        if (parseInt(element) === parseInt(oelement.value)) {
          oelement.selected = true;
        }
      });
    });

    let checked = schedule[0].active;

    document.getElementById('active').checked = checked;

    checked = false;
    if (2 === schedule[0].priority) {
      checked = true;
    }

    document.getElementById('priority').checked = checked;
    var days = [];
    ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].forEach((day) => {
      if (schedule[0].schedule.includes(day)) {
        days[day] = true;
        document.getElementById(day).checked = true;
      } else {
        document.getElementById(day).checked = false;
      }
    });

    if (null !== schedule[0].start_date && null !== schedule[0].end_date) {
      var start_date = new Date(schedule[0].start_date.date);
      var end_date = new Date(schedule[0].end_date.date);
      this.setState({
        start_date: start_date.getTime(),
        end_date: end_date.getTime()
      });
    } else {
      this.setState({
        start_date: null,
        end_date: null
      });
    }

    this.setState({
      title: schedule[0].title,
      repeat_group: schedule[0].repeat_group,
      reports: schedule[0].reports,
      schedule: schedule[0].schedule,
      active: schedule[0].active,
      email: schedule[0].email,
      days,
      priority: schedule[0].priority,
      next: schedule[0].next,
    });
  }

  readableReport(ids) {
    return this.state.available_reports.map((value) => {
      if (ids.includes(value[0])) {
        return (
          <Container style={{ textAlign: 'left' }}>
            {value[1]}
          </Container>
        )
      }
    });
  }

  handleDateSelect(element, type) {
    var date_element;
    if ('' === element) {
      date_element = '';
    } else {
      date_element = Date.parse(element)
    }
    if ('start' === type) {
      this.setState({
        start_date: date_element
      });
    } else {
      this.setState({
        end_date: date_element
      });
    }
  }

  weekTable() {
    return ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].concat().map((day) => {
      return (
        <td><Form.Group>
          <Form.Check
            type={'checkbox'}
            id={day}
            value={'1'}
            style={{ display: "inline-block" }}
            onClick={
              (event) => {
                var days = this.state.days;
                days[day] = event.target.checked === true ?
                  1 :
                  0;
                this.setState({ days });
              }
            }
          />
        </Form.Group></td>
      );
    });
  }

  renderCreate() {
    var report_start_dates = [];
    var report_start_class = [{ "react-datepicker__day--highlighted-report": report_start_dates }];

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

    return (
      <Form onSubmit={this.handleSubmit} id="form1" className="request-form">
        <Row><Col style={{ fontSize: "16pt", fontWeight: "bold", marginTop: "20px" }}>
          {this.state.new ?
            <Container>New Schedule Item</Container>
            :
            <Container>Editing Schedule Item</Container>
          }</Col></Row>
        <Row style={{ textAlign: 'left' }}>
          <Col>
            <Form.Group controlId="requestForm.title" style={{ marginBottom: "0px" }}>
              <Form.Label className="first-input">{this.state.title_error ? <span style={{ color: "#721c24" }}>Title</span> : "Title"}</Form.Label>
              <Form.Control type="input" onChange={(event) => { this.setState({ title: event.target.value }); }} value={this.state.title} />
              <FormAlerts messages={this.state.title_messages} />
            </Form.Group>
          </Col>
          <Col>
            <Form.Group controlId="requestForm.emails">
              <Form.Label className="first-input">
                {this.state.email_messages.length > 0 ? <span style={{ color: "#721c24" }}>Email</span> : "Email"}</Form.Label>
              <Form.Control type="input" placeholder="@jtf.com" onChange={(event) => { this.setState({ email: event.target.value }); }} value={this.state.email} />
              <Form.Text className="text-muted">
                <span style={{ marginTop: "4px", fontSize: "10pt", fontWeight: "normal" }}>
                  Only JTF emails are allowed. To enter multiple email addresses each must be separated with a coma.
               </span>
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col lg={6}>
            <Container style={{ textAlign: 'left' }}>
              <Form.Label className="first-input">{this.state.reports_error > 0 ? <span style={{ color: "#721c24" }}>Reports</span> : "Reports"}<Link className=".App-link" to="/guide/home/reports">
                <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-info-sign" />
              </Link></Form.Label>
              <Form.Group controlId="requestForm.reports">
                <Form.Text className="text-muted">
                  <div style={{ marginTop: "4px", marginBottom: "10px", fontSize: "10pt", fontWeight: "normal" }}>
                    Hold Ctrl to select multiple reports.<br />
                  </div>
                </Form.Text>
                <Form.Control style={{ height: "200px" }} className="form-input multiple-select" as="select" onBlur={(event) => { var reports = [...document.getElementById('requestForm.reports').selectedOptions].map(o => o.value); this.setState({ reports: reports }); }} multiple>
                  {this.renderReports()}
                </Form.Control>
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group controlId="requestForm.priority">
                    <Form.Check
                      type={'checkbox'}
                      id={'priority'}
                      value={'2'}
                      style={{ display: "inline-block" }}
                      label={'High Priority Request'}
                      onClick={
                        (event) => {
                          event.target.checked === true ?
                            this.setState({ priority: 2 }) :
                            this.setState({ priority: 1 })
                        }
                      }
                    />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group controlId="requestForm.active">
                    <Form.Check
                      type={'checkbox'}
                      id={'active'}
                      value={'1'}
                      style={{ display: "inline-block" }}
                      label={'Active'}
                      onClick={
                        (event) => {
                          event.target.checked === true ?
                            this.setState({ active: 1 }) :
                            this.setState({ active: 0 })
                        }
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>

            </Container>
          </Col>
          <Col md={6} lg={4}>
            <Container style={{ textAlign: 'left' }}>
              <Row>
                <Col>
                  <Container style={{ fontSize: '10pt', margin: '10px 0 10px 0', textAlign: 'left' }}>Select a date from which this schedule starts.<br />This does not have to be one of the selected days but before will still trigger the request.</Container>
                  <Container>{this.state.start_date_error ? <span style={{ color: "#721c24", fontWeight: "bold" }}>Start from after</span> : "Start from after"}</Container>
                  <DatePicker
                    onChange={(date) => { this.handleDateSelect(date, 'start') }}
                    selected={this.state.start_date !== null ? this.state.start_date : null}
                    highlightDates={report_start_class}
                    minDate={new Date()}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Start From" />
                  <Container style={{ fontSize: '10pt', margin: '10px 0 10px 0', textAlign: 'left' }}>{this.state.end_date_error ? <span style={{ color: "#721c24", fontWeight: "bold" }}>End Date</span> : "End Date"}</Container>
                  <DatePicker
                    onChange={(date) => { this.handleDateSelect(date, 'end') }}
                    selected={this.state.end_date !== null ? this.state.end_date : null}
                    highlightDates={report_start_class}
                    minDate={this.state.start_date}
                    dateFormat="MMMM d, yyyy"
                    placeholderText="Until" />
                </Col>
              </Row>
            </Container>
            <Container style={{ margin: "20px 0 0 0" }}>
              <Container style={{ textAlign: "left" }}>{this.state.schedule_error ? <span style={{ color: "#721c24", fontWeight: "bold" }}>Set Schedules Days</span> : "Set Schedules Days"}</Container>
              <Table>
                <thead>
                  <tr>
                    <th><label for="monday">Monday</label></th>
                    <th><label for="tuesday">Tuesday</label></th>
                    <th><label for="wednesday">Wednesday</label></th>
                    <th><label for="thursday">Thursday</label></th>
                    <th><label for="friday">Friday</label></th>
                    <th><label for="saturday">Saturday</label></th>
                    <th><label for="sunday">Sunday</label></th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    {this.weekTable()}
                  </tr>
                </tbody>
              </Table>
            </Container>
          </Col>
        </Row>
        <Row>
          <Col style={{ textAlign: "center", marginTop: "10px !important" }}>
            <FormAlerts messages={this.state.email_messages} />
            <FormAlerts messages={this.state.submit_messages} />
          </Col>
        </Row>
        <Row>
          <Col style={{ marginBottom: "50px" }}>
            <Container className="button-container" style={{ width: "450px" }}>
              <Button
                style={{ margin: "5px" }}
                onClick={() => { this.setState({ requesting: true }); this.submitScheduleItem() }}
              >{!this.state.new ? "Update" : "Save"}</Button>
              {!this.state.new ?
                <Button
                  style={{ margin: "5px" }}
                  onClick={() => { this.setState({ requesting: true }); this.deleteScheduleItem() }}
                >Delete</Button>
                :
                null
              }
              <Button
                style={{ margin: "5px" }}
                onClick={() => { 
                  let schedule_table = Array.from(document.getElementById('schedule_table').querySelectorAll('tr'));
                  schedule_table.forEach((row) => {
                      row.classList.remove("selected_row");
                  });
                  this.setState({ id: null, new: false }) 
                }}
              >Close</Button>
            </Container>
            <hr style={{ border: "0", borderTop: "1px solid #eee", marginTop: "10px" }} />
          </Col>
        </Row>

      </Form>
    );
  }

  renderScheduleItem(items) {
    if (undefined === items[0]) {
      return;
    }
    if (undefined === items[0].created_at) {
      return;
    }
    return [{}].concat(items).map(
      (item, i) =>
        i !== 0
          ?
          <CSSTransition
            key={i}
            timeout={1000}
            classNames="fade"
          >
            <tr
              key={i}
              id={'row_'+i}
              to={"#"}
              onClick={(event) => { this.selectScheduleItem(item.id, event.target); }}
              style={{ cursor: "pointer" }}>
              <td>{item.active ? <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-ok" /> : <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-remove" />}</td>
              <td>{2 === item.priority ? <div style={{ fontSize: "16pt", marginLeft: "10px" }} className="glyphicon glyphicon-flag" /> : null}</td>
              <td>{item.title}</td>
              <td>{item.total_request * 0.001 * item.priority}-{item.total_request * 0.002 * item.priority}</td>
              <td>{item.total_request}</td>
              <td>{this.readableReport(item.reports)}</td>
              <td>{item.email}</td>
              <td>{item.schedule}</td>
              <td>{item.run_count}</td>
              <td>{null !== item.next ? new Date(item.next.date).toDateString("en") : null}</td>
              <td>{null !== item.start_date ? new Date(item.start_date.date).toDateString("en") : null}</td>
              <td>{null !== item.end_date ? new Date(item.end_date.date).toDateString("en") : null}</td>
            </tr>
          </CSSTransition>
          : null
    );
  }

  renderSchedule() {
    if ([] !== this.state.schedules) {
      return (
        <Container  style={{textAlign: "left"}}>
          <h2 className="guide_h2">Current Schedule</h2>
          <Table className={'schedule'} striped bordered hover responsive>
            <thead>
              <tr>
                <th>Active</th>
                <th>Priority</th>
                <th>Title</th>
                <th>Projected Cost($)</th>
                <th>Items</th>
                <th>Reports</th>
                <th>Email</th>
                <th>Frequency</th>
                <th>Run #</th>
                <th>Next Run</th>
                <th>Start Date</th>
                <th>End Date</th>
              </tr>
            </thead>
            <TransitionGroup
              transitionname="fade"
              transitionentertimeout={2000}
              transitionleavetimeout={2000}
              transitionappeartimeout={2000}
              transitionappear="false"
              component="tbody"
              id="schedule_table"
            >
              {this.renderScheduleItem(this.state.schedules)}
            </TransitionGroup>
          </Table>
        </Container>
      );
    }
  }

  render() {
    return (
      <div className="prices">
        <Container style={!this.state.new && null === this.state.id ? { visibility: 'hidden', display: 'none' } : { visibility: 'visible', display: 'block' }}>
          {this.renderCreate()}
        </Container>
        { 0 < this.state.schedules.length ? 
          this.renderSchedule()
        :
          <Container>No schedule Items set.  You can set a new item from the reports screen.  Click on a report and then click on 'Set Schedule'</Container>
        }
      </div>
    );
  }
}
