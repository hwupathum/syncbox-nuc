import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import axios from "axios";
import useToken from "./auth/Token";
import DashboardPage from "./dashboard/DashboardPage";
import ResponsiveAppBar from "./ResponsiveAppBar";
import LandingPage from "./dashboard/LandingPage";

export const base_url = "http://localhost:1905/api";

export default function App() {
  axios.defaults.withCredentials = true;
  const { token, saveToken, deleteToken } = useToken();

  return (
    <Router>
      <div>
      <ResponsiveAppBar token={token} deleteToken={deleteToken} />
        <Switch>
          <Route exact path="/"><LandingPage setToken={saveToken} /></Route>
          <PrivateRoute path="/data/*"><DashboardPage /></PrivateRoute>
        </Switch>
      </div>
    </Router>
  );
}
