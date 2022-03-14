// import { Component } from "react";

// export class Uploader extends Component {
//     handleChange(e) {
//         this.setState({
//             [e.target.name]: e.target.files[0],
//         });
//     }
//     handleSubmit() {
//         // 1. Prevent the default behavior
//         // 2. Create a new form data instance
//         // 3. Append your file to it (use the value you stored int the state)
//         // 4. Send data over to the server with a fetch request
//         // 5. If the request is successful update the profilePic
//         // property form the state of App (use the updateProfilePic method)
//     }

//     render() {
//         return (
//             <div id={"uploader"}>
//                 <form onSubmit={this.handleSubmit}>
//                     <input
//                         name="profilePic"
//                         type={"file"}
//                         onChange={this.handleChange}
//                     />
//                     <button>Upload</button>
//                 </form>
//             </div>
//         );
//     }
// }
