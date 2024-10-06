import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Community.css"; // Your CSS for styling

export default function Community() {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState("top");
  const navigate = useNavigate();
  console.log(posts);

  // Fetch all community posts from the API when the component loads
  useEffect(() => {
    console.log("trying");
    fetch("http://localhost:8000/api/community/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .then(console.log(posts))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const sortedPosts = posts.sort((a, b) => {
    if (sortType === "top") {
      return b.likes - a.likes;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleLike = (id) => {
    fetch(`http://localhost:8000/api/community/posts/${id}/like/`, {
      method: "PATCH",
    })
      .then((response) => {
        if (response.ok) {
          setPosts(
            posts.map((post) =>
              post.id === id ? { ...post, likes: post.likes + 1 } : post
            )
          );
        }
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  return (
    <div className="community-page">
      <div className="sort-options">
        <button onClick={() => setSortType("recent")}>Recent Posts</button>
        <button onClick={() => setSortType("top")}>Top Posts</button>
        <button
          style={{ backgroundColor: "#4CAF50" }}
          onClick={() => navigate("/UserPost")}
        >
          Your Posts
        </button>
      </div>

      <div className="posts-container">
        {sortedPosts.map((post) => (
          <Post
            key={post.id}
            post={post}
            handleLike={handleLike}
          />
        ))}
      </div>
    </div>
  );
}

function Post({ post, handleLike }) {
  return (
    <div className="post">
      <img src={post.userImage} alt={post.username} className="user-image" />
      <div className="post-content">
        <div className="post-date-and-title">
          <h3>{post.title}</h3>
          <p>{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
        <p className="post-username">by {post.username}</p>
        <p className="post-detail">{post.content}</p>
        <div className="post-actions">
          <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
        </div>
      </div>
    </div>
  );
}
