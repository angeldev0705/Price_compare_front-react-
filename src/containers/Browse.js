
import React, { Component } from "react";
import DatePicker from "react-datepicker";
// eslint-disable-next-line
import LoaderButton from "../components/LoaderButton";
import { Table, Container, Pagination, ButtonToolbar, Dropdown, DropdownButton, Button } from "react-bootstrap";
import "./css/Browse.css";
import "react-datepicker/dist/react-datepicker.css"

export default class Browse extends Component {

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      page: 1,
      pagesize: 20,
      prices: [],
      category: null,
      date: null,
      show: false,
    };

  }

  async componentDidMount() {
    // try {
    //   const prices = await this.prices(this.state.page, this.state.pagesize);
    //   this.setState({ prices });
    // } catch (e) {
    //   alert(e);
    // }
    this.setState({ isLoading: false });
  }

  async prices(page, pagesize) {
    var category = this.state.category === null ? "all" : this.state.category;
    console.log()
    if (this.props.getOnlyAlarm) {
      category = category + "$"
    }
    var date = this.state.date === null ? "all" : this.state.date.toLocaleDateString("en-GB").split("/").reverse().join("-");
    const api_endpoint = "/prices/" + category + "/" + pagesize + "/" + (((page - 1) * pagesize)) + "/" + date;
    return await fetch('http://127.0.0.1:8000/products' + api_endpoint, {
      method: 'GET'
    }).then(response => response.text())
    .then((body) => {
      return body;
    });
  }

  renderPricesList(prices) {
    return [{}].concat(prices.data).map(
      (alarm, i) =>
        i !== 0
          ?
          <tr
            key={i} header={alarm.dvc + " :  " + alarm.hid}
            to={"#"}
            onClick={() => { this.setState({ selected: i - 1 }); this.setState({ show: true }); }}
            style={{ cursor: "pointer" }}>
            <td>{alarm.hid}</td>
            <td>{alarm.dvc}</td>
            <td>N/A</td>
            <td>{alarm.alm}<span key={(i + 'B')} dangerouslySetInnerHTML={{ __html: this.deviceUnit(alarm.dvc, alarm.hid) }} /></td>
            <td>{alarm.rdng}<span key={(i + 'B')} dangerouslySetInnerHTML={{ __html: this.deviceUnit(alarm.dvc, alarm.hid) }} /></td>
            <td>
              {new Date(alarm.tm).toLocaleString()}</td>
            <td>{alarm.ack ?
              <Container style={{ color: "black" }}>Complete</Container>
              :
              <Container style={{ color: "red" }}>Required</Container>}</td>
          </tr>
          : null
    );
  }

  renderPages() {
    const total_pages = ((this.state.prices.total - this.state.prices.total % this.state.pagesize) / this.state.pagesize) + 1
    const active = this.state.page;
    var spread = 5, lw_page_shift = 0, up_page_shift = 0;

    if (total_pages >= 10 && active <= 5) {
      lw_page_shift = 5 - active;
    } else if (total_pages >= 10 && active >= total_pages - 5) {
      up_page_shift = 5 - (total_pages - active);
    }
    const pagination_pages = [...Array(total_pages)].map(
      (number, i) =>
        active - spread - up_page_shift <= i + 1 && active + spread + lw_page_shift >= i + 1 ?
          <Pagination.Item key={i + 1} active={i + 1 === active} onClick={() => { this.getPrices(i + 1) }}>
            {i + 1}
          </Pagination.Item>
          : ""
    )
    const pagination = []
    pagination[0] = [];
    pagination[1] = [5, 10, 20, 50, 100].filter((element) => {
      if (element < this.state.prices.total) {
        return element;
      }
      return null;
    })

    if (total_pages === 1) return pagination;

    if (active > 1) {
      pagination[0].push(<Pagination.Item key={100} onClick={() => { this.getPrices(1) }}>
        ...
          </Pagination.Item>)
      pagination[0].push(<Pagination.Item key={101} onClick={() => { this.getPrices(active - 1) }}>
        ..
          </Pagination.Item>)
    }
    pagination[0] = pagination[0].concat(pagination_pages);
    if (active + 1 <= total_pages) {
      pagination[0].push(<Pagination.Item key={total_pages + 1} onClick={() => { this.getPrices(active + 1) }}>
        ..
          </Pagination.Item>)
      pagination[0].push(<Pagination.Item key={total_pages + 2} onClick={() => { this.getPrices(total_pages) }}>
        ...
          </Pagination.Item>)
    }


    return pagination;
  }

  renderCategorys() {
    if (this.state.prices.data !== undefined) {
      const categorys_ids = [].concat(this.state.prices.categorys).map((element) => {
        return element.hid
      })
      return [...new Set(categorys_ids)].map(
        (category, i) =>
          <Dropdown.Item key={"category_dd_" + i} eventKey={category}
            active={String(this.state.category) === String(category) ? true : false}
          >
            {category}
          </Dropdown.Item>
      );
    }
  }

  async getPrices(page) {
    return setTimeout(async () => {
      this.setState({ page })
      const prices = await this.prices(page, this.state.pagesize);
      this.setState({ prices });
    }, 300);
  }

  renderPageSize(pagesizes) {
    return pagesizes.map(
      (pagesize, i) =>
        <Dropdown.Item key={"page_dd_" + i} eventKey={pagesize}
          active={parseInt(this.state.pagesize) === parseInt(pagesize) ? true : false}
        >
          {pagesize}
        </Dropdown.Item>
    )
  }

  async handlePageSize(pagesize) {
    return setTimeout(Promise.all([this.setState({ page: 1 }), this.setState({ pagesize })]).then(() => {
      return this.getPrices(1);
    }).catch((err) => console.log(err)), 300);
  }

  async handleCategorySelect(category) {
    return setTimeout(Promise.all([this.setState({ page: 1 }), this.setState({ category })]).then(() => {
      return this.getPrices(1);
    }).catch((err) => console.log(err)), 300);
  }

  async handleDateSelect(date) {
    return setTimeout(Promise.all([this.setState({ page: 1 }), this.setState({ date })]).then(() => {
      return this.getPrices(1);
    }).catch((err) => console.log(err)), 300);
  }

  renderPrices() {
    if (this.state.prices.total !== undefined) {
      var pages = this.renderPages();
      var pagination = pages[0];
      var alarm_dates = [].concat(this.state.prices.dates).map((element) => {
        return new Date(element.dates);
      });
      var alarm_class = [{ "react-datepicker__day--highlighted-alarm": alarm_dates }];
      return (
        <Container style={{ margin: "0px", padding: "0px" }}>
          <Container className="pb-2 mt-4 mb-2 border-bottom">
            <span className={"alarm"}>Below are shown all prices that have been triggered.  Click on a row to see more details.</span>
          </Container>
          <Container className="pb-2 mt-4 mb-2 border-bottom">
            <ButtonToolbar style={{ marginBottom: "5px" }}>
              <DropdownButton
                title={"Page Size"}
                id={'dropdown-pagesize'}
                key={'page_dd'}
                onSelect={(event) => { this.handlePageSize(event) }}
                style={{ margin: "5px" }}
              >
                {this.renderPageSize(pages[1])}
              </DropdownButton>
              <DropdownButton
                title={"category"}
                id={'dropdown-pagesize'}
                key={'category_dd'}
                onSelect={(event) => { this.handleCategorySelect(event) }}
                style={{ margin: "5px" }}
              >
                <Dropdown.Item key={"category_dd_all"} eventKey={"all"}
                  active={this.state.category === null ? true : false}
                >
                  All categorys
        </Dropdown.Item>
                {this.renderCategorys()}
              </DropdownButton>
              <DropdownButton
                title={"Date Filter"}
                id={'dropdown-pagesize'}
                key={'date_dd'}
                style={{ margin: "5px" }}
              >
                <Dropdown.Item key={"date_dd_all"} eventKey={"all"}
                  onClick={() => { this.handleDateSelect(null) }}
                  active={this.state.date === null ? true : false}
                >
                  All Dates
        </Dropdown.Item>
                <Dropdown.Item key={"date_dd_dp"} bsPrefix={"none"}>
                  <Container className="datefit">
                    <DatePicker
                      onChange={(date) => { this.handleDateSelect(date) }}
                      inline
                      selected={this.state.date !== null ? this.state.date : null}
                      highlightDates={alarm_class}
                      includeDates={alarm_dates}
                      placeholderText="Date Filter" />
                  </Container>
                </Dropdown.Item>
              </DropdownButton>
              {this.props.getOnlyAlarm ?
                <Button style={{ margin: "5px" }} onClick={() => { this.props.setOnlyAlarm(false); this.getPrices(1) }}>Only Active</Button>
                :
                <Button style={{ margin: "5px" }} onClick={() => { this.props.setOnlyAlarm(true); this.getPrices(1) }}> Show All </Button>
              }
            </ButtonToolbar>
            <Pagination>{pagination}</Pagination>
            <Table bordered responsive>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>category</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{this.state.date === null ? "all" : this.state.date.toLocaleDateString("en-GB")}</td>
                  <td>{this.state.category === null ? "all" : this.state.category}</td>
                  <td>{this.state.prices.total}</td>
                </tr>
              </tbody>
            </Table>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>category</th>
                  <th>Device</th>
                  <th>Location</th>
                  <th>Trigger</th>
                  <th>Reading</th>
                  <th>Timestamp</th>
                  <th>Review</th>
                </tr>
              </thead>
              <tbody>
                {!this.state.isLoading && this.renderPricesList(this.state.prices)}
              </tbody>
            </Table>
            <Pagination>{pagination}</Pagination>
          </Container>
        </Container>
      );
    }
  }

  render() {
    return (
      <div className="prices">
        <h1 className="guide_h2">Browse. Under construction</h1>
        {this.renderPrices()}
      </div>
    );
  }
}
