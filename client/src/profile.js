import { Component } from "react";
import { ProfilePic } from "./profile_pic.js";
import { BioEditor } from "./bioeditor";
export class Profile extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        console.log("props: ", this.props);
        return (
            <>
                <div id="username">
                    <h1>
                        {this.props.firstName}
                        {this.props.lastName}
                    </h1>
                </div>
                <ProfilePic
                    url={this.props.url}
                    firstName={this.props.firstName}
                    lastName={this.props.lastName}
                    showUploader={this.props.showUploader}
                />

                <BioEditor
                    bio={this.props.bio}
                    setBio={this.props.setBio}
                ></BioEditor>
            </>
        );
    }
}
