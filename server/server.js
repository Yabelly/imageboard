//===================import and setup=======================
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash } = require("./bc");
const db = require("../database/db");

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    cookieSession({
        secret: `ultra extreme secure thing`,
        maxAge: 1000 * 60,
        sameSite: true,
    })
);
app.use(express.json());
// app.use((req, res, next) => {
//     console.log("req.url: ", req.url);
//     console.log("req.session: ", req.session);
//     next();
// });
//===================import and setup=======================

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.post("/registration.json", (req, res) => {
    console.log("POST request /registration");
    const { first, last, email, password } = req.body;

    hash(password).then((hashedPassword) => {
        db.registration(first, last, email, hashedPassword)
            .then(({ rows }) => {
                req.session.userId = rows[0].id;
                res.json({ success: true });
            })
            .catch((err) => {
                "error in POST /registration.json:  ", err;
                res.json({ success: false });
            });
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
