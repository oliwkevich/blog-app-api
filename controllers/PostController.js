import Post from "../models/PostModel.js";
import User from "../models/UserModel.js";
import Comment from "../models/CommentModel.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

//Create post
export const createPost = async (req, res) => {
  try {
    const { title, text } = req.body;
    const user = await User.findById(req.userId);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.img.name; // формируем название файла
      const __dirname = dirname(fileURLToPath(import.meta.url)); // получаем путь к папке
      req.files.img.mv(path.join(__dirname, "..", "uploads", fileName)); //отправляем файл в нужную папку

      const newPostWithImage = new Post({
        username: user.username,
        title,
        text,
        imgUrl: fileName,
        author: req.userId,
      });

      await newPostWithImage.save();
      await User.findByIdAndUpdate(req.userId, {
        $push: { posts: newPostWithImage },
      });

      return res.json(newPostWithImage);
    }

    const newPostWithOutImage = new Post({
      username: user.username,
      title,
      text,
      imgUrl: "",
      author: req.userId,
    });

    await newPostWithOutImage.save();
    await User.findByIdAndUpdate(req.userId, {
      $push: { posts: newPostWithOutImage },
    });

    res.json(newPostWithOutImage);
  } catch (error) {
    res.json({ message: "Щось пішло не так" });
    console.log(error);
  }
};

//Get All Posts
export const getAll = async (req, res) => {
  try {
    const posts = await Post.find().sort("-created");
    const popularPosts = await Post.find().limit(5).sort("-views");

    if (!posts) return res.json({ message: "Постів нема!" });

    res.json({ posts, popularPosts });
  } catch (error) {
    res.json({ message: "Щось пішло не так. Номер помилки: 099" });
  }
};

//Get by ID
export const getById = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.json(post);
  } catch (error) {
    res.json({ message: "Щосб пішло не так. Номер помилки: 101" });
  }
};

//Get my Posts
export const getMyPosts = async (req, res) => {
  try {
    const user = await User.findById(req.userId);

    const list = await Promise.all(
      user.posts.map((post) => {
        return Post.findById(post._id);
      })
    );
    res.json(list);
  } catch (error) {
    res.json({ message: "Щосб пішло не так. Номер помилки: 102" });
  }
};

export const removePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.json({ message: "Такого поста немає" });

    const user = await User.findByIdAndUpdate(req.userId, {
      $pull: { posts: req.params.id },
    });

    return res.json({ message: "Пост був видалений" });
  } catch (error) {
    console.log(error);
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, text, id } = req.body;
    const post = await Post.findById(id);

    if (req.files) {
      let fileName = Date.now().toString() + req.files.img.name; // формируем название файла
      const __dirname = dirname(fileURLToPath(import.meta.url)); // получаем путь к папке
      req.files.img.mv(path.join(__dirname, "..", "uploads", fileName)); //отправляем файл в нужную папку

      post.imgUrl = fileName || "";
    }

    post.title = title;
    post.text = text;

    await post.save();

    return res.json(post);
  } catch (error) {
    console.log(error);
  }
};

export const getPostComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    const list = await Promise.all(
      post.comments.map((comment) => {
        return Comment.findById(comment);
      })
    );

    res.json(list);
  } catch (error) {
    console.log(error);
    res.json({ message: "Щось пішло не так", code: "104" });
  }
};

//TODO: https://youtu.be/QxTeE5EMiWI?t=15409
