import React, { useState } from "react";
import "./styles/Comment.css";

const Comment = ({ onSubmit, photoURL }) => {
  const [text, setText] = useState("");
  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(text, setText);
  };

  return (
    <form className="comment-form" onSubmit={handleFormSubmit}>
      <img src={photoURL} alt="profile-pic" className="comment-pp" />
      <div>
        <textarea
          className="comment-form-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment"
        ></textarea>
        <div>
          <button type="submit">Submit</button>
          <button type="button" onClick={() => setText("")}>
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default Comment;
