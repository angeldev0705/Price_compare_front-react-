/*jshint esversion: 8 */
import React, { Component } from "react";
import "./css/Search.css";
import { Link } from "react-router-dom";
import {

} from 'react-bootstrap';

export default class Search extends Component {

  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {

  }

  render() {

    return (
      <div className="Search content">
       <h2>Search Results for</h2>
      <h2>{this.props.search}</h2>
      </div>
    );
  }
}