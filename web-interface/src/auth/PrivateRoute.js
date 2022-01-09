import { Redirect, Route } from "react-router-dom";
import useToken from "./Token";

export default function PrivateRoute({ children, ...rest }) {
    const { token } = useToken();
    return (
        <Route {...rest} render={({ location }) => token ? (children) : (<Redirect to={{ pathname: "/login", state: { from: location } }} />)} />
    );
}
