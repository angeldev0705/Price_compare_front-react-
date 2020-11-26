/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import img2 from './images/ss2.png';
import {
    Container
  } from 'react-bootstrap';
export default class GuideReports extends Component {

constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        portalborder: ""
    };
    }  

  render() {
    return (
      <div className="GuideReports content">
          <h1 className="guide_h2">Price Comparison Reports</h1>
		  <p>To access reports please click on the Results tab on the top navigation menu.</p>
		  <p>There are a number of different reports and options available.  Here is a brief overview of the General Reports.<br/>
		  
		  <h4  className="guide_h4">HotUkDeals Report</h4>
      <p>These are product lines where JTF is the cheapest retailer by more than 5%.</p>
		  <h4  className="guide_h4">*Nearly.</h4>
      <p>Product lines where JTF are the second cheapest retailer.</p>
		  <h4  className="guide_h4">*No Presence.</h4>
      <p>Product lines that have been queried and have not returned any JTF information from google shopping.</p>  
		  <h4  className="guide_h4">*Products.</h4>
      <p>Report containing all product lines currently on the system</p>  
		  <h4  className="guide_h4">*Competitors.</h4>
      <p>All details stored on competitors.</p>  
		  <div><span>*You can filter the results of each of these reports by changing the 'Type' and 'Filter Dates' options.</span></div>
		  <h2 className="guide_h2">How To Generate A Report</h2>
		  <p>
      To download a report relating to a request, left click on the entry shown in the table at the bottom of the page.  A Popup will then appear 
		  showing an overview of that report.<br/>&nbsp;<br/>
      <div style={{ width: "100%", textAlign: "center" }}>
                <img src={img2} alt="text panel" style={{ border: "1px solid #000" }} />
              </div><br/>
		  Click on the <ul><li>dropdown and select the report you would like the platform to generate.</li>
		  <li>Generate button. Once the report has been created and is available for download a link will appear underneath the drop down box.</li>
		  <li>link and select save to download the report.</li></ul></p>
		  
          <p>Download report are generated each time you make a request for any given report, depending on the one selected you may have to wait a few seconds before it is available for download.  Once
            the report has been generated a download link will appear.  This is a temporary link that will only be valid on that day.  If you wish to download the report again you will need to regenerate it.  
          </p>
          <h4 className="guide_h4">In Progress Reports</h4>
          <p>You are able to generate a partial report while the request is running.  In the 'Progress' page, right click on the running request and select the 
            report you would like to generate.  Once your request has completed you are able to download the results.  If you have any suggestions for reports please let us know.  Currently reports are only available as a CSV download.  You can select which reports to include within the completion email when making a request.</p>
      </p>
      </div>
    );
  }
}