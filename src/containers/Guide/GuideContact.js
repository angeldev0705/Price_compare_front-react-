/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import {
  Container,
  Form,
  Button
} from 'react-bootstrap';
export default class Guide extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      portalborder: ""
    };
  }

  render() {
    return (
      <div className="GuideContact content">
        <h2 className="guide_h2">Contact</h2>
        <p>{this.props.getPropsInterval}</p>
        <Container className="request_form">
          <Form>
            <p>
              To request help with this platform please fill in the required information.  We will get back to you as soon as possible.
            </p>
            <Form.Group>
              <Form.Control type="email" placeholder="Enter email" />
              <Form.Text>
                Please enter your email address
        </Form.Text>
            </Form.Group>
            <Form.Group controlId="question">
              <Form.Text className="text-muted">
                <div style={{ marginTop: "4px", marginBottom: "10px", fontSize: "10pt", fontWeight: "normal" }}>
                  Please enter your question into the box below.</div>
              </Form.Text>
              <Form.Control as="textarea" style={{ height: "200px" }}/>
            </Form.Group>
            <Button OnClick={()=>{alert("test");}}>Submit Request</Button>
          </Form>


        </Container>
      </div>
    );
  }
}