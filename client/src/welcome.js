import { BrowserRouter, Route } from "react-router-dom";
import { Registration } from "./registration";
import ResetPassword from "./resetPW";
import Login from "./login";
export default function Welcome() {
    return (
        <>
            <BrowserRouter>
                <h1>Welcom to this medium level social network</h1>
                <Route exact path="/">
                    <Registration></Registration>
                </Route>

                <Route path="/login">
                    <Login />
                </Route>

                <Route path="/reset">
                    <ResetPassword></ResetPassword>
                </Route>
            </BrowserRouter>
        </>
    );
}
