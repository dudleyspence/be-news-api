const db = require("../db/connection");

exports.fetchUsers = () => {
  const queryStr = `SELECT * FROM users `;

  return db.query(queryStr).then(({ rows }) => {
    return rows;
  });
};

exports.fetchUserByFirebaseId = (firebaseUid) => {
  const queryStr = `SELECT * FROM users WHERE firebase_uid = $1`;

  return db.query(queryStr, [firebaseUid]).then(({ rows }) => {
    if (rows.length === 0) {
      return Promise.reject({ status: 404, message: "User not found" });
    }
    return rows[0];
  });
};

exports.insertUser = ({ firebase_uid, username, name, avatar_url }) => {
  if (!avatar_url){
    avatar_url = 'https://static.vecteezy.com/system/resources/thumbnails/036/280/651/small/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-illustration-vector.jpg'; 
  }
  const queryStr = `
      INSERT INTO users (firebase_uid, username, name, avatar_url)
      VALUES ($1, $2, $3, $4)
      RETURNING *;
    `;
  const values = [firebase_uid, username, name, avatar_url];

  return db.query(queryStr, values).then(({ rows }) => {
    return rows[0];
  });
};
