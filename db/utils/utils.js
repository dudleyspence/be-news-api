const db = require("../connection");

exports.checkArticleIdExists = (article_id) => {
  const queryStr = `SELECT 1 FROM articles WHERE article_id = $1`;
  return db.query(queryStr, [article_id]).then((result) => result.rowCount > 0);
};

exports.checkTopicExists = (topic) => {
  const queryStr = `SELECT 1 FROM topics WHERE slug = $1`;
  return db.query(queryStr, [topic]).then((result) => result.rowCount > 0);
};

exports.checkFirebaseUidExists = (firebase_uid) => {
  const queryStr = `SELECT 1 FROM users WHERE firebase_uid = $1`;
  return db
    .query(queryStr, [firebase_uid])
    .then((result) => result.rowCount > 0);
};
