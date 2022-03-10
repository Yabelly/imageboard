import { Component } from "react";
import { Link } from "react-router-dom";
export default class Login extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.inputInfo = this.inputInfo.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    componentDidMount() {
        console.log("Login mounted");
    }
    inputInfo({ target }) {
        // console.log("this: ", this);
        // console.log("target: ", target);
        // console.log("updated inputfield: ", target.name);
        // console.log("user changed update: ", target.value);
        //this func takes an object containging state update that we want to run an optional 2nd arg that is a callback func
        this.setState(
            {
                [target.name]: target.value,
            },
            () => {
                console.log("updated state", this.state);
            }
        );
    }
    handleLogin(e) {
        console.log("user clicked login button");
        e.preventDefault();
        // console.log("this.state: ", this.state);
        fetch("/login.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp.success == true) {
                    location.reload();
                } else {
                    this.setState({ error: "misspelled or something" });
                }
            })
            .catch((err) => {
                console.log("error in POST login.json", err);
                this.setState({ error: "misspelled or something" });
            });
    }
    render() {
        return (
            <>
                <h1>login</h1>

                {this.state.error && (
                    <h2 style={{ color: "red" }}>
                        Something went wrong: {this.state.error}
                    </h2>
                )}
                <form>
                    <input
                        name="email"
                        type="email"
                        placeholder="email"
                        onChange={this.inputInfo}
                    ></input>
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={this.inputInfo}
                    ></input>
                    <button
                        onClick={(e) => {
                            this.handleLogin(e);
                        }}
                    ></button>
                </form>
                <h2>
                    need to register? <Link to="/">click here!</Link>
                </h2>
                <h2>
                    forgot password? <Link to="/reset">click here!</Link>
                </h2>
            </>
        );
    }
}
