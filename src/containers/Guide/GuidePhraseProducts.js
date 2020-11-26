/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import img12 from './images/ss12.png';
import {
    Container
  } from 'react-bootstrap';
export default class GuidePhraseProducts extends Component {

constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        portalborder: ""
    };
    }  

  render() {
    return (
      <div className="GuidePhraseProducts content">
            <div><a href="/phrase">Back</a></div>
            <h2 className="guide_h2">Quick Guide to Making a Phrase Request</h2>
          <p>Follow the steps below to quickly search for a keyword, phrase or model id.<br/>
          <ol>
            <li>
              Enter your email.
            </li>
            <li>
             Type you Word or Phrase search text box.
            </li>
            <li>
            Now click on 'Make a Request'
            </li>
          </ol>
          <br/>
           You can monitor the request in the 'Progress' page.</p>
          <p>
          This application handles phrase and search word request in the same way as bar code or sku requests.  
          A list of matching products are returned and then price requests are made against each.  
          With a Identifer request you may find that there are a couple of variation with the products.  
            When using a phrase or search word the amount returned can greatly increase when a loose phrase or broad search word is used.  
            It is recommended to use phrases that focus on adjective noun combinations and to try and avoid the use of verbs and adverbs.  
          You can also select to upload a file containing your search words and phrases by clicking on the upload button or by dragging and 
          dropping it onto the purple section of the form from the desktop or an open folder.  
          If the file is accepted the border will turn green.
          </p>
          <p>There are limitation in using this type of request concerning the ability of the platform to link returned information to existing products, 
            and for it to recall previous request for comparison with the current one.  
            These results should be viewed as a snapshot of the current market, 
            this is because the results returned can vary from one request to another.<br/>
        </p>
          </div>
          )
    }
}
