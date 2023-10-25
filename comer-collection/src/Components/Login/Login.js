import { Component } from "react";
import { withRouter } from "react-router-dom/cjs/react-router-dom";

import "./LoginForm.css";

class Login extends Component {
    push = () => {
        this.props.history.push("/login");
    }

    
    handleSubmit = () => {
    // Perform any submission logic here, e.g., sending the email list to a server.
    // You can access the email list in this.state.emailList.
    };

    
    handleChange = () => {
    // Perform any submission logic here, e.g., sending the email list to a server.
    // You can access the email list in this.state.emailList.
    };

    render () {
         // TODO: Fix value field
        return (
            <div className="loginForm">
                <form onSubmit={this.handleSubmit}>
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={undefined}
                        onChange={this.handleChange}
                    />
                </form>
            </div>
        )
    }
}




export default withRouter(Login);