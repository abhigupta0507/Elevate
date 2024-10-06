import React, { useState, useEffect } from "react";
import "../components/styles/UserPost.css"; // Your CSS for styling

export default function UserPost() {
  const [userPosts, setUserPosts] = useState([]);
  const [newPost, setNewPost] = useState({
    title: "",
    content: "",
    user_id: JSON.parse(localStorage.getItem("userDetails")).id,
  });

  // Fetch user posts from the API when the component loads
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userDetails"));
    // console.log(user);
    const userId = user.id;
    fetch(`http://localhost:8000/api/community/posts/${userId}/`)
      .then((response) => response.json())
      .then((data) => setUserPosts(data))
      .catch((error) => console.error("Error fetching user posts:", error));
  }, []);

  const handleNewPost = () => {
    const postData = {
      title: newPost.title,
      content: newPost.content,
      user_id: JSON.parse(localStorage.getItem("userDetails")).id, // Send user_id from localStorage
    };

    fetch("http://localhost:8000/api/community/posts/create/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(postData), // Include user_id in the post data
    })
      .then((response) => response.json())
      .then((data) => {
        setUserPosts([data, ...userPosts]); // Add new post to the list
        setNewPost({
          title: "",
          content: "",
          user_id: JSON.parse(localStorage.getItem("userDetails")).id, // Reset form
        });
      })
      .catch((error) => console.error("Error creating post:", error));
  };

  const handleLike = (id) => {
    fetch(`http://localhost:8000/api/community/posts/${id}/like/`, {
      method: "PATCH",
    })
      .then((response) => {
        if (response.ok) {
          setUserPosts(
            userPosts.map((post) =>
              post.id === id ? { ...post, likes: post.likes + 1 } : post
            )
          );
        }
      })
      .catch((error) => console.error("Error liking post:", error));
  };

  return (
    <div className="user-posts-page">
      <div className="create-post-section">
        <h1>Create a Post</h1>
        <input
          type="text"
          placeholder="Title"
          value={newPost.title}
          onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          className="post-title-input"
        />
        <textarea
          placeholder="Content"
          value={newPost.content}
          onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          className="post-content-textarea"
        />
        <button onClick={handleNewPost} className="submit-post-button">
          Submit
        </button>
      </div>

      <div className="user-posts-section-container">
        <div className="user-posts-section">
          <h1>Your Previous Posts</h1>
          <div className="posts-container">
            {userPosts.length > 0 ? (
              userPosts.map((post) => (
                <Post key={post.id} post={post} handleLike={handleLike} />
              ))
            ) : (
              <p>You have not made any posts yet.</p>
            )}
          </div>
        </div>
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
        <p className="post-detail">{post.content}</p>
        <div className="post-actions">
          <button onClick={() => handleLike(post.id)}>👍 {post.likes}</button>
        </div>
      </div>
    </div>
  );
}
