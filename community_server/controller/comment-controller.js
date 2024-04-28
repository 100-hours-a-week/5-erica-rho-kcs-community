import { getPost } from "../model/posts.js";
import {
  getComment,
  getComments,
  checkIsOwner,
  registerComments,
  updateComment,
  eraseComment,
} from "../model/comments.js";

//실제 controller 역할
const getCommentList = (req, res) => {
  const postId = Number(req.params.postId);
  if (!postId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  const commentList = getComments(postId);

  //TODO: 서버로 띄울 시 활셩화 필요
  // commentList.forEach((comment) => {
  //   comment.profile_image = comment.profile_image.replace(
  //     "http://localhost:8000",
  //     `https://${req.headers.host}`
  //   );
  // });
  res.status(200).json({ status: 200, message: null, data: commentList });
  return;
};

const postComment = (req, res) => {
  const postId = Number(req.params.postId);
  const comment = req.body.comment;
  const userId = Number(req.body.userId);

  if (!postId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  const post = getPost(postId);
  if (!post) {
    res
      .status(404)
      .json({ status: 404, message: "not_a_single_post", data: null });
  }

  if (!userId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_user_id", data: null });
  }

  if (!comment) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_comment", data: null });
  }

  const isSuccess = registerComments({ postId, userId, comment });

  if (!isSuccess) {
    res
      .status(500)
      .json({ status: 500, message: "internal_sever_error", data: null });
  }

  res
    .status(201)
    .json({ status: 201, message: "write_comment_success", data: null });

  return;
};

const patchComment = (req, res) => {
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);
  const commentContent = req.body.comment;
  const comment = getComment({ postId, commentId });

  if (!comment) {
    res
      .status(404)
      .json({ status: 404, message: "not_a_single_comment", data: null });
  }

  if (!postId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  if (!commentId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_comment_id", data: null });
  }

  const isSuccess = updateComment({ commentId, commentContent });
  if (!isSuccess) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  res
    .status(200)
    .json({ status: 200, message: "update_comment_success", data: null });

  return;
};

const deleteComment = (req, res) => {
  const postId = Number(req.params.postId);
  const commentId = Number(req.params.commentId);
  const comment = getComment({ postId, commentId });

  if (!comment) {
    res
      .status(404)
      .json({ status: 404, message: "not_a_single_comment", data: null });
  }

  if (!postId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_post_id", data: null });
  }

  if (!commentId) {
    res
      .status(400)
      .json({ status: 400, message: "invalid_comment_id", data: null });
  }

  const isSuccess = eraseComment(commentId);

  if (!isSuccess) {
    res
      .status(500)
      .json({ status: 500, message: "internal_server_error", data: null });
  }

  res
    .status(200)
    .json({ status: 200, message: "delete_comment_success", data: null });

  return;
};

const isOwner = (req, res) => {
  const id = Number(req.body.commentId);
  const userId = Number(req.body.userId);
  const check = checkIsOwner({ userId, commentId: id });
  if (!check) {
    res.status(403).json({ status: 403, message: "not_allowed", data: null });
  }

  res.status(200).json({ status: 200, message: "is_owner", data: null });
};

export default {
  getCommentList,
  postComment,
  patchComment,
  deleteComment,
  isOwner,
};
