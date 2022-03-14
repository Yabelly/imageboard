import { Component } from "react";

export class Uploader extends Component {
    constructor() {
        super();
        this.state = {
            profilepicture: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.files[0],
        });
    }
    handleSubmit(e) {
        e.preventDefault();
        const fd = new FormData();
        console.log("what i do: ", this.state.profilepicture);
        fd.append("file", this.state.profilepicture);
        console.log("this: ", this);

        fetch("/upload", {
            method: "POST",
            body: fd,
        })
            .then((resp) => resp.json())
            .then((resp) => {
                console.log("resp from upload: ", resp);
            });
        // 2. Create a new form data instance
        // 3. Append your file to it (use the value you stored int the state)
        // 4. Send data over to the server with a fetch request
        // 5. If the request is successful update the profilePic
        // property form the state of App (use the updateProfilePic method)
    }

    render() {
        return (
            <div id={"uploader"}>
                <form onSubmit={this.handleSubmit}>
                    <input
                        name="profilePic"
                        type={"file"}
                        accept="image/*"
                        onChange={this.handleChange}
                    />
                    <button>Upload</button>
                </form>
            </div>
        );
    }
}
