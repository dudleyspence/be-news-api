const db = require("../db/connection");
const {
  checkArticleIdExists,
  checkTopicExists,
  checkUsernameExists,
} = require("../db/utils/utils");

exports.fetchArticleById = (article_id) => {
  let queryStr = `
    SELECT 
      articles.author, 
      users.avatar_url AS author_avatar_url,
      articles.title, 
      articles.article_id, 
      articles.topic, 
      articles.created_at, 
      articles.votes,
      articles.body, 
      articles.article_img_url,
      COUNT(comments.article_id)::INT AS comment_count
    FROM articles 
    LEFT JOIN comments 
      ON articles.article_id = comments.article_id
    LEFT JOIN users
      ON articles.author = users.username
  `;

  const isValidId = /^\d+$/.test(article_id);
  if (!isValidId) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  queryStr += `WHERE articles.article_id = $1 `;

  queryStr += `
    GROUP BY 
      articles.article_id, 
      users.avatar_url
  `;

  return checkArticleIdExists(article_id)
    .then((articleExists) => {
      if (!articleExists) {
        return Promise.reject({ status: 404, message: "not found" });
      } else {
        return db.query(queryStr, [article_id]);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.fetchArticles = (
  sort_by = "created_at",
  order = "DESC",
  limit = 10,
  p = 1,
  topic,
  author
) => {
  const queryValues = [];
  const totalQueryValues = [];

  const validSortBys = [
    "created_at",
    "author",
    "title",
    "votes",
    "comment_count",
    "article_id",
  ];

  if (
    !["asc", "desc", "ASC", "DESC"].includes(order) ||
    !validSortBys.includes(sort_by)
  ) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }

  if (!/^\d+$/.test(p) || !/^\d+$/.test(limit)) {
    return Promise.reject({ status: 400, message: "invalid query" });
  }

  let queryStr = `
      SELECT 
        articles.author, 
        users.avatar_url AS author_avatar_url,
        articles.title, 
        articles.article_id, 
        articles.topic, 
        articles.created_at, 
        articles.votes, 
        articles.article_img_url,
        COUNT(comments.article_id)::INT AS comment_count
      FROM articles 
      LEFT JOIN comments ON articles.article_id = comments.article_id 
      LEFT JOIN users ON articles.author = users.username
    `;

  let totalQueryStr = `
      SELECT COUNT(*)::INT AS total_results
      FROM articles
      LEFT JOIN users ON articles.author = users.username
    `;

  const whereConditions = [];
  const totalWhereConditions = [];

  let index = 1;

  if (topic) {
    whereConditions.push(`articles.topic = $${index}`);
    totalWhereConditions.push(`articles.topic = $${index}`);
    queryValues.push(topic);
    totalQueryValues.push(topic);
    index++;
  }

  if (author) {
    whereConditions.push(`articles.author = $${index}`);
    totalWhereConditions.push(`articles.author = $${index}`);
    queryValues.push(author);
    totalQueryValues.push(author);
    index++;
  }

  if (whereConditions.length > 0) {
    queryStr += ` WHERE ${whereConditions.join(" AND ")} `;
    totalQueryStr += ` WHERE ${totalWhereConditions.join(" AND ")} `;
  }

  queryStr += `
      GROUP BY 
        articles.article_id, 
        users.avatar_url
    `;

  if (sort_by === "comment_count") {
    queryStr += ` ORDER BY "${sort_by}" ${order} `;
  } else {
    queryStr += ` ORDER BY ${sort_by} ${order} `;
  }

  queryStr += ` LIMIT $${index} OFFSET $${index + 1} `;

  queryValues.push(limit);
  queryValues.push(limit * (p - 1));

  return Promise.all([
    db.query(queryStr, queryValues),
    db.query(totalQueryStr, totalQueryValues),
  ]).then(([result1, result2]) => {
    const filteredArticles = result1.rows;
    const total_results = result2.rows[0].total_results;
    return [filteredArticles, total_results];
  });
};

exports.incVotesByArticleId = (article_id, patchBody) => {
  if (
    Object.keys(patchBody).length !== 1 ||
    Object.keys(patchBody)[0] !== "inc_votes"
  ) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const { inc_votes } = patchBody;

  const isValidId = /^\d+$/.test(article_id);

  const isValidIncVotes = typeof inc_votes === "number";

  if (!isValidId || !isValidIncVotes) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  let querySQL = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        RETURNING votes `;

  return checkArticleIdExists(article_id)
    .then((articleExists) => {
      if (!articleExists) {
        return Promise.reject({ status: 400, message: "bad request" });
      } else {
        return db.query(querySQL, [inc_votes, article_id]);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.addArticle = (article) => {
  let queryStr = `
    INSERT INTO articles (author, title, body, topic, article_img_url)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *, (
              SELECT COUNT(*)::INT 
              FROM comments 
              WHERE comments.article_id = articles.article_id
          ) AS comment_count;`;

  let articleChecksArray = [
    checkUsernameExists(article.author),
    checkTopicExists(article.topic),
  ];

  const newArticleRequirements = ["author", "title", "body", "topic"];

  const includesRequirements = newArticleRequirements.every((requiredKey) =>
    Object.keys(article).includes(requiredKey)
  );

  if (!includesRequirements) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  let queryValues = [
    article.author,
    article.title,
    article.body,
    article.topic,
  ];

  //a google suggested url regex
  const urlRegex =
    /((http(s)?:\/\/)?(www\.)?[a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%._+~#?&//=]*))/gi;

  if (article.article_img_url && urlRegex.test(article.article_img_url)) {
    queryValues.push(article.article_img_url);
  } else {
    queryStr = `
        INSERT INTO articles (author, title, body, topic)
        VALUES ($1, $2, $3, $4)
        RETURNING *, (
              SELECT COUNT(*)::INT 
              FROM comments 
              WHERE comments.article_id = articles.article_id
          ) AS comment_count;`;
  }

  return Promise.all(articleChecksArray)
    .then(([authorExists, topicExists]) => {
      if (!authorExists || !topicExists) {
        return Promise.reject({ status: 400, message: "bad request" });
      } else {
        return db.query(queryStr, queryValues);
      }
    })
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.removeArticle = (article_id) => {
  if (!/^\d+$/.test(article_id)) {
    return Promise.reject({ status: 400, message: "bad request" });
  }

  const sqlQuery = `
    DELETE FROM articles
    WHERE article_id=$1
    RETURNING *`;

  const queryValues = [article_id];

  return checkArticleIdExists(article_id)
    .then((articleExists) => {
      if (!articleExists) {
        return Promise.reject({ status: 404, message: "not found" });
      } else {
        return db.query(sqlQuery, queryValues);
      }
    })
    .then(({ rows }) => {
      return rows;
    });
};
