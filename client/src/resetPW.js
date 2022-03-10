import { Component } from "react";
import { Link } from "react-router-dom";
export default class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            view: 1,
        };
        this.inputInfo = this.inputInfo.bind(this);
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
        console.log("e: ", e);
        console.log("this.state.view: ", this.state.view);
        e.preventDefault();
        fetch(
            "/password/reset/start",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(this.state),
            }
                .then((resp) => resp.json())
                .then((resp) => {
                    if (resp.success == true) {
                        console.log("succes on fetch ");
                    } else {
                        console.log("fetch unsuccesfull");
                    }
                })
        );
    }
    determineViewToRender() {
        if (this.state.view == 1) {
            return (
                <div>
                    <form>
                        <label htmlFor="email"> Enter email adress </label>
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
                    <input
                        name="code"
                        type="text"
                        placefolder="code"
                        onChange={this.inputInfo}
                    ></input>
                    <label htmlFor="password"> Enter new password </label>
                    <input
                        name="password"
                        type="password"
                        placeholder="password"
                    ></input>
                    <button
                        onClick={(e) => {
                            this.handleReset(e);
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
