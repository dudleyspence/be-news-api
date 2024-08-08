const db = require("../db/connection");
const {
  checkArticleIdExists,
  checkUsernameExists,
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
  let queryStr = `SELECT * FROM comments `;

  //validate limit and page
  if (!/^\d+$/.test(p) || !/^\d+$/.test(limit)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }
  queryValues.push(limit);
  queryValues.push(p);

  if (!article_id.match(/^\d+$/)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const promiseArray = [];

  if (article_id) {
    queryStr += `WHERE article_id=$3 `;
    queryValues.push(article_id);
    promiseArray.push(checkArticleIdExists());
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
    !comment.username ||
    !comment.body ||
    typeof comment.username !== "string" ||
    typeof comment.body !== "string"
  ) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const isValidId = article_id.match(/^\d+$/);

  if (!isValidId) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const postData = [comment.body, comment.username, Number(article_id)];

  let queryStr = `INSERT INTO comments 
    (body, author, article_id) 
    VALUES ($1, $2, $3) 
    RETURNING *`;

  const promiseArray = [
    checkUsernameExists(comment.username),
    checkArticleIdExists(article_id),
  ];

  return Promise.all(promiseArray)
    .then(([usernameExists, article_idExists]) => {
      if (!usernameExists) {
        return Promise.reject({ status: 400, message: "bad request" });
      } else if (!article_idExists) {
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
  const isValidId = comment_id.match(/^\d+$/);

  if (!isValidId) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const sqlQuery = `
    DELETE FROM comments
    WHERE comment_id=$1
    RETURNING *`;

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

  const isValidId = comment_id.match(/^\d+$/);

  const isValidIncVotes = typeof inc_votes === "number";

  if (!isValidId || !isValidIncVotes) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  let querySQL = `
        UPDATE comments
        SET votes = votes + $1
        WHERE comment_id = $2
        RETURNING * `;

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
