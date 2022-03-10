import { BrowserRouter, Route, Link } from "react-router-dom";
import { Registration } from "./registration";
import Login from "./login";
export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <h1>Come register over here!</h1>
                <Route exact path="/">
                    <Registration></Registration>
                </Route>
                <Route path="/login">
                    <h1>Come login over here!</h1>
                    <Login />
                </Route>
            </BrowserRouter>
        </>
    );
}
