import React, { useState } from "react";
import "./styles/Comment.css";
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";

const Comment = ({ onSubmit, photoURL }) => {
  const [text, setText] = useState("");
  const [isTextareaActive, setIsTextareaActive] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (text.trim() !== "") {
      onSubmit(text, setText);
    }
  };

  const handleCancel = () => {
    setText("");
    setIsTextareaActive(false);
  };

  return (
    <form className="comment-form" onSubmit={handleFormSubmit}>
      <img src={photoURL} alt="profile-pic" className="comment-pp" />
      <div>
        <Form.Control
          as="textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setIsTextareaActive(true)}
          placeholder="Add a comment"
          style={{ width: "60vw", height: "40px", marginBottom: "5px" }}
        />
        {isTextareaActive && (
          <div>
            <Button
              variant="dark"
              as="input"
              type="submit"
              value="Submit"
              style={{ borderRadius: "40px" }}
            />
            <Button
              variant="dark"
              type="button"
              onClick={handleCancel}
              style={{ borderRadius: "40px" }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default Comment;
