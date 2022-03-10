import { Component } from "react";
import { Link } from "react-router-dom";
export class Registration extends Component {
    constructor() {
        super();
        this.state = {
            error: "",
        };
        this.inputUpdate = this.inputUpdate.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }
    componentDidMount() {
        console.log("registration is mounted");
    }

    inputUpdate({ target }) {
        // console.log("this: ", this);
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
    handleSubmit(e) {
        // console.log("user clicked button");
        e.preventDefault();
        // console.log("this.state: ", this.state);
        fetch("/registration.json", {
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
                    this.setState({ error: "oooohhh shittttt wrong info" });
                }
            })
            .catch((err) => {
                console.log("error occured POST registration.json: ", err);
                this.setState({ error: "unsuccesfull retrieving data" });
            });
    }
    render() {
        return (
            <>
                <h1>Registration</h1>
                {this.state.error && (
                    <h2 style={{ color: "red" }}>
                        Something went wrong: {this.state.error}
                    </h2>
                )}
                <form>
                    <input
                        name="first"
                        type="text"
                        placeholder="first"
                        onChange={this.inputUpdate}
                    ></input>
                    <input
                        name="last"
                        type="text"
                        placeholder="last"
                        onChange={this.inputUpdate}
                    ></input>
                    <input
                        name="email"
                        type="email"
                        placeholder="email"
                        onChange={this.inputUpdate}
                    ></input>
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                        onChange={this.inputUpdate}
                    ></input>
                    <button
                        onClick={(e) => {
                            this.handleSubmit(e);
                        }}
                    >
                        Register
                    </button>
                </form>
                <h2>
                    already registered?<Link to="/login"> login here</Link>
                </h2>
            </>
        );
    }
}
