import React, { Component } from "react";
import { comment, uncomment } from "./postApi";
import { isAuthenticated } from "../auth";
import { Link } from "react-router-dom";
import DefaulAvatar from "../images/avatar.jpg";

class Comment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      error: "",
    };
  }

  handleChange = (e) => {
    this.setState({ text: e.target.value, error: "" });
  };

  isValid = () => {
    const { text } = this.state;
    if (!text.length > 0 || text.length > 180) {
      this.setState({
        error: "Comment should be around 0-180 characters",
      });
      return false;
    }
    return true;
  };

  addComment = (e) => {
    e.preventDefault();

    if (this.isValid()) {
      const userId = isAuthenticated().user._id;
      const token = isAuthenticated().token;
      const postId = this.props.postId;

      comment(userId, token, postId, { text: this.state.text }).then((data) => {
        if (data.error) {
          console.log(data.error);
        } else {
          this.setState({ text: "" });
          //show the new list of comments to parent component (SinglPost)
          this.props.updatedComments(data.comments);
        }
      });
    }
  };

  deleteComment = (comment) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;
    const postId = this.props.postId;

    uncomment(userId, token, postId, comment).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.props.updatedComments(data.comments);
      }
    });
  };

  deleteConfirmation = (comment) => {
    let answer = window.confirm("Are you sure to delete this comment?");
    if (answer) {
      this.deleteComment(comment);
    }
  };

  render() {
    const { comments } = this.props;
    const { error } = this.state;

    return (
      <div>
        <h2 className="mt-5 mb-5">Leave a comment</h2>

        <form onSubmit={this.addComment}>
          <div className="form-group">
            <input
              type="text"
              onChange={this.handleChange}
              value={this.state.text}
              className="form-control"
              placeholder="Let me know your feeling"
            />
            <button className="btn btn-raised btn-primary mt-2">Comment</button>
          </div>
        </form>

        <div
          className="alert alert-danger"
          style={{ display: error ? "" : "none" }}
        >
          {error}
        </div>

        <div className="col-md-12">
          <h3 style={{ backgroundColor: "#336600" }}>
            {comments.length} Comments
          </h3>
          <hr />
          {comments.map((comment, i) => (
            <div key={i}>
              <div>
                <Link to={`/user/${comment.postedBy._id}`}>
                  <img
                    className="float-left mr-2"
                    style={{ borderRadius: "50%", border: "1px solid black" }}
                    width="30px"
                    height="30px"
                    onError={(i) => (i.target.src = `${DefaulAvatar}`)}
                    src={`${process.env.REACT_APP_API_URL}/user/photo/${comment.postedBy._id}`}
                    alt="comment.postedBy.name"
                  />
                </Link>

                <div>
                  <p className="lead">{comment.text}</p>
                  <p className="font-italic mark">
                    Posted by{" "}
                    <Link to={`/user/${comment.postedBy._id}`}>
                      {comment.postedBy.name}{" "}
                    </Link>
                    on {new Date(comment.created).toDateString()}
                    <span>
                      {isAuthenticated().user &&
                        isAuthenticated().user._id === comment.postedBy._id && (
                          <span
                            onClick={() => this.deleteConfirmation(comment)}
                            className="fas fa-trash-alt text-danger float-right mr-1"
                          ></span>
                        )}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Comment;
