/*jshint esversion: 8 */

import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import './App.css';
import logo from './JTF.png';
import Routes from "./Routes";
import {
  Row,
  Col,
  Navbar,
  Nav,
  NavDropdown,
  Form,
  Button,
  Container,
  Modal
} from 'react-bootstrap';
import Footer from "./components/App/Footer";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleScroll = this.handleScroll.bind(this);
    this.state = {
      propsData: [],
      search_modal: false,
      platform_details:[],
      search_modal_details: "",
      search_modal_icons: "glyphicon glyphicon-ok",
      nav_classname: ""
    };
  }

  setPropsData = data => {
    this.setState({ data: data });
  }

  componentWillUnmount = () => {
    document.removeEventListener('scroll', this.handleScroll, false);
  };

  componentDidMount = () => {
    try {
      document.addEventListener('scroll', this.handleScroll, false);
      setInterval(() => {
        let r = (el, deg) => {
          el.setAttribute('transform', 'rotate(' + deg + ' 40 40)');
        };
        if (null !== document.getElementById("sec")) {
          const d = new Date();
          var milsec = 0.006 * d.getMilliseconds();
          r(document.getElementById("sec"), 6 * d.getSeconds() + milsec);
          r(document.getElementById("min"), ((6 * d.getMinutes()) + ((6 * d.getSeconds()) / 60)));
          r(document.getElementById("hour"), (30 * (d.getHours() % 12) + d.getMinutes() / 2));
        }
      }, 5);
      this.getPlatformDetails();
    }
    catch (e) {
      console.log(e);
    }
  };

  getPlatformDetails = () => {
    return fetch('http://127.0.0.1:8000/platform', {
      method: 'GET'
    }).then(response => response.text())
      .then((body) => {
        var json_data = JSON.parse(body);
        if ("success" === json_data.status) {
          this.setState({ platform_details: JSON.parse(json_data.message) });
          return true;
        }
        return false;
      }
      ).catch(err => console.log(err));
  };


  handleScroll = () => {
    let scrollTop = window.scrollY;
    let className = "";
    if (scrollTop > 99) {
      className = "nav-shadow";
    }
    this.setState({
      nav_classname: className
    });
  };

   searchPost = async (search_sku) => {
    return await fetch('http://127.0.0.1:8000/product?sku=' + search_sku, {
      method: 'GET'
    }).then((response) => {
      console.dir(response);
      return response;
    })
      .then((body) => {
        return body;
      });
  };

  searchClick = () => {
    const search_sku = document.getElementById("search-input").value;
    if (search_sku.length === 0) {
      this.setState({ search_modal: true, search_modal_details: "Please Enter a SKU" });
      return;
    }
    let result = this.searchPost(search_sku);
    // if (0 < result['data'].length) {
    //   alert("results");
    // } else {
     // this.setState({ sku: result.data.sku });
     this.props.history.push("/search");
    // }
  };

  renderModal = () => {
    return (
      <Modal show={this.state.search_modal} onHide={() => { this.setState({ search_modal: false }) }} aria-labelledby="contained-modal-title-vcenter">
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <span style={{ fontSize: "20pt" }} className={this.state.search_modal_icons} /> {this.state.search_modal_title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            <Row className="show-grid">
              <Col>
                Problem with search request :
                 </Col>
            </Row>
            <Row className="show-grid">
              <Col>
                {this.state.search_modal_details}
              </Col>
            </Row>
          </Container>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={
            () => {
              this.setState({ search_modal: false })
            }
          }>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }

  render = () => {
    const childProps = {
      getPropsData: this.state.propsData,
      setPropsData: this.setPropsData
    };
    return (
      <div className="App container">
        <header className="App-header">
          <div><div className="wave"></div><div className="wave"></div><div className="wave2"></div></div>
          <Container>
            <Row className="justify-content-md-left">
              <Col xs="4" md="auto" lg="auto">
                <img src={logo} className="App-logo" alt="logo" />
              </Col>
              <Col className="justify-content-md-left">
                <h4 className="strapline">Price<br />Comparison<br />Platform</h4>
              </Col>
              <Col xs="4" md="3" lg="2">
                <svg id="clock">
                  <g id="hands">
                    <circle id="face" cx="40" cy="40" r="36"/>
                    <line id="hour" x1="40" y1="40" x2="40" y2="18" strokeLinecap="round" />
                    <line id="min" x1="40" y1="40" x2="40" y2="10" strokeLinecap="round" />
                    <line id="sec" x1="40" y1="40" x2="40" y2="6" />
                    <circle cx="40" cy="40" r="4" fill="#FF7D23" />
                  </g>
                </svg>
              </Col>
            </Row>
          </Container>
        </header>
        <Navbar className={this.state.nav_classname} fluid="true" collapseOnSelect sticky="top" bg="light" expand="lg">
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav>
              <Nav.Link exact className="top-nav" as={NavLink} to="/">Identifier</Nav.Link>
              <Nav.Link className="top-nav" as={NavLink} to="/phrase">Phrase</Nav.Link>
              <Nav.Link className="top-nav" as={NavLink} to="/browse">Browse</Nav.Link>
              <Nav.Link className="top-nav" as={NavLink} to="/progress">Progress</Nav.Link>
              <Nav.Link className="top-nav" as={NavLink} to="/reports">Results</Nav.Link>
              <Nav.Link className="top-nav" as={NavLink} to="/schedule">Schedule</Nav.Link>
              <NavDropdown className="top-nav" title="Guide" id="basic-nav-dropdown">
                <NavDropdown.Item as={NavLink} to="/guide/introduction">Introduction</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/guide/requests">Making a Request</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/guide/progress">Monitoring a Request</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/guide/reports">Downloading Reports</NavDropdown.Item>
                <NavDropdown.Item as={NavLink} to="/guide/schedule">Scheduling Requests</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item as={NavLink} to="/guide/contact">Contact Us</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
          <Container id="search-container">
            <Form inline className="search-form" style={{ fontSize: "12pt", float: "right" }}>
              <Form.Control id="search-input" type="text" placeholder="Search By SKU" className="mr-sm-2" />
              <Button variant="outline-success" onClick={(event) => { this.searchClick(); event.target.blur(); }}><span style={{ fontSize: "12pt" }} className="glyphicon glyphicon-search" /></Button>
            </Form>
          </Container>
        </Navbar>
        <div className="cbody">
          <Routes childProps={childProps} />
        </div>
        <Footer className="App-footer" strapline={{ thing: "" }} props={this.state.platform_details} />
        {this.renderModal()}
      </div>
    );
  }
}

export default App;