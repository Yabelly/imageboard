import { Component } from "react";
import { ProfilePic } from "./profile_pic.js";
import Logo from "./logo.js";
import { Uploader } from "./uploader.js";

export class App extends Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            profilePic: undefined,
            uploaderVisible: false,
        };

        // If you don't bind your methods, make sure you use arrow functions
        // when passing them over to other components to preserve your context
        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);
    }

    componentDidMount() {
        console.log("app.js is mounted");

        fetch("/user")
            .then((res) => res.json())
            .then((userData) => {
                console.log("userData: ", userData);
                const { id, first, last, email, profilePic } = userData;
                console.log("id: ", id);
                console.log("profilePic: ", profilePic);
                this.setState({
                    firstName: first,
                    lastName: last,
                    email: email,
                    profilePic: profilePic,
                });
            });
    }

    showUploader() {
        console.log("showuploader set to true");
        this.setState({ uploaderVisible: true });
    }
    hideUploader() {
        // ...
    }
    // You could make a toggleUploader method that handles both hiding
    // and showing

    updateProfilePic(newProfilePicUrl) {
        this.setState({ profilePic: newProfilePicUrl });
        // ...
    }

    render() {
        return (
            <div id={"app"}>
                <Logo />
                <ProfilePic
                    url={this.state.profilePic}
                    firstName={this.state.firstName}
                    lastName={this.state.lastName}
                    showUploader={this.showUploader}
                />
                {this.state.uploaderVisible && (
                    <Uploader
                        hideUploader={this.hideUploader}
                        updateProfilePic={this.updateProfilePic}
                    />
                )}
            </div>
        );
    }
}
