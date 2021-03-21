import React, { Component } from "react";
import { list } from "./userApi";
import DefaulAvatar from "../images/avatar.jpg";
import { Link } from "react-router-dom";

class Users extends Component {
  constructor() {
    super();
    this.state = {
      users: [],
      page: 1,
    };
  }

  loadUsers = (page) => {
    list(page).then((data) => {
      if (data.error) {
        console.log(data.error);
      } else {
        this.setState({ users: data });
      }
    });
  };

  componentDidMount() {
    this.loadUsers(this.state.page);
  }

  loadMore = (number) => {
    this.setState({ page: this.state.page + number });
    this.loadUsers(this.state.page + number);
  };

  loadLess = (number) => {
    this.setState({ page: this.state.page - number });
    this.loadUsers(this.state.page - number);
  };

  renderUsers = (users) => (
    <div className="row">
      {users.map((user, i) => (
        <div className="card col-md-4" key={i}>
          <img
            style={{ height: "300px", width: "auto" }}
            className="img-thumbnail img-fluid mx-auto d-block"
            src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`}
            onError={(i) => (i.target.src = `${DefaulAvatar}`)}
            alt={user.name}
          />
          <div className="card-body">
            <h5 className="card-title">{user.name}</h5>
            <p className="card-text">{user.email}</p>
            <Link
              to={`/user/${user._id}`}
              className="btn btn-raised btn-primary btn-sm"
            >
              View profile
            </Link>
          </div>
        </div>
      ))}
    </div>
  );

  render() {
    const { users, page } = this.state;
    return (
      <div className="container">
        <h2 className="mt-5 mb-5">Users</h2>

        {this.renderUsers(users)}

        {page > 1 ? (
          <button
            className="btn btn-raised btn-warning mr-5 mt-5 mb-5"
            onClick={() => this.loadLess(1)}
          >
            Previous ({this.state.page - 1})
          </button>
        ) : (
          ""
        )}

        {users.length ? (
          <button
            className="btn btn-raised btn-success mt-5 mb-5"
            onClick={() => this.loadMore(1)}
          >
            Next ({page + 1})
          </button>
        ) : (
          <h4 className="text-warning">No More Users</h4>
        )}
      </div>
    );
  }
}

export default Users;
