import "./styles/Comments.css";

const Comments = (comment) => {
  return (
    <div className="comment">
      <div className="commentProfile">
        <img
          src={comment.Comment.url}
          alt="profilePic"
          className="commentPic"
        ></img>
        <h3> {comment.Comment.name} </h3>
        {comment.display(comment.Comment.id) ? (
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIiq7sZW1MwcJYH5gj-7UsvNp6K379AzJ_yg&usqp=CAU"
            onClick={() => comment.handleDelete(comment.Comment.index)}
            alt="delete"
            className="delete"
          />
        ) : (
          <></>
        )}
      </div>
      <div className="commentText">
        <p> {comment.Comment.comment} </p>
      </div>
    </div>
  );
};

export default Comments;
