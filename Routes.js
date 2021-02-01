import React from "react";
import { Router, Route } from "react-router-dom";
import { createBrowserHistory } from "history";

import "bootstrap/dist/js/bootstrap.min.js";
import { NotificationContainer } from "react-notifications";

import AuthenticatedApp from "./authenticate/AuthenticatedApp";

import Login from "./components/loginComponent/Login";
import Register from "./components/registerComponent/Register";
import Profile from "./components/profileComponent/Profile";
import TMSTab from "./components/tmsComponent/TMSTab";
import AccommodationTab from "./components/accomodationComponent/AccommodationTab";
import ForgotPassword from "./components/resetPassword/ForgotPassword";
import ResetPassword from "./components/resetPassword/ResetPassword";
import UpdatePassword from "./components/resetPassword/UpdatePassword";
import Client from "./components/clientComponent/Client";
import ClientList from "./components/clientComponent/ClientList";
import ClientEdit from "./components/clientComponent/ClientEdit";
import Project from "./components/projectComponent/Project";
import ProjectList from "./components/projectComponent/ProjectList";
import ProjectEdit from "./components/projectComponent/ProjectEdit";
import User from "./components/userComponent/User";
import UserList from "./components/userComponent/UserList";
import UserEdit from "./components/userComponent/UserEdit";
import Holiday from "./components/holidayComponent/Holiday";
import HolidayList from "./components/holidayComponent/HolidayList";
import HolidayEdit from "./components/holidayComponent/HolidayEdit";

const browserHistory = createBrowserHistory();

const Routes = () => (
  <div>
    <Router history={browserHistory}>
      <Route name="login" path="/login" component={Login} />
      <Route name="register" path="/register" component={Register} />
      <Route
        exact
        path="/forgotPassword/reset/:token"
        component={ResetPassword}
      />
      <Route exact path="/forgotPassword" component={ForgotPassword} />
      <Route
        exact
        path="/updatePassword/:username"
        component={UpdatePassword}
      />
      <Route component={AuthenticatedApp} />
      <Route name="tms_tab" path="/tms" component={TMSTab} />
      <Route
        name="accommodation_tab"
        path="/accommodation"
        component={AccommodationTab}
      />
      <Route name="client_tab" path="/client" component={Client} />
      <Route name="clientlist_tab" path="/clientlist" component={ClientList} />
      <Route
        name="clientedit_tab"
        path="/clientedit/:id"
        component={ClientEdit}
      />
      <Route name="project_tab" path="/project" component={Project} />
      <Route
        name="projectlist_tab"
        path="/projectlist"
        component={ProjectList}
      />
      <Route
        name="projectedit_tab"
        path="/projectedit/:id"
        component={ProjectEdit}
      />
      <Route name="user_tab" path="/user" component={User} />
      <Route name="userlist_tab" path="/userlist" component={UserList} />
      <Route name="useredit_tab" path="/useredit/:id" component={UserEdit} />
      <Route name="holiday_tab" path="/holiday" component={Holiday} />
      <Route
        name="holidaylist_tab"
        path="/holidaylist"
        component={HolidayList}
      />
      <Route
        name="holidayedit_tab"
        path="/holidayedit/:id"
        component={HolidayEdit}
      />
      <Route name="profile" path="/profile" component={Profile} />
    </Router>
    <NotificationContainer />
  </div>
);

export default Routes;
