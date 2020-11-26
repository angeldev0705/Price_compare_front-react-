/*jshint esversion: 6 */
import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./containers/Home";
import Phrase from "./containers/Phrase";
import Browse from "./containers/Browse";
import Schedule from "./containers/Schedule";
import InProgress from "./containers/InProgress";
import Reports from "./containers/Reports";
import Product from "./containers/Product";
import Search from "./containers/Search";
import GuideReports from "./containers/Guide/GuideReports";
import GuideRequests from "./containers/Guide/GuideRequests";
import GuideContact from "./containers/Guide/GuideContact";
import GuideProgress from "./containers/Guide/GuideProgress";
import GuideLearnMore from "./containers/Guide/GuideLearnMore";
import GuideHomeReports from "./containers/Guide/GuideHomeReports";
import GuidePhraseProducts from "./containers/Guide/GuidePhraseProducts";
import GuideHomeProducts from "./containers/Guide/GuideHomeProducts";
import GuideIntroduction from "./containers/Guide/GuideIntroduction";
import GuideSchedule from "./containers/Guide/GuideSchedule";
import NotFound from "./containers/NotFound";
import AppliedRoute from "./components/AppliedRoute";

export default ({ childProps }) =>
  <Switch>
    <AppliedRoute path="/" exact component={Home} props={childProps} />
    <AppliedRoute path="/phrase" exact component={Phrase} props={childProps} />
    <AppliedRoute path="/browse" exact component={Browse} props={childProps} />
    <AppliedRoute path="/progress" exact component={InProgress} props={childProps} />
    <AppliedRoute path="/reports" exact component={Reports} props={childProps} />
    <AppliedRoute path="/search" exact component={Search} props={childProps} />
    <AppliedRoute path="/schedule" exact component={Schedule} props={childProps} />
    <AppliedRoute path="/product" exact component={Product} props={childProps} />
    <AppliedRoute path="/schedule" exact component={Schedule} props={childProps} />
    <AppliedRoute path="/guide/introduction" exact component={GuideIntroduction} props={childProps} />
    <AppliedRoute path="/guide/learn" exact component={GuideLearnMore} props={childProps} />
    <AppliedRoute path="/guide/contact" exact component={GuideContact} props={childProps} />
    <AppliedRoute path="/guide/requests" exact component={GuideRequests} props={childProps} />
    <AppliedRoute path="/guide/progress" exact component={GuideProgress} props={childProps} />
    <AppliedRoute path="/guide/schedule" exact component={GuideSchedule} props={childProps} />
    <AppliedRoute path="/guide/home/reports" exact component={GuideHomeReports} props={childProps} />
    <AppliedRoute path="/guide/home/phrase" exact component={GuidePhraseProducts} props={childProps} />
    <AppliedRoute path="/guide/home/products" exact component={GuideHomeProducts} props={childProps} />
    <AppliedRoute path="/guide/reports" exact component={GuideReports} props={childProps} />
    { /* Finally, catch all unmatched routes */ }
    <Route component={NotFound} />
  </Switch>;