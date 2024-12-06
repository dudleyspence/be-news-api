// comments.js
const db = require("../db/connection");
const {
  checkArticleIdExists,
  checkFirebaseUidExists,
  checkCommentExists,
} = require("../db/utils/utils");

exports.fetchComments = (
  sort_by = "created_at",
  order = "ASC",
  limit = 10,
  p = 1,
  article_id
) => {
  const validSortBys = ["created_at", "votes"];

  const queryValues = [];
  let queryStr = `
    SELECT 
      comments.comment_id,
      comments.body,
      comments.votes,
      comments.created_at,
      users.username AS author,
      users.avatar_url AS author_avatar_url
    FROM comments 
    LEFT JOIN users ON comments.author = users.firebase_uid
  `;

  if (!/^\d+$/.test(p) || !/^\d+$/.test(limit)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }
  queryValues.push(limit);
  queryValues.push(p);

  if (!/^\d+$/.test(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const promiseArray = [];

  if (article_id) {
    queryStr += `WHERE comments.article_id = $3 `;
    queryValues.push(article_id);
    promiseArray.push(checkArticleIdExists(article_id));
  }

  if (
    !["asc", "desc", "ASC", "DESC"].includes(order) ||
    !validSortBys.includes(sort_by)
  ) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }

  queryStr += `ORDER BY ${sort_by} ${order} `;

  queryStr += `LIMIT $1 OFFSET $1*($2-1) `;

  promiseArray.push(db.query(queryStr, queryValues));

  return Promise.all(promiseArray).then(([articleExists, { rows }]) => {
    if (!articleExists && rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    } else {
      return rows;
    }
  });
};

exports.addComment = (comment, article_id) => {
  if (
    !comment.author ||
    !comment.body ||
    typeof comment.author !== "string" ||
    typeof comment.body !== "string"
  ) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const isValidId = /^\d+$/.test(article_id);

  if (!isValidId) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const postData = [comment.body, comment.author, Number(article_id)];

  const queryStr = `
    INSERT INTO comments 
      (body, author, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING * 
  `;

  const promiseArray = [
    checkFirebaseUidExists(comment.author),
    checkArticleIdExists(article_id),
  ];

  return Promise.all(promiseArray)
    .then(([authorExists, articleExists]) => {
      if (!authorExists) {
        return Promise.reject({ status: 400, message: "bad request" });
      } else if (!articleExists) {
        return Promise.reject({ status: 404, message: "not found" });
      } else {
        return db.query(queryStr, postData);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeComment = (comment_id) => {
  const isValidId = /^\d+$/.test(comment_id);

  if (!isValidId) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const sqlQuery = `
    DELETE FROM comments
    WHERE comment_id = $1
    RETURNING *
  `;

  const queryValues = [comment_id];

  const promiseArray = [
    checkCommentExists(comment_id),
    db.query(sqlQuery, queryValues),
  ];

  return Promise.all(promiseArray).then(([commentExists, { rows }]) => {
    if (!commentExists && rows.length === 0) {
      return Promise.reject({ status: 404, message: "not found" });
    } else {
      return rows[0];
    }
  });
};

exports.incVotesByCommentId = (comment_id, patchBody) => {
  if (
    Object.keys(patchBody).length !== 1 ||
    Object.keys(patchBody)[0] !== "inc_votes"
  ) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const { inc_votes } = patchBody;

  const isValidId = /^\d+$/.test(comment_id);
  const isValidIncVotes = typeof inc_votes === "number";

  if (!isValidId || !isValidIncVotes) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const querySQL = `
    UPDATE comments
    SET votes = votes + $1
    WHERE comment_id = $2
    RETURNING *
  `;

  return checkCommentExists(comment_id)
    .then((commentExists) => {
      if (!commentExists) {
        return Promise.reject({ status: 400, message: "bad request" });
      } else {
        return db.query(querySQL, [inc_votes, comment_id]);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};
