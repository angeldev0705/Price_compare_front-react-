/*jshint esversion: 6 */
import React, { Component } from "react";
import "./Guide.css";
import simple_csv from "./examples/simple_product.csv";
import single_first_csv from "./examples/single_first.csv";
import multi_first_csv from "./examples/multi_first.csv";
import multi_first_complete_csv from "./examples/multi_first_complete.csv";
import multi_price_csv from "./examples/multi_price.csv";
import existing_update_csv from "./examples/existing_update.csv";
import {
  Container
} from 'react-bootstrap';
export default class GuideRequests extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      portalborder: ""
    };
  }

  render() {
    return (
      <div className="GuideRequests content">
        <h1 className="guide_h2">Making a Request</h1>
        <p>This platform has been designed to help you gather the latest price points for a product or search phrase from the Google Shopping portal.  When making a request there is a minimum amount of data required, however if you include
          further information this can be incorporated in any reports that are then generated and will also allow you to access different types of report using the returned data.  For more information on how to generate and download reports please <a href="">click here</a>.
          </p>
        <p>
          It is recommended that when requesting products for the first time you limit the amount to no more than one hundred items.  You can make multiple requests, but this ensures that the results are not 'stalled'.
          You can make requests of over one hundred thousand products but this can prove both timely and costly.  It is better to use this platform to probe markets for potential or to closely monitor competitors pricing
          strategy on key product lines or groups.  You can review hundreds of products using this tool, and it is recommended that Excel macros are used to refine the dataset to the required presentation or report format.
          </p>
        <p>
          <h2 className="guide_h2">Identifier Request Examples</h2>
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

            <li>Multiple Bar Code Search With Linking Sku (First Time Request)
            <pre>
                <code>
                  barcode,sku<br />
                  00025997644181,352416<br />
                  00025997360500,442166<br />
                  00025997640114,352401<br />
                  00025997644051,352406<br />
                  00025997322300,352400<br />
                </code>
              </pre>

            </li>

            <li>Multiple Products (Minimum recommended)
            <pre>
                <code>
                  barcode,sku,title<br />
                  00025997644181,352416,"Roughneck Wrecking Bar 18 Inch"<br />
                  00025997360500,442166,"Roughneck Flooring Knocking Block"<br />
                  00025997640114,352401,"Roughneck Pick Mattock Micro Fibreglass"<br />
                  00025997644051,352406,"Roughneck Gorilla Bar 14 Inch"<br />
                  00025997322300,352400,"Roughneck Caulking Gun Semi Barrel 10.5 Inch"<br />
                </code>
              </pre>
            </li>

            <li>Multiple Products (Already on the system)
              <pre>
                <code>
                  sku,price<br />
                  352416,6.09<br />
                  442166,11.16<br />
                  352401,13<br />
                  352406,6.65<br />
                  352400,9.26<br />
                </code>
              </pre>
            </li></ul>
          <div id="gs">&nbsp;<br />&nbsp;<br />&nbsp;</div>
        </p>
        <h2 className="guide_h2" id="phrase">Phrase Requests Examples</h2>
        <p>
          A request for one or more search phrases.  These can be single words, groups of related words, or sentences up to 255 characters in length.  You can drag and drop a text file on to the page, or paste them into the text box.
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
        <h2 className="guide_h2">Before Making a Request</h2>
        <p>When making a request please check the following.</p>

        <h4 className="guide_h4">Bar Code or SKU Requests</h4>
        <p>
          These requests are designed to link the product bar code or sku with Google Shoppings product_id.  It is this id that is then used for any further requests for that products price data.
        </p>
        <h4 className="guide_h4">Considerations</h4>
        <ul>
          <li>Is the bar code correct? - If you can cross reference the source to confirm its accuracy</li>
          <li>Do we have the item in stock? - To price check out of stock items can prove wasteful, especially if we cannot get the product in the future.</li>
          <li>Do we sell it online? - Online prices can be helpful when deciding on a bricks and mortor price point, but should be focused.</li>
          <li>Whats the margin? - If we are selling the item for the lowest possible price and its not selling then should it be checked?</li>
          <li>And the inverse - Check Fast Moving Lines. If we are the cheapest, can we raise the price?  Whats the current profit margin?</li>
          <li>I am sure you can think of some more.  But please keep in mind that reviewing the generated data will take time (your time) and there is a small cost to JTF for every request.</li>
        </ul>
        <h4 className="guide_h4">Phrase Search Word Requests</h4>
        <p>
          These requests can be used to asses the viability of a potential marketplace.  By searching for a brand or product name or model number a better understanding of the current market place can be formed.
          You can also used this type of request for any key phrases that you think may hold value.  These could highlight products or ranges that JTF are not aware of.  You can request the reports that are generated on completion in the
          same way as if you had made a request containing product bar codes or sku.  The data returned will refer to multiple products so it is advised to first download and review a 'Full report' of the requested data before
          any conclusions are drawn, as the report will show each return item individually that has been found for each request item.
        </p>
        <h4 className="guide_h4">Considerations</h4>
        <ul>
          <li>The potential range of results returned</li>
          <li>How targeted is the word or phrase? Will the results have any value?</li>
          <li>Remember typos and abbreviations when deciding on a request phrase</li>
          <li>Try and limit the number of request each time, and refine any searches to try and focus the returned dataset.<br />You can make exception when requesting a new product range using there titles as each result should already
           be relatively narrow in the products it returns.</li>
        </ul>
        <h2 className="guide_h2">Including Extra Information With A Request</h2>
        <p>Required information
          <br />When submitting a request you are required to add the following information.  This helps the platform monitor and retrieve requests.
          <ul>
            <li>JTF Email address<br />Once the request has been completed an email will be sent to this address.  If you have selected any reports they will be attached.</li>
            <li>Request information<br />This must be in the correct format or you will receive a fail request notice.</li>
            <li>Group</li>
          </ul>
          <p>You also have the option to set the following information with the request.</p>
          <ul>
            <li>Title</li>
          </ul>
        </p>
      </div>
    );
  }
}