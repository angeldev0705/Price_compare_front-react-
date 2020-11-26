import React, { Component } from "react";
import { Container } from "react-bootstrap";
import "./css/NotFound.css";

export default class NotFound extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
    };
  }

  renderIntervals() {
    var loop, loop1, loop2, loop3, time = 30, i = 0;

    loop = setInterval(function () {
      clearInterval(loop);
      if (null !== document.getElementById("thirdDigit")) {
        loop3 = setInterval(function () {
          if (null === document.getElementById("thirdDigit")) {
            clearInterval(loop3);
            return;
          }

          if (i > 40) {
            clearInterval(loop3);
            document.getElementById("thirdDigit").textContent = 4;
          } else {
            document.getElementById("thirdDigit").textContent = (Math.floor(Math.random() * 9) + 1);
            i++;
          }
        }, time);

        loop2 = setInterval(function () {
          if (null === document.getElementById("secondDigit")) {
            clearInterval(loop3);
            return;
          }
          if (i > 80) {
            clearInterval(loop2);
            document.getElementById("secondDigit").textContent = 0;
          } else {
            document.getElementById("secondDigit").textContent = (Math.floor(Math.random() * 9) + 1);
            i++;
          }
        }, time);

        loop1 = setInterval(function () {
          if (null === document.getElementById("firstDigit")) {
            clearInterval(loop3);
            return;
          }
          if (i > 100) {
            clearInterval(loop1);
            document.getElementById("firstDigit").textContent = 4;
          } else {
            document.getElementById("firstDigit").textContent = (Math.floor(Math.random() * 9) + 1);
            i++;
          }
        }, time);
      }
    }, time);
  }

  render() {
    return (
      <Container className="NotFound">
        <Container className="error">
          <Container className="container-floud">
            <Container className="col-xs-12 ground-color text-center">
              <Container className="container-error-404">
                <div className="clip"><div className="shadow"><span id="thirdDigit" class="digit thirdDigit"></span></div></div>
                <div className="clip"><div className="shadow"><span id="secondDigit" class="digit secondDigit"></span></div></div>
                <div className="clip"><div className="shadow"><span id="firstDigit" class="digit firstDigit"></span></div></div>
              </Container>
              <h2 className="h1">Sorry, Page not found.</h2>
            </Container>
          </Container>
        </Container>
        {this.renderIntervals()}
      </Container>
    )
  }
}