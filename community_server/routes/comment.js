import express from "express";
import commentController from "../controller/comment-controller.js";

const router = express.Router();

//해당 게시물 댓글 불러오기
router.get("/:postId/comments", commentController.getComments);

//댓글 작성
router.post("/:postId/comments", commentController.addComment);

//댓글 수정
router.patch("/:postId/comments/:commentId", commentController.updateComment);

//댓글 삭제
router.delete("/:postId/comments/:commentId", commentController.deleteComment);

//댓글 작성자 확인
router.post(
  "/:postId/comments/checkOwner",
  commentController.checkCommentOwner
);

export default router;
