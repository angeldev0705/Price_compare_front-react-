import React, { Component } from "react";
import "./css/Reports.css";
import {
    Container
  } from 'react-bootstrap';
export default class Product extends Component {

constructor(props) {
    super(props);

    this.state = {
        isLoading: true,
        categories:[],
        category_filter:[],
        sku:""
    };
    }  


    
  componentDidMount() {
    try {
        if("" === this.state.props.sku) {
            this.state.history.push("/");
        }
    }
    catch (e) {
      alert(e);
    }
  }


// async getReportFilters() {
//       var form_data = new FormData();
//       form_data.append("sku", search_sku);
//       return await fetch('http://ec2-3-8-4-14.eu-west-2.compute.amazonaws.com/api/report/filters', {
//         method: 'GET'
//       }).then(response => response.text())
//         .then((body) => {
//           return body;
//         });
//     }

// async getReports() {
//   var form_data = new FormData();
//   form_data.append("sku", search_sku);
//     return await fetch('http://ec2-3-8-4-14.eu-west-2.compute.amazonaws.com/api/reports', {
//       method: 'POST',
//       body: data
//     }).then(response => response.text())
//       .then((body) => {
//         return body;
  //     });
  // }


  render() {
    return (
      <div className="Reports content">
          <h1>Google Shopping Price Comparison Portal</h1>
          <h2>Reports</h2>
          <Container className="request_form">
          </Container>
      </div>
    );
  }
}