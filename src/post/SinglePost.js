import React, { Component } from "react";
import { singlePost, remove, like, unlike } from "./postApi";
import DefaulPost from "../images/saigon.jpg";
import { Link, Redirect } from "react-router-dom";
import { isAuthenticated } from "../auth";
import Comment from "./Comment";

class SinglePost extends Component {
  constructor() {
    super();
    this.state = {
      post: "",
      redirectToHome: false,
      like: false,
      likes: 0,
      comments: [],
    };
  }

  componentDidMount = () => {
    const postId = this.props.match.params.postId;
    singlePost(postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          post: data,
          likes: data.likes.length,
          like: this.checkLike(data.likes),
          comments: data.comments,
        });
      }
    });
  };

  updatedComments = (comments) => {
    this.setState({ comments });
  };

  checkLike = (likes) => {
    const userId = isAuthenticated().user._id;
    let match = likes.indexOf(userId) !== -1;
    return match;
  };

  likeToggle = () => {
    let callApi = this.state.like ? unlike : like;
    const userId = isAuthenticated().user._id;
    const postId = this.state.post._id;
    const token = isAuthenticated().token;

    callApi(userId, token, postId).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({
          like: !this.state.like,
          likes: data.likes.length,
        });
      }
    });
  };

  deletePost = () => {
    const postId = this.props.match.params.postId;
    const token = isAuthenticated().token;
    remove(postId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ redirectToHome: true });
      }
    });
  };

  deleteConfirmation = () => {
    let answer = window.confirm("Are you sure to delete this post?");
    if (answer) {
      this.deletePost();
    }
  };

  renderPost = (post) => {
    const posterId = post.postedBy ? `/user/${post.postedBy._id}` : "";
    const posterName = post.postedBy ? post.postedBy.name : "Unknown";

    const { like, likes } = this.state;

    return (
      <div className="card-body">
        {like ? (
          <h4 className="float-left" onClick={this.likeToggle}>
            <i
              className="fas fa-heart text-danger bg-dark mr-2"
              style={{
                padding: "10px",
                borderRadius: "50%",
              }}
            ></i>
            {likes} Like
          </h4>
        ) : (
          <h4 className="float-left" onClick={this.likeToggle}>
            <i
              className="fas fa-heart text-light bg-dark mr-2"
              style={{
                padding: "10px",
                borderRadius: "50%",
              }}
            ></i>
            {likes} Like
          </h4>
        )}

        <img
          src={`${process.env.REACT_APP_API_URL}/post/photo/${post._id}`}
          alt={post.title}
          onError={(i) => (i.target.src = `${DefaulPost}`)}
          style={{ height: "300px", width: "auto" }}
          className="img-thumbnail img-fluid mx-auto d-block"
        />

        <p className="card-text">{post.body}</p>
        <br />
        <p className="font-italic mark">
          Posted by <Link to={`${posterId}`}>{posterName} </Link>
          on {new Date(post.created).toDateString()}
        </p>
        <Link
          to={`/`}
          className="btn btn-raised btn-success btn-sm float-right"
        >
          Back to Home
        </Link>

        {isAuthenticated().user &&
          isAuthenticated().user._id === post.postedBy._id && (
            <div className="d-inline-block">
              <Link
                to={`/post/edit/${post._id}`}
                className="btn btn-raised btn-info mr-5"
              >
                Update Post
              </Link>
              <button
                onClick={this.deleteConfirmation}
                className="btn btn-raised btn-warning"
              >
                Delete Post
              </button>
            </div>
          )}
      </div>
    );
  };

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }

    const { post, comments } = this.state;
    return (
      <div className="container-fluid">
        <h2 className="display-2 mt-3 mb-3">{post.title}</h2>

        {!post ? (
          <div className="jumbotron text-center">
            <h2>Loading...</h2>
          </div>
        ) : (
          this.renderPost(post)
        )}

        <Comment
          postId={post._id}
          comments={comments.reverse()}
          updatedComments={this.updatedComments}
        />
      </div>
    );
  }
}

export default SinglePost;
