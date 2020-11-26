/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import img15 from './images/ss15.png';
import {
    Container,
    Form
  } from 'react-bootstrap';
export default class GuideProgress extends Component {

constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        portalborder: ""
    };
    }  

  render() {
    return (
      <div className="GuideProgress content">
          <h2 className="guide_h2">Monitoring Your Requests</h2>
          <p>Once you have successfully made a request you can track it by clicking on the 'Progress' top navigation option.<br/>
          If there are no requests in progress a message will be shown.  If there are active requests they will be listed in the following table format.
           </p>
           <div style={{ width: "100%", textAlign: "center" }}>
           <img src={img15} alt="progress screen"/>
         </div><p> The progress bar can be either green or blue depending on the stage at which the one or more of the products is currently in.  These can be 'Green' in which case the product will require two requests.
            If you have requested multiple products, but only one of them requires updating then this bar will be green.  Once all product are requesting just price data the progress bar will turn blue.</p>
         <p>
            <ul style={{listStyleType:"none", marginTop:"20px"}}>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Type</span>: Phrase / Identifier</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Group</span>: Selected request group</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Products</span>: Recognised product lines submitted</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Variations</span>: Requests made. Each product bar code can be associated with more than one google product id</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Active</span>: Requests still running</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Not Found</span>: Products within the request that have not been found.</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Completed</span>: Completed (not including 'Not Found')</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Posted @</span>: Date and time of first request</li>
              <li><span style={{fontWeight:"bold",minWidth:"100px",display:"inline-flex"}}>Progress</span>: Percentage Progress Bar. Cycles : (Green) x2 (Blue) x1</li>
            </ul>
          </p>
          <p>Scheduled request are also shown in this table.</p>
      </div>
    );
  }
}