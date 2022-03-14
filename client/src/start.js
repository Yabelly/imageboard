import ReactDOM from "react-dom";
import Welcome from "./welcome";
import { App } from "./app";
ReactDOM.render(<Welcome />, document.querySelector("main"));

fetch("/user/id.json")
    .then((response) => response.json())
    .then((data) => {
        if (!data.userId) {
            ReactDOM.render(<Welcome />, document.querySelector("main"));
        } else {
            ReactDOM.render(
                <App />,

                document.querySelector("main")
            );
        }
    });
