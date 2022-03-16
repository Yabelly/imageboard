import { Component } from "react";
import { ProfilePic } from "./profile_pic.js";
import Logo from "./logo.js";
import { Uploader } from "./uploader.js";
import { Profile } from "./profile.js";

export class App extends Component {
    constructor() {
        super();

        this.state = {
            firstName: "",
            lastName: "",
            email: "",
            profilePic: undefined,
            uploaderVisible: false,
            bio: "",
        };

        this.showUploader = this.showUploader.bind(this);
        this.hideUploader = this.hideUploader.bind(this);
        this.updateProfilePic = this.updateProfilePic.bind(this);
        this.setBio = this.setBio.bind(this);
    }

    componentDidMount() {
        console.log("app.js is mounted");

        fetch("/user")
            .then((res) => res.json())
            .then((userData) => {
                console.log("userData: ", userData);
                const { id, first, last, email, profile_pic, bio } = userData;
                console.log("id: ", id);
                
                this.setState({
                    firstName: first,
                    lastName: last,
                    email: email,
                    profilePic: profile_pic,
                    bio: bio,
                });
            });
    }

    showUploader() {
        this.setState({ uploaderVisible: true });
    }
    hideUploader() {
        this.setState({ uploaderVisible: false });
    }

    updateProfilePic(newProfilePicUrl) {
        this.setState({ profilePic: newProfilePicUrl });
    }
    setBio(newBio) {
        console.log("setBio method activated");
        this.setState({ bio: newBio });
    }
    render() {
        return (
            <div id="app">
                <header>
                    <Logo id="logo" />

                    <h1>Non-style Social Network </h1>

                    <ProfilePic
                        id="header-image"
                        url={this.state.profilePic}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                    />
                </header>
                <div className="profile-area">
                    {this.state.uploaderVisible && (
                        <Uploader
                            hideUploader={this.hideUploader}
                            updateProfilePic={this.updateProfilePic}
                        />
                    )}
                    <Profile
                        url={this.state.profilePic}
                        firstName={this.state.firstName}
                        lastName={this.state.lastName}
                        showUploader={this.showUploader}
                        bio={this.state.bio}
                        setBio={this.setBio}
                    ></Profile>
                </div>
            </div>
        );
    }
}
