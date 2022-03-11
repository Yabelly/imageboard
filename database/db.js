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
