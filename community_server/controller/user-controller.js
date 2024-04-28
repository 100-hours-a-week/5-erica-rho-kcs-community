import { users } from "../model/data.js";
import {
  checkUserModel,
  checkUserIdModel,
  checkUserEmailModel,
  checkUserNicknameModel,
  addUserModel,
  logInUserModel,
  updateUserProfileModel,
  updateUserPasswordModel,
  deleteUserModel,
  addUserImageModel,
} from "../model/users.js";

export const getUsers = (req, res) => {
  //TODO: 서버로 띄울 시 활셩화 필요
  // users.forEach((user) => {
  //   user.profile_image = user.profile_image.replace(
  //     "http://localhost:8000",
  //     `https://${req.headers.host}`
  //   );
  // });
  return res.status(200).json({ status: 200, message: null, data: users });
};

export const getUser = (req, res) => {
  const userId = Number(req.params.userId);
  if (!userId) {
    return res
      .status(400)
      .json({ status: 404, message: "invalid_user_id", data: null });
  }

  const user = checkUserModel(userId);

  if (!user) {
    return res
      .status(404)
      .json({ status: 404, message: "not_fount_user", data: null });
  }

  //TODO: 서버로 띄울 시 활셩화 필요
  // user.profile_image = user.profile_image.replace(
  //   "http://localhost:8000",
  //   `https://${req.headers.host}`
  // );

  if (user) {
    return res.status(200).json({ status: 200, message: null, data: user });
  }
};

export const addUser = (req, res) => {
  const { email, nickname, password, profile_image } = req.body;

  let profile_server_url = "";

  if (!email || !nickname || !password || !profile_image) {
    return res
      .status(400)
      .json({ status: 404, message: "invalid_input", data: null });
  }

  if (profile_image) {
    profile_server_url = addUserImageModel(profile_image);
  }

  const newUserId = addUserModel({
    email,
    nickname,
    password,
    profile_image: profile_server_url,
  });

  if (!newUserId) {
    return res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  return res.status(201).json({
    status: 201,
    message: "register_success",
    data: { userId: newUserId, profile_image },
  });
};

export const logInUser = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  if (!email) {
    return res
      .status(400)
      .json({ status: 400, message: "required_email", data: null });
  }

  const user = logInUserModel(email, password);

  if (!user) {
    return res
      .status(401)
      .json({ status: 401, message: "invalid_email_or_password", data: null });
  }

  return res
    .status(200)
    .json({ status: 200, message: "login_success", data: user });
};

export const updateUserProfile = (req, res) => {
  const userId = Number(req.params.userId);
  const { nickname, profile_image } = req.body;

  let user_server_url = "";

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!profile_image.includes(req.headers.host)) {
    console.log("post Image");
    const saved_image_url = addUserImageModel(profile_image);
    if (!saved_image_url) {
      return res
        .status(500)
        .json({ status: 500, message: "internal_server_error", data: null });
    }
    user_server_url = saved_image_url;
    console.log(user_server_url);
  } else {
    user_server_url = profile_image.replace(
      req.headers.host,
      "http://localhost:8080"
    );
    console.log(user_server_url);
  }

  if (!checkUserIdModel(userId)) {
    return res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  if (!checkUserIdModel(userId) && !profile_image) {
    return res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  const success = updateUserProfileModel({
    userId,
    nickname,
    profile_image: user_server_url,
  });

  if (!success) {
    return res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  return res
    .status(201)
    .json({ status: 201, message: "update_user_data_success", data: success });
};

export const updateUserpassword = (req, res) => {
  const userId = Number(req.params.userId);
  const password = req.body.password;

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!password) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_password", data: null });
  }

  if (!checkUserId(userId)) {
    return res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  const success = updateUserPasswordModel({ userId, password });

  if (!success) {
    return res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  return res.status(201).json({
    status: 201,
    message: "change_user_password_success",
    data: null,
  });
};

export const deleteUser = (req, res) => {
  const userId = Number(req.params.id);

  if (!userId) {
    return res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!checkUserId(userId)) {
    return res
      .status(404)
      .json({ status: 404, message: "not_found_user", data: null });
  }

  const isSuccess = deleteUserModel(userId);

  if (isSuccess) {
    return res
      .status(200)
      .json({ status: 200, message: "delete_user-data_success", data: null });
  }
};

export const duplicateEmail = (req, res) => {
  const email = req.params.email;

  const isExist = checkUserEmailModel(email);

  if (isExist) {
    return res
      .status(400)
      .json({ status: 400, message: "already_exist_email", data: null });
  }

  return res
    .status(200)
    .json({ status: 200, message: "available_email", data: null });
};

export const duplicateNickname = (req, res) => {
  const nickname = req.params.nickname;
  const userId = Number(req.body.userId) ?? null;

  if (!userId) {
    return res
      .status(404)
      .json({ status: 404, message: "invalid_user", data: null });
  }

  if (userId) {
    const user = checkUserModel(userId);
    if (user.nickname === nickname) {
      return res
        .status(200)
        .json({ status: 200, message: "same_nickname", data: null });
    }
  }

  const isExist = checkUserNicknameModel(nickname);

  if (isExist) {
    return res
      .status(400)
      .json({ status: 400, message: "already_exist_nickname", data: null });
  }

  return res
    .status(200)
    .json({ status: 200, message: "available_nickname", data: null });
};
