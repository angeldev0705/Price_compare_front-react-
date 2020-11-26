/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import install_script from "./examples/symfony_provisioner.sh";
import simple_csv from "./examples/simple_product.csv";
import single_first_csv from "./examples/single_first.csv";
import multi_first_csv from "./examples/multi_first.csv";
import multi_first_complete_csv from "./examples/multi_first_complete.csv";
import multi_price_csv from "./examples/multi_price.csv";
import existing_update_csv from "./examples/existing_update.csv";
import {
  Container
} from 'react-bootstrap';
export default class GuideIntroduction extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      portalborder: ""
    };
  }

  render() {
    return (
      <div className="GuideIntroduction content">
        <h1 className="guide_h2">JTF Price Comparison Guide</h1>
        <div className="guide_block">
          <p>Welcome to the JTF Price Comparison Platform.  This application has been designed to help you gather and review product
            data collected from the Google Shopping portal.
  This allows you to request information on product reviews, competitors, availability and price data in a number of different ways by using the <a href="/">identifier</a> or <a href="/phrase">phrase</a> request forms. <br/>
  With both the identifier and phrase requests you are able to upload a file or enter the information directly.  When a product or products are submitted the information is uploaded to the JTF database, and requests are then made to a 3rd party API.
  Once this has been resolved and a response is returned to the applications server the data is processed and stored.</p>

  <p style={{fontStyle:"italic"}}>
            The aim of this application is to help you organize, submit and utilise a request for price comparison data using a product bar code, sku* or keyword search phrase.          <br/>
          *A successful request must of already been made containing the bar code and sku information</p>
            <p>If you have any suggestions please click on the contact us option in the 'Guide' top navigation menu and then click on 'Contact Us' fill in the form to submit your question, 
              alternatively you can email it directly to pricetracked.com<br/>
            To cross reference any data please select the 'Full Report' option, 
            the furthest right hand column contains the origin url.  
            You can copy and paste this address into your browser to see the data directly from the Google Shopping portal.  
            If there are any discrepancies between the results shown in the generated report and the web page please email the results and 
            source link to pricetracked.com, with the subject line 'data error' or use the contact form on the contact us page in the guide menu.
          </p>
          <p>This guide is focused on the user operations of the application.  To review the code behind this application please
          refer to the code documentation.  You can access it by clicking on the question mark shown in the
          footer.  Technical details regarding software languages and support infrastructure are give in the 'Technologies used' 
          section of this page.</p>
          <ul>
            <li><a href="#gs">Getting Started</a></li>
            <li><a href="#mm">Main menu</a><ul>
              <li>Identifer</li>
              <li>Phrase</li>
              <li>Browse</li>
              <li>Progress</li>
              <li>Results</li>
              <li>Schedule</li>
            </ul></li>
            <li><a href="#ds">Data Source</a></li>
            <li><a href="#rqn">Requesting New Products</a></li>
            <li><a href="#d">The Dataset</a></li>
            <li><a href="#rq">Making a Request</a></li>
            <li><a href="#mrq">Monitoring a Request</a></li>
            <li><a href="#gr">Generating a Report</a></li>
            <li><a href="#sc">Security</a></li>
            <li><a href="#tc">Technologies used</a></li>
          </ul>
          <div id="gs">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <p><h2 className="guide_h2">Getting Started</h2>This platform can accept thousand of requests, and the process time can range from a matter of seconds to over 24hours depending on the
            options you have selected.<br/><span style={{fontWeight:"bold"}}>Why?</span><br />
            When you select to make a request there can be a number of different workflows this platform can take.  This is influenced by the
            age of the existing data, whether or not the product has been found in a previous request and the 'priority' and 'use existing data' options that are selected when making the initial request.
            Both phrase  and identifier searches follow the same algorithms.  The only extra delay could be occurred when a loose search phrase is used and the maximum results are returned. i.e. 'Garden Chairs'.
            The current 3rd party API returns a maximum of 100 results per query item, so please bear this in mind when submitting phrase requests.
          </p><div id="gs">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <p><h2 className="guide_h2" id="mm">Main Navigation Menu Options</h2>
            <h3 className="guide_h3">Identifer</h3>
            <p>
              You can make a request using a products bar code or sku.  If you are using the JTF sku the product must have already been requested including the sku information.  You must include a JTF email and select a product group when making a request.  You do not need to give the request a title or select any of the reports.
              If you need any help click on the info icon in the orange circle to find out more about that option.  To switch between the file upload and paste options on the identifer form please click on the corrisponding tab, 'Upload' or 'Paste'.
          <h4 className="guide_h4">Examples</h4>
              <br />CSV uploads (click on a link to download).
          <ul><li><a href={simple_csv}>Single Product (minimum required)</a></li>
                <li><a href={single_first_csv}>Single Product First Request (recommended minimum)</a></li>
                <li><a href={multi_first_csv}>Multiple Products First Time Request using minimum recommended information</a></li>
                <li><a href={multi_first_complete_csv}>Multiple Products First Time Request (complete data)</a></li>
                <li><a href={multi_price_csv}>Multiple Products Existing (JTF price included)</a></li>
                <li><a href={existing_update_csv}>Multiple Products Update Existing Product Title</a></li>
              </ul>
              <br />Copy Paste
          <ul>
                <li>Single Product SKU Search (Product Exists and has been linked to the Bar Code)
            <pre>
                    <code>
                    00051141346991
              </code>
                  </pre>
                </li>
                <li>Single Product Bar Code Search
            <pre>
                    <code>
                      barcode<br />
                      00051141346991<br />
                    </code>
                  </pre>
                </li>
                <li>Multiple Bar Code Search
            <pre>
                    <code>
                      barcode<br />
                      00051141346991<br />
                      00052427790033<br />
                      00025997322300<br />
                    </code>
                  </pre>
                </li>
              </ul>
            </p>
            <h3 className="guide_h3">Phrase</h3>
            <p>
              You can use this form to make a request for one or more search phrases.  These can be single words, groups of related words, or sentences up to 255 characters in length.  
              There is the option to drag and drop a text file on to the page, or paste them into the text box.
               For more details please <a href="/guide/requests#phrase">click here</a>
        <h4 className="guide_h4">Examples</h4>
              <ul>
                <li>
                  Search for a Hotpoint Washing Machine using its Model Number
          <pre>
                    <code>
                    wmfug742p
                    </code>
                  </pre>
                </li>
              </ul>
            </p>
            <h3 className="guide_h3">Browse</h3>
            <p>
              Under Construction. This page will give you the ability to review the history and trends for individual products or product groups and will be available in a future release.
        </p>
            <h3 className="guide_h3">Progress</h3>
            <p>
              The progress of a request is shown in the top table, showing you basic information about its current status.  You can left click on any report that is in progress to download a partial report of any completed request items.  
              On completion it will appear in a table at the bottom of the page, entitled 'Requests Completed Within the last 60 minutes'. If you left click on the row a popup will appear with options to select a report to generate and then download.
              Each in progress row has a percentage bar, if the bar is green the platform is querying new products and there price points will need to be retrieved once the products status has been determined. 
              Or blue, the products prices are being retrieved.
        </p>
            <h3 className="guide_h3">Results</h3>
            <p>
              All successfully requests are shown on this page.  You have the option to download a selection of general reports relating to the platform or you can select an individual request and then the type of request report you would like.  
              Left click on the report row, a popup will appear giving you option to generate and download reports or set the selected request as a scheduled item.
        </p>
            <h3 className="guide_h3">Schedule</h3>
            <p>
              Left click on the schedule item to update or delete.  Each row shows the scheduled request, its status and the time frame in which it will be active.  
              To add a new item, navigate to the results page, left click on the request you would like to schedule and click the schedule button.  The following screen will then appear.
        </p>
          </p>
          <div id="ds">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Data Source</h2>
          <p>The information received and processed by this platform is collected from the Google Shopping Portal using a third party API, the section below outlines this workflow and processes and why the information that is collected must be 
            reviewed before any price changes are enacted.</p>
          <p>
            <span className="guide_h4">Workflow</span><br />
            <ol className="guide_block">
              <li>A request is made against a products bar code.</li>
              <li>The system checks to if the product exists in the system.</li>
              <li>If the product exists a check is made on the age of the products 'general' information.  If this data is older than 7 days a product request is made. Once this is completed or the information is up to date the next step is performed.</li>
              <li>
                  A request is made using the products 'google product id'.  This type of request is usual completed relatively quickly (within a couple of hours.)<br/>
                   OR<br/>
                   If a request for its prices has been made within the past 24 hours the existing information is returned.<br/>
                </li>
            </ol></p>
          <div id="rqn">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Requesting New Products</h2>
          <p>
            When making a request for a new product that does not currently exist on the system it is recommended that you include as much information as possible.  If you are unsure on whether or not the product will be found you can submit a basic request, then on the the next, include any extra details.  
            The product on the system will then update to include the new information such as title and sku.  New products can take up to 24 hours to complete.  This is due to the product potentially returning a 'not found' 404 response.  
            The bar code is used as a search request, if it is found an associated 'google product id' is returned.  If it is not found the system stores this information and will prohibit on further requests to the API, this can be overridden to force another request.  
            Due to this there can be a relatively high number of not found products if there are new.
          </p>
          <div id="d">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Dataset</h2>
          <p>The Google Shopping Platform allow 3rd parties to request information in two ways, expression and identifier matching.  Please be aware that product information is managed and entered by Googles merchants, Google themselves do not amend or update the dataset, they authorize requested 'changes' from their Merchants.  New entries are automatically added.  This type of data collection is referred to as Web2.0.
            A corner stone of this design principle is a clear understanding on the part of the user that it is in their (The Merchants) interest to enter accurate information and that if another user finds that information to be inaccurate they will request a change.  This is most evident with the website wikipedia.  The reality however with the
            business sector is different, with many merchants opting to create new products which are 99% the same, this can be due to them wanting the product title to be slightly different or to use single product information for multi pack products. These are just two examples of how this system does not always work and this can result 
            in more than one google product have the same bar code, have an incorrect bar code, or incorrect information.
            This creates a polluted  and unreliable dataset, this is due to there being no single entity controlling the data or having a financial or business interest in keeping its integrity intact.<br/>The overriding philosophy returns to :<span style={{fontStyle:"italic"}}>
            'The merchants are paying for the information to be displayed so it is in their best interest to make sure it is not misleading or incorrect.'</span>
          </p>
          <div id="rq">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Requests</h2>
          <p>
            When making a request there are a number of selection options available.  For full examples please <a href="/guide/requests">click here.</a>
            <br />If you are requesting the product for the first time it is recommended to include the JTF sku, this will then enable the product to be requested in the future using the sku and it will be included in any reports that contain the product.
            <h3 className="guide_h3">Simple single bar code request</h3>
            <p>To search for a single bar code, from the 'Identifier' page click on the 'Paste' tab under 'Products'.  
              In the text area type the bar code in the first line. Fill in the required options and click on 'Make Request'<br/>
              A popup will then appear showing the result of the request.  
              If you have missed any information a info box will appear above the 'Make Request' button showing the error details.
            </p>
            <h4 className="guide_h4">Paste In Information</h4>
            <p>
              Copy the contents from a text file and paste it into the text box in the same way you would with the single bar code request.
              This must fit the following data structure.
              *If it is a list of only bar codes you can paste / enter then as a list each on its own line.<br />
              <span style={{fontStyle:"italic"}}>e.g</span><br />
              <pre>
                <code>
                  barcode1<br />
                  barcode2<br />
                  barcode3<br />
                </code>
              </pre>
              To add extra information you are required to add a header line.<br />
              <span style={{fontStyle:"italic"}}>e.g</span><br />
              To include the sku information the first line would be.<br />
              <pre>
                <code>
                  barcode,sku<br />
                  ...<br/>
                </code>
              </pre>
              You would then request each product on a new line as.<br />
              <pre>
                <code>
                  ...<br/>
                  barcode1,sku1<br />
                  barcode2,sku2<br />
                  barcode3,sku3<br />
                </code>
              </pre>
              So the full request in the text box would be.<br />
              <pre>
                <code>
                  barcode,sku<br />
                  barcode1,sku1<br />
                  barcode2,sku2<br />
                  barcode3,sku3<br />
                </code>
              </pre>
              This would link each sku with each bar code, once the sku has been set against a bar code you do not need to include the bar code with any subsequent requests and can use the sku as the product identifier.
              You can include the following information in both a csv or text request.<br />
              <ul>
                <li>barcode</li>
                <li>sku</li>
                <li>price*</li>
                <li>title</li>
              </ul>
              *The price data is only used with the single request reports.  Each request must include its only set of current JTF prices.  These can then be used in any margin reports that are generated against the results.
            </p>
            <h4 className="guide_h4">CSV upload</h4>
            <p>To request multiple items it is recommended to use the csv upload feature.  
              As a minimum a file must contain at least one bar code, but if you include column headers you are able to request products using there sku and data that will be 
              included in reports generated once the request has been completed.<br />
              To download one of the example csv file please click on one of the links below.
            <ul>
                <li>Simple bar code requests</li>
                <li>New products</li>
                <li>Existing products, with JTF prices</li>
                <li>Update product information stored in JTF database example</li>
              </ul>
            </p>
          </p>
          <div id="mrq">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Monitoring a Request</h2>
          <p>The platform offers the ability to download partly completed requests by left clicking on the row and then selecting reports.</p>
          <p>Completed reports are shown at the bottom of the page for up to 60 minutes after they have been completed.<br />Once completed they are also shown on the 'Report' screen.</p>
          <p><span style={{fontWeight:"bold"}}>Progress bar colours.</span>  Due to there potentially being two stages to each product request the progress bar can be either green or blue.<br />
          Green: The products general information is being updated and once this information is returned a second request is required to retrieve the products current price points.<br />
          Blue:The product information is up to data and has a product id.  A price point request is in progress<br />
          Once a Green request has completed the progress bar will change colour and reset when new information is received and the screen is refreshed</p>
          <div id="gr">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Generating a Report</h2>
          <p>Reports are generated every time you download them, the data that is use will depend on the request set they are generated from.  If you have included certain elements within the request they will be
            available within any generated reports.  These can be the jtf title, jtf price or buyer.  Extra items of data can be added on request but they must be included in at least one prior or the current request to be accessible.
            Other elements such as price have too be included each time an item is requested.  When making a request you have the option to select reports and have them sent to a jtf email address.
            These options do not affect any subsequent reports that are generated from the results or progress screens and the email is only sent once, when the initial request has been completed are only to any included emails.
        </p>
          <p>If you would like a format of report that is not available please email the details and we will get back too you as soon as possible.</p>
          <div id="sc">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Security</h2>
          <p>
            There are a number of security features built into this platform.  The two that as a user you need to be aware of are.<br/>
            i, The platform is IP restricted, if you want to access this service from outside the Tuxford Office you will need to make a request to have your
            ip address added to the whitelist.<br/>
            ii, A JTF email address is required to allow the platform to log activity.  A 'request completed' email will be sent, this will also include any
            reports you have selected.
        </p>
        <p>Please note that the information gather using this platform is the property of JTF, and must not be distributed without the permission of a senior manager.  Failure to do so may result in disciplinary proceedings.</p>
        <div id="tc">&nbsp;<br />&nbsp;<br />&nbsp;</div>
          <h2 className="guide_h2">Technologies</h2>
          <p>
            This application has been build upon the Symfony 4 and ReactJS 16 frameworks.<br/>&nbsp;<br/>
            <span style={{fontWeight:"bold"}}>Client Side</span><br/>
            git clone https://jtf-uk@bitbucket.org/jtf-uk/price-compare-api.git<br/>
            A static build will need to be deployed to a basic web server, any ip address links to the API will need updating.
            <ul>
              <li>
              Language : es6 Javascript
              </li>
              <li>
              Framework : ReactJS 16
              </li>
            </ul>
            <span style={{fontWeight:"bold"}}>Backend (API)</span><br/>
            git clone https://jtf-uk@bitbucket.org/jtf-uk/price-compare-api.git
            <ul>
              <li>
                Language : php 7.4
              </li>
              <li>
                Framework : Symfony 4
              </li>
            </ul>
            <span style={{fontWeight:"bold"}}>Database</span><br/>
            Doctrine ORM, compatible with<br/>
            <ul>
              <li>Mysql 5 / 8</li>
              <li>MariaDB 11</li>
              <li>AWS DB</li>
            </ul>
            <span style={{fontWeight:"bold"}}>3rd Party API</span><br/>
            DataForSEO<br/>
            <ul>
              <li>website : https://dataforseo.com/</li>
            </ul>
            There are three DQL classes that will required adapting if you plan to use this system on a Microsoft MSSQL database.<br/>
            This application can run on any web server with the correct php libraries install, iis, apache, nginx, ect.<br/>Here is a shell script for provisioning a ubuntu 18 server : <a href={install_script}>download API platform setup bash script</a>
        </p>
        </div>
      </div>
    )
  }
}
