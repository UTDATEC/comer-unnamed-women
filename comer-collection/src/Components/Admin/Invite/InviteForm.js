import React, { Component } from 'react';
import "./InviteForm.css"; // Import CSS styles


class InviteForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      emailList: [],
    };
  }

  handleEmailChange = (e) => {
    this.setState({ email: e.target.value });
  };

  handleAddEmail = () => {
    const { email, emailList } = this.state;
    if (email.trim() && !emailList.includes(email)) {
      this.setState({
        email: '',
        emailList: [...emailList, email + '@utdallas.edu'],
      });
    }
  };

  handleClearInput = () => {
    this.setState({ emailList: [] }); // Clear emailList
  };

  handleEnterKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleAddEmail();
    }
  };

  handleSubmit = () => {
    // Perform any submission logic here, e.g., sending the email list to a server.
    // You can access the email list in this.state.emailList.
  };

  render() {
    const { email, emailList } = this.state;

    return (
      <div className="containerInvite">

        <div className="invite-form">
          <h1>Invite Form</h1>
          
          <div className="form-group">
            <label>
              Instructions: <br></br>
              Input NetID and press <strong>Enter</strong> or <strong>Add Email</strong> to add <br></br>
              Click <strong>Invite</strong> after finishing adding.
            </label>
            <div>
              <input
                type="text"
                value={email}
                onChange={this.handleEmailChange}
                onKeyPress={this.handleEnterKeyPress}
                required
              />
            </div>

          </div>

          <div className="form-group center-button">
            <button className="green-button rounded-button" onClick={this.handleAddEmail}>Add Email</button>
            <button className="red-button rounded-button" onClick={this.handleClearInput}>Clear</button>
          </div>

          <div className="form-group">
            <div>
              <label>Email Addresses with @utdallas.edu</label>
            </div>
            <textarea
              value={emailList.join('\n')}
              rows="5"
              disabled
            />
          </div>

          <div className="form-group center-button">
            <button className="green-button rounded-button" onClick={this.handleSubmit}>Invite</button>
          </div>
        </div>
      </div>
    );
  }
}

export default InviteForm;
