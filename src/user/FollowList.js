import React, { Component } from "react";
import { Link } from "react-router-dom";
import DefaulAvatar from "../images/avatar.jpg";

class FollowList extends Component {
  render() {
    const { following, followers, posts } = this.props;
    return (
      <div>
        <div className="row ">
          <div className="col-md-4">
            <h3 style={{ backgroundColor: "#ffcccc" }}>Followers</h3>
            <hr />
            {followers.map((person, i) => (
              <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      style={{ borderRadius: "50%", border: "1px solid black" }}
                      className="float-left mr-2"
                      height="30px"
                      width="30px"
                      onError={(i) => (i.target.src = `${DefaulAvatar}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                      alt="person.name"
                    />
                    <div>
                      <p className="lead">{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h3 style={{ backgroundColor: "#ffcccc" }}>Following</h3>
            <hr />
            {following.map((person, i) => (
              <div key={i}>
                <div>
                  <Link to={`/user/${person._id}`}>
                    <img
                      className="float-left mr-2"
                      style={{ borderRadius: "50%", border: "1px solid black" }}
                      width="30px"
                      height="30px"
                      onError={(i) => (i.target.src = `${DefaulAvatar}`)}
                      src={`${process.env.REACT_APP_API_URL}/user/photo/${person._id}`}
                      alt="person.name"
                    />
                    <div>
                      <p className="lead">{person.name}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <h4 style={{ backgroundColor: "#ffcccc" }}>Posts</h4>
            <hr />
            {posts.map((post, i) => (
              <div key={i}>
                <div>
                  <Link to={`/post/${post._id}`}>
                    <div>
                      <p className="lead">{post.title.substring(0, 10)}</p>
                    </div>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

export default FollowList;
