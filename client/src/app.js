import { Component } from "react";
import { ProfilePic } from "./profile_pic.js";
import Logo from "./logo.js";
import { Uploader } from "./uploader.js";
import { Profile } from "./profile.js";
import { BrowserRouter, Route } from "react-router-dom";
import { FindPeople } from "./findpeople.js";
import { OtherProfile } from "./otherprofile.js";
import { Link } from "react-router-dom";
import { FriendsAndWannabees } from "./friendsandwannabees.js";
import Chat from "./chat.js";

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

        fetch("/api/user")
            .then((res) => res.json())
            .then((userData) => {
                const { first, last, email, profile_pic, bio } = userData;
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
        this.setState({ bio: newBio });
    }
    render() {
        return (
            <div id="app">
                <BrowserRouter>
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
                    <nav>
                        <h3>Go to</h3>
                        <Link to="/">home</Link>
                        <br></br>
                        <Link to="/users/">find users</Link>
                        <br></br>
                        <Link to="/friends-and-wannabees">
                            (soon to be) friends{" "}
                        </Link>
                        <br></br>
                        <Link to="/chatroom">chatroom</Link>
                    </nav>
                    <div className="profile-area">
                        {this.state.uploaderVisible && (
                            <Uploader
                                hideUploader={this.hideUploader}
                                updateProfilePic={this.updateProfilePic}
                            />
                        )}
                        <Route exact path="/friends-and-wannabees">
                            <FriendsAndWannabees></FriendsAndWannabees>
                        </Route>
                        <Route exact path="/">
                            <Profile
                                url={this.state.profilePic}
                                firstName={this.state.firstName}
                                lastName={this.state.lastName}
                                showUploader={this.showUploader}
                                bio={this.state.bio}
                                setBio={this.setBio}
                            ></Profile>
                        </Route>
                        <Route path="/users">
                            <FindPeople></FindPeople>
                        </Route>
                        <Route path="/user/:otherUserId">
                            <OtherProfile />
                        </Route>
                    </div>
                    <Route path="/chatroom">
                        <Chat></Chat>
                    </Route>
                </BrowserRouter>
            </div>
        );
    }
}
