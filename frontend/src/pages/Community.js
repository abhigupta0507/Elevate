// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../components/styles/Community.css"; // Your CSS for styling

// export default function Community({ isAuthenticated }) {
//   const [posts, setPosts] = useState([]);
//   const [sortType, setSortType] = useState("top");
//   const navigate = useNavigate();
//   console.log(posts);

//   // Fetch all community posts from the API when the component loads
//   useEffect(() => {
//     console.log("trying");
//     fetch("http://localhost:8000/api/community/posts")
//       .then((response) => response.json())
//       .then((data) => setPosts(data))
//       .catch((error) => console.error("Error fetching posts:", error));
//   }, []);

//   const sortedPosts = posts.sort((a, b) => {
//     if (sortType === "top") {
//       return b.likes - a.likes;
//     }
//     return new Date(b.created_at) - new Date(a.created_at);
//   });

//   const handleLike = async (id) => {
//     const response = await fetch(
//       `http://localhost:8000/api/community/posts/${id}/like/`,
//       {
//         method: "PATCH",
//       }
//     );

//     if (response.ok) {
//       const data = await response.json();
//       setPosts((prevPosts) =>
//         prevPosts.map((post) =>
//           post.id === id
//             ? {
//                 ...post,
//                 likes: data.total_likes,
//                 is_liked_by_user: data.is_liked,
//               }
//             : post
//         )
//       );
//     }
//   };

//   // const handleLike = (id) => {
//   //   fetch(`http://localhost:8000/api/community/posts/${id}/like/`, {
//   //     method: "PATCH",
//   //     headers: {
//   //       "Content-Type": "application/json",
//   //     },
//   //   })
//   //     .then((response) => response.json())
//   //     .then((data) => {
//   //       setPosts(
//   //         posts.map((post) =>
//   //           post.id === id
//   //             ? {
//   //                 ...post,
//   //                 likes: post.is_liked_by_user
//   //                   ? post.likes - 1
//   //                   : post.likes + 1,
//   //                 is_liked_by_user: !post.is_liked_by_user,
//   //               }
//   //             : post
//   //         )
//   //       );
//   //     })
//   //     .catch((error) => console.error("Error toggling like:", error));
//   // };

//   return (
//     <div className="community-page">
//       <div className="sort-options">
//         <button onClick={() => setSortType("recent")}>Recent Posts</button>
//         <button onClick={() => setSortType("top")}>Top Posts</button>
//         {isAuthenticated && (
//           <button
//             style={{ backgroundColor: "#4CAF50" }}
//             onClick={() => navigate("/UserPost")}
//           >
//             Your Posts
//           </button>
//         )}
//       </div>

//       <div className="posts-container">
//         {sortedPosts.map((post) => (
//           <Post key={post.id} post={post} handleLike={handleLike} />
//         ))}
//       </div>
//     </div>
//   );
// }

// function Post({ post, handleLike }) {
//   return (
//     <div className="post">
//       <img
//         src={post.userImage || "/defaultImage.png"}
//         alt={post.username}
//         className="user-image"
//       />
//       <div className="post-content">
//         <div className="post-date-and-title">
//           <h3>{post.title}</h3>
//           <p>{new Date(post.created_at).toLocaleDateString()}</p>
//         </div>
//         <p className="post-username">by {post.username}</p>
//         <p className="post-detail" style={{ whiteSpace: "initial" }}>
//           {post.content}
//         </p>
//         <div className="post-actions">
//           <button onClick={() => handleLike(post.id)}>
//             {post.is_liked_by_user ? "👎 Unlike" : "👍 Like"} {post.likes}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Community.css"; // Your CSS for styling

export default function Community({ isAuthenticated }) {
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState("top");
  const navigate = useNavigate();
  // console.log(posts);

  // Fetch all community posts from the API when the component loads
  useEffect(() => {
    //console.log("trying");
    fetch("http://localhost:8000/api/community/posts")
      .then((response) => response.json())
      .then((data) => setPosts(data))
      .catch((error) => console.error("Error fetching posts:", error));
  }, []);

  const sortedPosts = posts.sort((a, b) => {
    if (sortType === "top") {
      return b.likes - a.likes;
    }
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const handleLike = async (postId) => {
    const userDetails = JSON.parse(localStorage.getItem("userDetails"));
    const userId = userDetails?.id; // Assuming the user ID is stored in userDetails

    if (!userId) {
      alert("You need to login first to like/dislike!!");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:8000/api/community/posts/${postId}/like/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId }), // Pass user_id in the request body
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: data.likes,
                  is_liked_by_user: data.is_liked_by_user, // Assuming your API returns if the user has liked it
                }
              : post
          )
        );
      } else {
        console.error("Error liking post:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div className="community-page">
      <div className="sort-options">
        <button onClick={() => setSortType("recent")}>Recent Posts</button>
        <button onClick={() => setSortType("top")}>Top Posts</button>
        {isAuthenticated && (
          <button
            style={{ backgroundColor: "#4CAF50" }}
            onClick={() => navigate("/UserPost")}
          >
            Your Posts
          </button>
        )}
      </div>

      <div className="posts-container">
        {sortedPosts.map((post) => (
          <Post key={post.id} post={post} handleLike={handleLike} />
        ))}
      </div>
    </div>
  );
}

function Post({ post, handleLike }) {
  return (
    <div className="post">
      <img
        src={post.userImage || "/defaultImage.png"}
        alt={post.username}
        className="user-image"
      />
      <div className="post-content">
        <div className="post-date-and-title">
          <h3>{post.title}</h3>
          <p>{new Date(post.created_at).toLocaleDateString()}</p>
        </div>
        <p className="post-username">by {post.username}</p>
        <p className="post-detail" style={{ whiteSpace: "initial" }}>
          {post.content}
        </p>
        <div className="post-actions">
          <button onClick={() => handleLike(post.id)}>
            {post.is_liked_by_user ? "👎 Unlike" : "👍 Like"} {post.likes}
          </button>
        </div>
      </div>
    </div>
  );
}
