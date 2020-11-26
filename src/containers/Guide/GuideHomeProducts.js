/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import img6 from './images/ss6.png';
import img7 from './images/ss7.png';
import img9 from './images/ss9.png';
import img10 from './images/ss10.png';
import img13 from './images/ss13.png';
import img14 from './images/ss14.png';
import {
  Container
} from 'react-bootstrap';
export default class GuideHomeProducts extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      portalborder: ""
    };
  }

  render() {
    return (
      <div className="GuideHomeProducts content">
        <div><a href="/">Back</a></div>
        <p><h2 className="guide_h2">Quick Guide to Making a Identifer Request (Bar Code or SKU)</h2>
          <p>How to make a simple bar code or sku request.  Follow these steps to make a request for a group of bar codes. You do not need to give your request a title to submit a request.</p>
          <ol>
            <li>Select an option from 'Group' the dropdown menu. (required)
            <div style={{ width: "100%", textAlign: "center" }}>
                <img src={img13} alt="group dropdown" />
              </div>
            </li>
            <li>Enter your JTF email address            
              <div style={{ width: "100%", textAlign: "center" }}>
                <img src={img14} alt="text panel" style={{ margin: "20px 0" }} />
              </div></li>
            <li>Click on the 'Paste' tab just below the 'Products' heading.
            <div style={{ width: "100%", textAlign: "center" }}>
                <img src={img6} alt="text panel" style={{ margin: "20px 0" }} />
              </div>
            </li>
            <li>Enter the bar code information as shown below, replace the example bar codes with your own.
            <div style={{ width: "100%", textAlign: "center" }}>
                <img src={img7} alt="text panel" style={{ margin: "20px 0" }} />
              </div>
              If you enter sku's please add the first line 'sku' as shown below.
              <div style={{ width: "100%", textAlign: "center" }}>
                <img src={img10} alt="text panel" style={{ margin: "20px 0" }} />
              </div>
            </li>
            <li>Now Click on the 'Make Request' at the bottom of the form.
            </li>
            <li>If the request has been accepted by the platform a success popup will appear showing the number of products requested, if there are any errors in the entered data then the appropriate message(s) will appear above the button.
            </li>
          </ol>
        </p>
        <p className="guide_block">
          <h2 className="guide_h2">Using a File</h2>
          To upload a file, drag and drop it onto the
   blue (identifier) section of the form, this can be from a folder or your computers desktop.  Alternatively, click on the upload button to show the dialog window.
     You are only able to upload .csv files, any other format will be rejected.
     <div style={{ width: "100%", textAlign: "center" }}>
            <img src={img9} alt="text panel" style={{ border: "1px solid #000", margin: "20px 0" }} />
          </div>
          Once the platform has completed the request you will receive an email.
         You can select to have reports generated and attached to the email when creating the request.
  You can monitor the requests in the 'Progress' page.  Once the request has completed it will be included on the 'Results' page.</p>
      </div>
    )
  }
}
