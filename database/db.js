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
        INSERT INTO reset_code (email, code)
        VALUES ($1, $2)
        RETURNING *
        `,
        [email, secretCode]
    );
};
