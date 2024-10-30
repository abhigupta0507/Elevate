// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../components/styles/Community.css";
// import userImg from "../images/user.png";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css"; // Your CSS for styling
// import like from "../images/like.png";
// import unlike from "../images/unlike.svg";
// export default function Community({ isAuthenticated }) {
//   const [posts, setPosts] = useState([]);
//   const [sortType, setSortType] = useState("top");
//   const navigate = useNavigate();
//   //console.log(posts);
//   const notifyInfo = (message, position) => {
//     toast.info(message, {
//       position: position,
//     });
//   };

//   const notifyError = (message, position) => {
//     toast.error(message, {
//       position: position,
//     });
//   };

//   // Fetch all community posts from the API when the component loads
//   useEffect(() => {
//     //const userDetails = JSON.parse(localStorage.getItem("userDetails"));

//     // if (!userDetails) {
//     //   notifyInfo("Log in to create your own post", "bottom-right");
//     // }
//     const token = localStorage.getItem("accessToken");

//     fetch("http://localhost:8000/api/community/posts", {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => setPosts(data))
//       .catch((error) => console.error("Error fetching posts:", error));
//     // fetch("http://localhost:8000/api/community/posts")
//     //   .then((response) => response.json())
//     //   .then((data) => setPosts(data))
//     //   .catch((error) => console.error("Error fetching posts:", error));
//   }, []);

//   const sortedPosts = posts.sort((a, b) => {
//     if (sortType === "top") {
//       return b.likes - a.likes;
//     }
//     return new Date(b.created_at) - new Date(a.created_at);
//   });

//   const handleLike = async (postId) => {
//     try {
//       const token = localStorage.getItem("accessToken");
//       const response = await fetch(
//         `http://localhost:8000/api/community/posts/${postId}/like/`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       if (response.ok) {
//         const data = await response.json();
//         setPosts((prevPosts) =>
//           prevPosts.map((post) =>
//             post.id === postId
//               ? {
//                   ...post,
//                   likes: data.likes,
//                   is_liked_by_user: data.is_liked_by_user,
//                 }
//               : post
//           )
//         );
//       } else {
//         console.error("Error liking post:", response.statusText);
//       }
//     } catch (error) {
//       console.error("An error occurred:", error);
//     }
//   };

//   return (
//     <>
//       <ToastContainer />
//       <div className="community-page">
//         <div className="sort-options">
//           <button onClick={() => setSortType("recent")}>Recent Posts</button>
//           <button onClick={() => setSortType("top")}>Top Posts</button>
//           {
//             <button
//               style={{ backgroundColor: "#4CAF50" }}
//               onClick={() => navigate("/UserPost")}
//             >
//               Your Posts
//             </button>
//           }
//         </div>

//         <div className="posts-container">
//           {sortedPosts.map((post) => (
//             <Post key={post.id} post={post} handleLike={handleLike} />
//           ))}
//         </div>
//       </div>
//     </>
//   );
// }

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../components/styles/Community.css";
import userImg from "../images/user.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import like from "../images/like.png";
import unlike from "../images/unlike.svg";
import { jwtDecode } from "jwt-decode";

function Post({ post, handleLike }) {
  const username =`${post.first_name} ${post.last_name}`;
  return (
    <div className="post">
      <div className="imageusername">
        <img
          src={post.userImage || userImg}
          alt={username}
          className="user-image"
        />
        <p className="post-username">{username}</p>
      </div>

      <div className="post-content">
        <div className="post-date-and-content">
          <h3>{post.title}</h3>
          <p className="post-detail" style={{ whiteSpace: "initial" }}>
            {post.content}
          </p>
        </div>

        <div className="post-actions">
          <div>
            <button className="likebutton" onClick={() => handleLike(post.id)}>
              {post.is_liked_by_user ? (
                <img className="likeimage" src={like} alt="liked"></img>
              ) : (
                <img className="unlikeimage" src={unlike} alt="unliked"></img>
              )}
            </button>
            <p>{post.likes}</p>
          </div>

          <p className="date-post">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Community() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuthentication = async () => {
    const accessToken = localStorage.getItem("accessToken");
    const refreshToken = localStorage.getItem("refreshToken");

    if (accessToken) {
      // Decode the token and check its expiration
      const { exp } = jwtDecode(accessToken);
      // console.log(exp*1000);
      // console.log(Date.now());
      //console.log("hi");
      if (Date.now() / 1000 >= exp) {
        console.log("exp");
        // Access token expired, try to refresh
        if (refreshToken) {
          const response = await fetch(
            "http://localhost:8000/api/users/token/refresh/",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ refresh: refreshToken }),
            }
          );

          if (response.ok) {
            const data = await response.json();
            localStorage.setItem("accessToken", data.access);
            //console.log(true);
            setIsAuthenticated(true);
          } else {
            console.log(false);
            // Refresh token expired or invalid, log out
            localStorage.removeItem("accessToken");
            localStorage.removeItem("refreshToken");
            setIsAuthenticated(false);
          }
        }
      } else {
        // Access token is valid
        setIsAuthenticated(true);
      }
    } else {
      setIsAuthenticated(false);
    }
  };
  useEffect(() => {
    checkAuthentication();
  }, []);
  const [posts, setPosts] = useState([]);
  const [sortType, setSortType] = useState("top");
  const navigate = useNavigate();

  const notifyInfo = (message, position) => {
    toast.info(message, { position });
  };

  const notifyError = (message, position) => {
    toast.error(message, {
      position: position,
    });
  };

  useEffect(() => {
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
    await checkAuthentication();
    if (!isAuthenticated) {
      notifyInfo("Login to like posts", "bottom-right");
      return;
    }
    try {
      const token = localStorage.getItem("accessToken");
      const response = await fetch(
        `http://localhost:8000/api/community/posts/${postId}/like/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 401) {
        notifyError("Login to like a post", "bottom-right");
      }

      if (response.ok) {
        const data = await response.json();
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === postId
              ? {
                  ...post,
                  likes: data.likes,
                  is_liked_by_user: data.is_liked_by_user,
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

  async function handleNavigate() {
    await checkAuthentication();
    if (isAuthenticated) navigate("/UserPost");
    else notifyError("Login to create/view your posts", "bottom-right");
  }

  return (
    <>
      <ToastContainer />
      <div className="community-page">
        <div className="sort-options">
          <button onClick={() => setSortType("recent")}>Recent Posts</button>
          <button onClick={() => setSortType("top")}>Top Posts</button>
          <button
            style={{ backgroundColor: "#4CAF50" }}
            onClick={handleNavigate}
          >
            Your Posts
          </button>
        </div>

        <div className="posts-container">
          {sortedPosts.map((post) => (
            <Post key={post.id} post={post} handleLike={handleLike} />
          ))}
        </div>
      </div>
    </>
  );
}

function Post2({ post, handleLike }) {
  const username = `${post.first_name} ${post.last_name}`;
  return (
    <div className="post">
      <div className="imageusername">
        <img
          src={post.userImage || userImg}
          alt={username}
          className="user-image"
        />
        <p className="post-username">{username}</p>
      </div>

      <div className="post-content">
        <h3>{post.title}</h3>
        <p className="post-detail" style={{ whiteSpace: "initial" }}>
          {post.content}
        </p>

        <div className="post-actions">
          <button className="likebutton" onClick={() => handleLike(post.id)}>
            <img src={post.is_liked_by_user ? like : unlike} alt="like" />
          </button>
          <p>{post.likes}</p>
          <p className="date-post">
            {new Date(post.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
}


