//===================import and setup=======================
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cookieSession = require("cookie-session");
const { hash, compare } = require("./bc");
const db = require("../database/db");
const cryptoRandomString = require("crypto-random-string");
const ses = require("./ses");

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
app.use(
    cookieSession({
        secret: `ultra extreme secure thing`,
        maxAge: 1000 * 60 * 60 * 24 * 14,
        sameSite: true,
    })
);
app.use(express.json());

// // app.use((req, res, next) => {
// //     console.log("req.url: ", req.url);
// //     console.log("req.session: ", req.session);
// //     next();
// });
//===================import and setup=======================

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});
app.get("/user", function (req, res) {
    console.log("GET request /user");
    console.log("req.session: ", req.session);
    const { userId } = req.session;
    db.getUserInfo(userId).then(({ rows }) => {
        console.log("rows: ", rows[0]);
        res.json(rows[0]);
    });
});

app.post("/registration.json", (req, res) => {
    console.log("POST request /registration");
    console.log("req.body: ", req.body);
    const { first, last, email, password } = req.body;

    hash(password).then((hashedPassword) => {
        db.registration(first, last, email, hashedPassword)
            .then(({ rows }) => {
                req.session.userId = rows[0].id;
                res.json({ success: true });
            })
            .catch((err) => {
                console.log("error in retrieving db info: ", err);
                res.json({ success: false });
            });
    });
});

app.post("/password/reset/start", (req, res) => {
    console.log("POST request /reset/start");
    const { email } = req.body;
    db.verify(email)
        .then(({ rows }) => {
            if (rows[0].id) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                db.inputCode(email, secretCode).then(() => {
                    const message = `hey there, you asked to reset your password for this social network, here is the code you need: ${secretCode}. `;
                    const subject = `reset password`;
                    ses.sendEmail(email, message, subject);
                    res.json({ success: true });
                });
            }
        })
        .catch((err) => {
            console.log("user does not exist", err);
            res.json({ success: false });
        });
});

app.post("/password/reset/verify", (req, res) => {
    console.log("POST request /reset/verify", req.body);
    const { code, password, email } = req.body;
    db.getResetCode(email)
        .then(({ rows }) => {
            console.log("rows: ", code, rows);
            if (code === rows[0].code) {
                console.log(" it's a match");
                hash(password)
                    .then((hashedPassword) => {
                        db.changePassword(hashedPassword, email).then(() => {
                            res.json({ success: true });
                        });
                    })
                    .catch((err) => {
                        console.log("fail 4", err);
                        res.json({ success: false });
                    });
            } else {
                console.log("fail on else 3");
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("fail 2", err);
            res.json({ success: false });
        });
});

app.post("/login.json", (req, res) => {
    const { email, password } = req.body;
    console.log("POST request /login, req.body.email; ", email);
    db.getLoginInfo(email)
        .then((val) => {
            console.log("val: ", val);
            compare(password, val.rows[0].password)
                .then((match) => {
                    if (match) {
                        req.session.userId = val.rows[0].id;
                        res.json({ success: true });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((err) => {
                    "error occured comparing passwords: ", err;
                });
        })
        .catch((err) => {
            "error occured getting email from db: ", err;
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
