/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import img16 from './images/ss16.png';
import {
  Container
} from 'react-bootstrap';
export default class GuideSchedule extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      portalborder: ""
    };
  }

  render() {
    return (
      <div className="GuideSchedule content">
        <h1 className="guide_h2">Schedules</h1>
        <p>This platform has the ability to automatically run requests for product price information.  A request will needed to be ran manually before you can set as a schedule item.</p>
        <div>
          <img src={img16} alt="schedule tab" />
        </div>
        <p className="guide_block">
          To set a request to run automatically please follow these steps.
        <ol className="guide_block">
            <li>Navigate to the Results screen.</li>
            <li>Left click on the request you would like to schedule</li>
            <li>A popup will appear, left click on 'Set Schedule'</li>
            <li>A new schedule item form will appear showing the available options you can set.</li>
            <li>You are required to enter the following information
            <ul>
                <li>Select at least one day to run the schedule</li>
                <li>An end date.</li>
                <li>At least one report to be generated.  The results will be shown in the same way as a manual request.  You will be able to select any of the reports once it has completed.
                  The selected report will be included in the completion email.
              </li>
                <li>A Title</li>
                <li>Your JTF email address</li>
              </ul>
            </li>
          </ol>
          You are able to edit the schedule once it has been set.  Navigate to the Schedule page in the top navigation menu.  Once the page has loaded, left click on the schedule item row.
            Its details will then be displayed at the top of the page, you can alter any of the original options including the requested reports.
            As with the manual requests you are able to enter multiple recipients emails into the
          email address box.  Separated by a coma. e.g. Thomasharvey.me, pricetracked.com , presence.co.uk
      </p>
        <h2 className="guide_h2">Consideration</h2>
        <p>When a request is processed by this platform there is a financial cost ocured, if you select to make the requested items to be set as high priority this cost will double.
          You are able to review the potential cost this once the schedule item has been set, if you find this to be too high you are able to delete the entry before its is ran.
          You are able to see the estimated cost of each run in the schedule table.
          The scheduled request are ran as midnight.
        </p>
        <p>If you have any questions about scheduled requests please use the form on the contact us page.</p>
      </div>
    );
  }
}