import { Route, Navigate } from "react-router-dom";

export const PrivateRoute = (props) => {
    const currentUser = null;

    if(!currentUser) {
        return <Navigate to="/notloggedin" replace state={state} />
    }
    return <Route {...props} />
}