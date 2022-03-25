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
const uidSafe = require("uid-safe");
const s3 = require("./s3");
const multer = require("multer");
const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, path.join(__dirname, "uploads"));
    },
    filename: function (req, file, callback) {
        uidSafe(24).then((uid) => {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2000000,
    },
});
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    allowRequest: (req, callback) =>
        callback(null, req.headers.referer.startsWith("http://localhost:3000")),
});

app.use(compression());
app.use(express.static(path.join(__dirname, "..", "client", "public")));
const cookieSessionMiddleware = cookieSession({
    secret: `ultra extreme secure thing`,
    maxAge: 1000 * 60 * 60 * 24 * 14,
    sameSite: true,
});
app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(express.json());

// // app.use((req, res, next) => {
// //     console.log("req.url: ", req.url);
// //     console.log("req.session: ", req.session);
// //     next();
// });
//===================import and setup=======================

app.get("/api/user", function (req, res) {
    console.log("GET request /api/user");
    const { userId } = req.session;
    db.getUserInfo(userId).then(({ rows }) => {
        res.json(rows[0]);
    });
});

app.get("/api/recentusers.json", (req, res) => {
    console.log("Get request /api/recentusers");
    db.findRecentUsers().then(({ rows }) => {
        res.json(rows);
    });
});

app.get("/api/finduser/:searchterm", (req, res) => {
    // req.params.searchterm
    console.log("Get request /api/finduser: ");
    db.findUsersByName(req.params.searchterm).then(({ rows }) => {
        res.json(rows);
    });
});

app.get("/api/otheruser/:otheruserid", (req, res) => {
    // console.log("GET request /api/otheruser: ", req.params.otheruserid);
    // console.log("req.session: ", req.session);

    if (req.params.otheruserid == req.session.userId) {
        res.json({ success: false });
    } else {
        db.findUserById(req.params.otheruserid).then(({ rows }) => {
            if (!rows[0]) {
                res.json({ success: false });
            } else {
                res.json(rows[0]);
            }
        });
    }
});

app.get("/api/friends-wannabees", (req, res) => {
    db.allFriendsAndWannabees(req.session.userId)
        .then(({ rows }) => {
            // console.log("rows: ", rows);

            return res.json(rows);
        })

        .catch((err) => {
            console.log("err: ", err);
        });
});

app.post(`/api/acceptingfriend/:id`, (req, res) => {
    console.log("req.params: ", req.params);

    db.makeTrue(req.session.userId, req.params.id).then(({ rows }) => {
        return res.json(rows[0]);
    });
});

app.post("/api/denyfriend/:id", (req, res) => {
    console.log("req.params: ", req.params);

    db.deleteFriend(req.session.userId, req.params.id).then(() => {
        return res.json({ success: true });
    });
});

app.get("/api/friendshipstatus/:otheruserid", (req, res) => {
    console.log(
        "GET request /api/friendshipstatus/otheruserid: ",
        req.params.otheruserid
    );

    db.findFriendshipStatusById(req.session.userId, req.params.otheruserid)
        .then(({ rows }) => {
            console.log("what is rows: ", rows);
            if (!rows[0]) {
                res.json({ status: 1, userId: req.session.userId });
            } else if (
                !rows[0].accepted &&
                req.session.userId === rows[0].sender_id
            ) {
                res.json({ status: 3 });
            } else if (rows[0].accepted) {
                res.json({ status: 4, userId: req.session.userId });
            } else {
                res.json({ status: 2, userId: req.session.userId });
            }
        })
        .catch((err) => {
            console.log("err", err);
        });
});

app.post("/api/postfriendship", (req, res) => {
    console.log("POST request /postfriendship");
    const { otherUserId, friendshipStatus } = req.body;
    console.log("otherUserId: ", otherUserId);
    console.log("friendshipStatus: ", friendshipStatus);

    console.log("req.session.userId: ", req.session.userId);
    if (friendshipStatus === 1) {
        //no friends to pending friends
        db.makeFalse(req.session.userId, otherUserId)
            .then(({ rows }) => {
                console.log("make false: ", rows);
                if (rows[0].sender_id == req.session.userId) {
                    res.json({ status: 3 });
                } else {
                    res.json({ status: 2 });
                }
            })
            .catch((err) => {
                console.log("err", err);
            });
    } else if (friendshipStatus === 2) {
        db.makeTrue(req.session.userId, otherUserId)
            .then(({ rows }) => {
                console.log("make true: ", rows);
                res.json({ status: 4 });
            })
            .catch((err) => {
                console.log("err", err);
            });
    } else if (friendshipStatus === 4 || friendshipStatus === 3) {
        db.deleteFriend(req.session.userId, otherUserId)
            .then(({ rows }) => {
                console.log("deleting: ", rows);
                res.json({ status: 1 });
            })
            .catch((err) => {
                console.log("err", err);
            });
    }
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("/upload got hit");
    db.addImage(
        req.session.userId,
        `https://s3.amazonaws.com/spicedling/${req.file.filename}`
    )
        .then(({ rows }) => {
            console.log("rows: ", rows[0]);

            res.json(rows[0]);
        })
        .catch((err) => {
            console.log("error: ", err);
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

app.post("/draftbio.json", (req, res) => {
    console.log("POST request /draftBio");
    db.addBioInfo(req.session.userId, req.body.draftBio)
        .then(({ rows }) => {
            res.json(rows[0].bio);
        })
        .catch((err) => {
            console.log("upload bio serverside failed, err: ", err);
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

app.get("/user/id.json", function (req, res) {
    res.json({
        userId: req.session.userId,
    });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

io.on("connection", async (socket) => {
    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }
    const { rows } = await db.getLatestMessages();
    socket.emit(`chatMessages`, rows);

    const { userId } = socket.request.session;
    socket.on("chatmessage", (message) => {
        console.log("message: ", message);
        let thing;
        db.newChatMessage(userId, message)
            .then(({ rows }) => {
                console.log("rows newChatMessage: ", rows);
                thing = rows[0].timestamp;
                return db.getUserInfo(userId);
            })
            .then(({ rows }) => {
                console.log("rows find userby id: ", rows);
                console.log("message: ", message);
                rows[0].message = message;
                rows[0].timestamp = thing;
                console.log("rows[0]: ", rows[0]);

                io.emit("chatMessageFromServer", rows[0]);
            });
    });
});
