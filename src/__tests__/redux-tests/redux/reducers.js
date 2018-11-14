import { combineReducers } from "redux";
import comments from "../ducks/comments";
import posts from "../ducks/posts";

export default combineReducers({ comments, posts });
