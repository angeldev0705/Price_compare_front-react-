/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import img2 from './images/ss2.png';
import img11 from './images/ss11.png';
import {
    Container
  } from 'react-bootstrap';
export default class GuideHomeReports extends Component {

constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        portalborder: ""
    };
    }  

  render() {
    return (
      <div className="GuideHomeReports content">
          <h2 className="guide_h2">Reports</h2>
          <p>
            When you make a request there is the option to attach selected reports to the conformation email.  Please note that after the request has completed you can still access any of the reports through the 'Results' page. As shown in the next section.  
            <div style={{ width: "100%", textAlign: "center", margin:"20px 0" }}>
              <img src={img11} alt="request_reports"/></div>You can generate and download reports from any completed requests from the 'Results' tab on the top navigation menu.
              Left click on the row and then select the report from the drop down menu, click on 'Generate'.  
            A download link will appear underneath the drop down when the report is ready. This is a temporary link that will be valid for up to 24 hours.  
            The report is automatically generated each time you want to download it, depending on the report and the number of products requested or returned when using a phrase or keyword, you may have to wait a few seconds before the link appears.   
          </p>
          <p>
            <div style={{ width: "100%", textAlign: "center", margin:"20px 0" }}>
              <img src={img2} alt="request_reports"/></div>
              There is also the option to generate a partial report while the request is still running which will return any resolves products or search phrase / keywords, right click on the running request on the 'Progress' page.
          </p>
          </div>
          )
    }
}
