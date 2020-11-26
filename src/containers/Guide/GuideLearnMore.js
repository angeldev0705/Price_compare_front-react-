/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import img3 from './images/ss3.png';
import img4 from './images/ss4.png';
import img5 from './images/ss5.png';
import barcode_multi from "./examples/barcode_multi.csv";
import complex from "./examples/complex.csv";
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
      <div className="Learn More">
          <Container className="request_form" style={{textAlign:"left"}}>
            <div>&nbsp;</div>
            <div><a href="/">Back</a></div>
          <p>
            For more details about these features and there functions please refer to the <a href="/guide/introduction">main guide</a>.<br/>
          </p>
          <h2 className="guide_h2">Formatting a request</h2>
          <h3 className="guide_h3">File Upload (.csv)</h3>
          <p>The easiest way to prepare a request is to use Microsoft Excel, the file must be in a .csv file format.  
            You can select the file format option when you save the spreadsheet.  A quick and easy way to have a usable file is to download an example file and open it in Excel, then delete the example bar codes and enter your own.
            The following example file is the most basic type of request, it has a single column of information.<br/><a href={barcode_multi}>Click here to download a 'Basic CSV' File</a><br/><a href={complex}>Click here to download a 'All Options' CSV File</a></p>
          <h3 className="guide_h3">Paste Options</h3>
          <p>
           This screenshot shows a simple request using the paste option to upload the request data, in this case a single bar code.
           <div style={{ width: "100%", textAlign: "center" }}><img src={img3} alt="simple_paste"/></div>
          </p>
          <p>
           Below is shown a more complex request that includes the products price, title, and sku.
           <div style={{ width: "100%", textAlign: "center" }}><img src={img4} alt="simple_paste"/></div>
           Because the price, title and sku have been included they are saved in the JTF database, and will then be available to be included in any reports generated using this request.  The product sku and title are saved against the product, and only need to be included in one request.  The price information is only related to this request.
          </p>
          <h2 className="guide_h2">Uploading the file</h2>
          <p>
            You can drag and drop the prepared request csv file onto the webpage from either a open folder or 
             the desktop, or you can click on the 'Upload CSV File' button and select the file using the dialog window that appears. If the file is accepted a green dashed border will appear as shown below.
              This indicates that the file has been accepted and is ready to be uploaded.
                <div style={{ width: "100%", textAlign: "center" }}><img src={img5} alt="simple_paste"/></div>
                Problems uploading a file or making a request to the platform? Please use the contact us form under the Guide -> Contact Us In the top navigation menu.  
          </p>
          </Container>
      </div>
    );
  }
}