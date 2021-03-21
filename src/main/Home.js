import React from "react";
import Posts from "../post/Posts";

const Home = () => (
  <div>
    <div
      className="jumbotron"
      style={{
        backgroundImage: `url("https://images.unsplash.com/photo-1605184861733-be9f5814095e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=641&q=80")`,
      }}
    >
      <h2 style={{ textAlign: "center" }}>
        Welcome to Social Platform
      </h2>
    </div>
    <div className="container">
      <Posts />
    </div>
  </div>
);

export default Home;
