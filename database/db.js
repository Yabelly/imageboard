const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/socialnetwork`
);

module.exports.registration = (first, last, email, hashedPassword) => {
    return db.query(
        `
    INSERT INTO users (first, last, email, password)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
        [first, last, email, hashedPassword]
    );
};

module.exports.getUserInfo = (userId) => {
    return db.query(
        `
        SELECT users.id, users.first,  users.last, users.email, users.profile_pic, users.bio
        FROM users
        WHERE id=$1
        `,
        [userId]
    );
};

module.exports.getLoginInfo = (email) => {
    return db.query(
        `
       SELECT users.id, users.password 
       FROM users 
       WHERE email=$1
       `,
        [email]
    );
};

module.exports.verify = (email) => {
    return db.query(
        `
        SELECT users.id
        FROM users
        WHERE email=$1
        `,
        [email]
    );
};

module.exports.inputCode = (email, secretCode) => {
    return db.query(
        `
        INSERT INTO reset_codes (email, code)
        VALUES ($1, $2)
        RETURNING reset_codes.id
        `,
        [email, secretCode]
    );
};

module.exports.getResetCode = (email) => {
    return db.query(
        `
    SELECT * FROM  reset_codes
    WHERE email=$1 AND CURRENT_TIMESTAMP - timestamp < INTERVAL '10 minutes'
    ORDER BY timestamp DESC
    LIMIT 1
    `,
        [email]
    );
};

module.exports.changePassword = (hashedPassword, email) => {
    return db.query(
        `
        UPDATE users
        SET password = $1
        WHERE email = $2
        `,
        [hashedPassword, email]
    );
};

module.exports.addImage = (id, profile_pic) => {
    return db.query(
        `
        UPDATE users
        SET profile_pic = $2
        WHERE id = $1
        RETURNING *
`,
        [id, profile_pic]
    );
};

module.exports.addBioInfo = (id, bio) => {
    return db.query(
        `
        UPDATE users
        SET bio = $2
        WHERE id = $1
        RETURNING *
        `,
        [id, bio]
    );
};

module.exports.findUsersByName = (name) => {
    return db.query(
        `
        SELECT users.id, users.first, users.last, users.profile_pic, users.bio
        FROM users
        WHERE first ILIKE $1
        OR last ILIKE $1
        LIMIT 9

`,
        [name + "%"]
    );
};

module.exports.findUserById = (otherUserId) => {
    return db.query(
        `
        SELECT users.first, users.last, users.profile_pic, users.bio, users.id
        FROM users
        WHERE users.id = $1
        `,
        [otherUserId]
    );
};

module.exports.findRecentUsers = () => {
    return db.query(
        `
        SELECT users.id, users.first, users.last, users.profile_pic, users.bio
        FROM users
        ORDER BY users.created_at DESC
        LIMIT 3
        `
    );
};

module.exports.findFriendshipStatusById = (myId, otherUserId) => {
    return db.query(
        `
        SELECT friendships.sender_id, friendships.recipient_id, friendships.accepted
        FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
        OR (recipient_id = $2 AND sender_id = $1)
        `,
        [myId, otherUserId]
    );
};

module.exports.makeFalse = (sender_id, recipient_id) => {
    return db.query(
        `
        INSERT INTO friendships (sender_id, recipient_id, accepted)
        VALUES ($1, $2, $3)
        RETURNING *

`,
        [sender_id, recipient_id, false]
    );
};
module.exports.makeTrue = (sender_id, recipient_id) => {
    return db.query(
        `
    UPDATE friendships
    SET accepted = $3
    WHERE (recipient_id = $1 AND sender_id = $2)
  OR (recipient_id = $2 AND sender_id = $1)
  RETURNING *
    `,
        [sender_id, recipient_id, true]
    );
};

module.exports.deleteFriend = (sender_id, recipient_id) => {
    return db.query(
        `
        DELETE FROM friendships
        WHERE (recipient_id = $1 AND sender_id = $2)
         OR (recipient_id = $2 AND sender_id = $1)
    
        `,
        [sender_id, recipient_id]
    );
};

module.exports.allFriendsAndWannabees = (userId) => {
    return db.query(
        `
        SELECT users.id, first, last, profile_pic, accepted
        FROM friendships
        JOIN users
        ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
        OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)

        `,
        [userId]
    );
};

module.exports.newChatMessage = (userId, message) => {
    return db.query(
        `
        INSERT INTO chatbox (sender_id, message)
        VALUES ($1, $2)
        RETURNING chatbox.sender_id, chatbox.message, chatbox.timestamp

        `,
        [userId, message]
    );
};
module.exports.getLatestMessages = () => {
    return db.query(
        `
        SELECT chatbox.sender_id, chatbox.message, chatbox.timestamp, users.id, users.first, users.last, users.profile_pic, users.bio
        FROM users
        INNER JOIN chatbox
        ON users.id = chatbox.sender_id
        ORDER BY chatbox.id DESC
        LIMIT 10
        `
    );
};
