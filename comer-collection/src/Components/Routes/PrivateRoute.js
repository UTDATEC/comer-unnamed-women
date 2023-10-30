import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom/cjs/react-router-dom.min";

export const PrivateRoute = (props) => {
    const currentUser = null;

    if(!currentUser) {
        return <Redirect to="/notloggedin" />
    }
    return <Route {...props} />
}