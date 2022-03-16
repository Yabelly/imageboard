import { Component } from "react";
export class BioEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            draftBio: "",
            bio: "",
        };
        this.addBio = this.addBio.bind(this);
        this.inputUpdate = this.inputUpdate.bind(this);
    }

    inputUpdate({ target }) {
        this.setState(
            {
                draftBio: target.value,
            },
            () => {
                console.log("updated state: ", this.state);
            }
        );
    }
    addBio() {
        this.setState({ editMode: true });
    }

    handleSubmit(e) {
        e.preventDefault();
        console.log("this.state: ", this.state);
        fetch("/draftbio.json", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(this.state),
        })
            .then((resp) => resp.json())
            .then((resp) => {
                if (resp) {
                    this.setState({ editMode: false });
                    this.props.setBio(resp);
                }
            });
    }
    render() {
        console.log("props bioeditor: ", this.props);
        return (
            <>
                {this.state.editMode && (
                    <div>
                        <textarea
                            defaultValue={this.props.bio}
                            onChange={this.inputUpdate}
                        ></textarea>
                        <button
                            onClick={(e) => {
                                this.handleSubmit(e);
                            }}
                        >
                            save
                        </button>
                    </div>
                )}
                {!this.state.editMode && this.props.bio && (
                    <div>
                        {this.props.bio}
                        <button onClick={this.addBio}>edit</button>
                    </div>
                )}
                {!this.state.editMode && !this.props.bio && (
                    <div>
                        No available bio, do you want to add this?
                        <button onClick={this.addBio}>Add</button>
                    </div>
                )}
            </>
        );
    }
}
