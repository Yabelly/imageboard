import { Component } from "react";
import { ProfilePic } from "./profile-pic.js";
import { Logo } from "./logo.js";

export class App extends Component {
    componentDidMount() {
        fetch("/user").then((res)=> {
            res.json())
        } // set this up still
    }
    render() {
        return (
            <div>
                App
                <Logo></Logo>
                <ProfilePic></ProfilePic>
            </div>
        );
    }
}
