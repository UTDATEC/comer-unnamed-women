class Login extends Component {
    push = () => {
        this.props.history.push("/login");
    }

    render () {
        return (
            <div className="loginForm">
                <form onSubmit={handleSubmit}>
                    <label>Email</label>
                    <input
                        type="text"
                        name="email"
                        value={form.email}
                        onchange={handleChange}
                    />
                </form>
            </div>
        )
    }
}




export default withRouter(Login);