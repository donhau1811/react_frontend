import React, { Component } from "react";
import Posts from "../post/Posts";
import Users from "../user/Users";
import { isAuthenticated } from "../auth";
import { Redirect } from "react-router-dom";

class Admin extends Component {
  state = {
    redirectToHome: false,
  };

  componentDidMount() {
    if (isAuthenticated().user.role !== "admin") {
      this.setState({ redirectToHome: true });
    }
  }

  render() {
    if (this.state.redirectToHome) {
      return <Redirect to="/" />;
    }

    return (
      <div>
        <div
          className="jumbotron"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1605184861733-be9f5814095e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=641&q=80")`,
          }}
        >
          <h2 style={{ textAlign: "center" }}>Admin Dashboard</h2>
        </div>
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-6" style={{ backgroundColor: "#ffcccc" }}>
              <hr />
              <Posts />
            </div>
            <div className="col-md-6" style={{ backgroundColor: "#ffcccc" }}>
              <hr />
              <Users />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Admin;
