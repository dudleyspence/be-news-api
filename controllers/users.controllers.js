const { fetchUsers, fetchUserByFirebaseId } = require("../models/users.models");

exports.getUsers = (request, response, next) => {
  fetchUsers()
    .then((users) => {
      response.status(200).send({ users });
    })
    .catch(next);
};

exports.getUserByFirebaseId = (request, response, next) => {
  const { firebase_uid } = request.params;

  fetchUserByFirebaseId(firebase_uid)
    .then((user) => {
      response.status(200).send({ user });
    })
    .catch(next);
};

exports.createUser = (request, response, next) => {
  const { firebase_uid, username, name, avatar_url } = request.body;

  if (!firebase_uid || !username || !name) {
    return response.status(400).send({ msg: "Missing required fields" });
  }

  insertUser({ firebase_uid, username, name, avatar_url })
    .then((user) => {
      response.status(201).send({ user });
    })
    .catch(next);
};
