/*jshint esversion: 6 */
import React from "react";
import { Row, Col, Container } from "react-bootstrap";
import "./Footer.css";

export default ({
    className = "",
    strapline,
    ...props
}) =>
    <Container className={`Footer ${className}`}>
        <Row>
            <Col>
            <a className="app-link"
            href="http://ec2-3-8-200-218.eu-west-2.compute.amazonaws.com/docs/index.html">
            <span style={{ fontSize: "16pt" }} className="glyphicon glyphicon-question-sign" />
            </a>&nbsp;&nbsp;{strapline.thing}<br/>&copy;2020 JTF Wholesale Ltd</Col>
            <Col>
            {null !== props.props.version ? 
                    <div style={{float:"right", clear:"both", width:"90px"}}>
                        <Row>
                            <Col style={{width:"30px", padding:"0px"}}>API</Col>
                            <Col style={{width:"30px", padding:"0px"}}>: {props.props.version}</Col>
                        </Row>
                        <Row>
                            <Col style={{width:"30px", padding:"0px"}}>Client</Col>
                            <Col style={{width:"30px", padding:"0px"}}>: 0.1.19</Col>
                        </Row>
                    </div>
                :
                null}
            </Col>
        </Row>
    </Container>
