import React, { Component } from "react";
import { Redirect, Link } from "react-router-dom";
import { isAuthenticated } from "../auth";
import { read } from "./userApi";
import DefaulAvatar from "../images/avatar.jpg";
import DeleteUser from "./DeleteUser";
import FollowProfile from "./FollowProfile";
import FollowList from "./FollowList";
import { postByUser } from "../post/postApi";

class Profile extends Component {
  constructor() {
    super();
    this.state = {
      user: { following: [], followers: [] },
      redirectToSignin: false,
      following: false,
      error: "",
      posts: [],
    };
  }

  //check follow
  checkFollow = (user) => {
    const jwt = isAuthenticated();
    const match = user.followers.find((follower) => {
      //one id has many other ids (followers) and vice versa
      return follower._id === jwt.user._id;
    });
    return match;
  };

  clickFollowBtn = (apiCall) => {
    const userId = isAuthenticated().user._id;
    const token = isAuthenticated().token;

    apiCall(userId, token, this.state.user._id).then((data) => {
      if (data.error) {
        this.setState({ error: data.error });
      } else {
        this.setState({ user: data, following: !this.state.following });
      }
    });
  };

  init = (userId) => {
    const token = isAuthenticated().token;
    read(userId, token).then((data) => {
      if (data.error) {
        this.setState({ redirectToSignin: true });
      } else {
        let following = this.checkFollow(data);
        this.setState({ user: data, following });
        this.loadPosts(data._id);
      }
    });
  };

  loadPosts = (userId) => {
    const token = isAuthenticated().token;
    postByUser(userId, token).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ posts: data });
      }
    });
  };

  componentDidMount() {
    const userId = this.props.match.params.userId;
    this.init(userId);
  }

  UNSAFE_componentWillReceiveProps(props) {
    const userId = props.match.params.userId;
    this.init(userId);
  }

  render() {
    const { redirectToSignin, user, posts } = this.state;
    if (redirectToSignin) return <Redirect to="/signin" />;

    const photoUrl = user._id
      ? `${process.env.REACT_APP_API_URL}/user/photo/${
          user._id
        }?${new Date().getTime()}`
      : DefaulAvatar;

    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Profile</h2>

        <div className="row">
          <div className="col-md-4">
            <img
              style={{ height: "300px", width: "auto" }}
              className="img-thumbnail img-fluid mx-auto d-block"
              src={photoUrl}
              onError={(i) => (i.target.src = `${DefaulAvatar}`)}
              alt={user.name}
            />
          </div>

          <div className="col-md-8">
            <div className="lead mt-2">
              <p>{user.name}</p>
              <p>{user.email}</p>
              <p>{`Joined ${new Date(user.created).toDateString()}`}</p>
            </div>
            {(isAuthenticated().user &&
              isAuthenticated().user._id === user._id) ||
            isAuthenticated().user.role === "admin" ? (
              <div className="d-inline-block">
                <Link
                  className="btn btn-raised btn-info mr-5"
                  to={`/post/create`}
                >
                  Create a post
                </Link>
                <Link
                  className="btn btn-raised btn-success mr-5"
                  to={`/user/edit/${user._id}`}
                >
                  Edit profile
                </Link>
                <DeleteUser userId={user._id} />
              </div>
            ) : (
              <FollowProfile
                following={this.state.following}
                onButtonClick={this.clickFollowBtn}
              />
            )}

            <div>
              {isAuthenticated().user &&
                isAuthenticated().user.role === "admin" && (
                  <div class="card mt-5">
                    <div className="card-body">
                      <h5 className="card-title">Admin</h5>
                      <p className="mb-2 text-danger">
                        Edit/Delete as an Admin
                      </p>
                      <Link
                        className="btn btn-raised btn-success mr-5"
                        to={`/user/edit/${user._id}`}
                      >
                        Edit Profile
                      </Link>
                      <DeleteUser userId={user._id} />
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col md-12 mt-5 mb-5">
            <hr />
            <p className="lead">{user.about}</p>
            <hr />
            <FollowList
              followers={user.followers}
              following={user.following}
              posts={posts}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default Profile;
