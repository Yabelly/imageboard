import { Component } from "react";
import { Link } from "react-router-dom";
export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 1,
            error: "",
        };
        this.inputInfo = this.inputInfo.bind(this);
        this.handleReset = this.handleReset.bind(this);
        this.resetCode = this.resetCode.bind(this);
    }
    inputInfo({ target }) {
        this.setState(
            {
                [target.name]: target.value,
            },
            () => {
                console.log("updated state", this.state);
            }
        );
    }
    handleReset(e) {
        e.preventDefault();
        fetch("/password/reset/start", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp.success == true) {
                    this.setState({ view: 2 });
                } else if (resp.success == false) {
                    this.setState({ error: "try again" });
                } else {
                    this.setState({
                        error: "something is wrong, not your fault: try again.",
                    });
                }
            });
    }
    resetCode(e) {
        e.preventDefault();
        console.log("e view 2: ", e);
        console.log("this.state view 2: ", this.state);
        fetch("/password/reset/verify", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("resp: ", resp);
                if (resp.success == true) {
                    this.setState({ view: 3 });
                } else if (resp.success == false) {
                    this.setState({
                        error: "password change failed, try again",
                    });
                } else {
                    this.setState({
                        error: "something is weird, not your fault but try again",
                    });
                }
            });
    }
    determineViewToRender() {
        if (this.state.view == 1) {
            return (
                <div>
                    <form>
                        <label htmlFor="email"> Enter email adress </label>
                        {this.state.error && (
                            <h2 style={{ color: "red" }}>
                                Something went wrong: {this.state.error}
                            </h2>
                        )}

                        <input
                            name="email"
                            type="email"
                            placeholder="email"
                            onChange={this.inputInfo}
                        ></input>

                        <button
                            onClick={(e) => {
                                this.handleReset(e);
                            }}
                        >
                            submit
                        </button>
                    </form>
                    <h1></h1>
                </div>
            );
        } else if (this.state.view == 2) {
            return (
                <form>
                    <label htmlFor="resetcode"> Enter reset code </label>
                    {this.state.error && (
                        <h2 style={{ color: "red" }}>
                            Something went wrong: {this.state.error}
                        </h2>
                    )}
                    <input
                        name="code"
                        type="text"
                        placeholder="code"
                        onChange={this.inputInfo}
                    ></input>
                    <label htmlFor="password"> Enter new password </label>
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={this.inputInfo}
                    ></input>
                    <button
                        onClick={(e) => {
                            this.resetCode(e);
                        }}
                    >
                        submit
                    </button>
                </form>
            );
        } else if (this.state.view === 3) {
            return (
                <h2>
                    Password is reset! Go back to <Link to="/login">login</Link>{" "}
                </h2>
            );
        }
    }
    render() {
        return (
            <>
                <h1>Reset your password here! </h1>
                <div>{this.determineViewToRender()}</div>
            </>
        );
    }
}
