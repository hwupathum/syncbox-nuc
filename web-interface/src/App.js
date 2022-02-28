import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PrivateRoute from "./auth/PrivateRoute";
import axios from "axios";
import useToken from "./auth/Token";
import DashboardPage from "./dashboard/DashboardPage";
import ResponsiveAppBar from "./ResponsiveAppBar";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import AuthPage from "./auth/AuthPage";
import SchedulesPage from "./dashboard/SchedulesPage";

const theme = createTheme({
  palette: {
    primary: {
      // Purple and green play nicely together.
      main: "#1a237e",
    },
    secondary: {
      // This is green.A700 as hex.
      main: "#000",
    },
    info: {
      main: "#fff"
    }
  },
});

export const base_url = "http://192.168.1.2:1905/api";

export default function App() {
  axios.defaults.withCredentials = true;
  const { token, saveToken, deleteToken } = useToken();

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <ResponsiveAppBar token={token} deleteToken={deleteToken} />
        <Switch>
          {!token && (
            <Router path="/">
              <AuthPage setToken={saveToken} />
            </Router>
          )}
          <PrivateRoute path="/data/*">
            <DashboardPage />
          </PrivateRoute>
          <PrivateRoute path="/schedules">
            <SchedulesPage />
          </PrivateRoute>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}
