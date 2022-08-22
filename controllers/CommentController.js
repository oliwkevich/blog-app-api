import Comment from "../models/CommentModel.js";
import Post from "../models/PostModel.js";

export const createComment = async (req, res) => {
  try {
    const { postId, comment } = req.body;

    if (!comment)
      return res.json({ message: "Комментарій не може бути порожнім" });

    const newComment = new Comment({ comment, author: req.userId });
    await newComment.save();

    try {
      await Post.findByIdAndUpdate(postId, {
        $push: { comments: newComment._id },
      });
    } catch (error) {
      console.log(error);
    }

    res.json(newComment);
  } catch (error) {
    console.log(error);
    res.json({ message: "Щось пішло не так!", code: "103" });
  }
};
