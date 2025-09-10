import { useState } from "react";

const Blog = ({ blog, removeBlog, likeBlog, currentUser }) => {
  const [visibleDetails, setVisibleDetails] = useState(false);

  const toggleVisibility = () => {
    setVisibleDetails(!visibleDetails);
  };

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: "solid",
    borderWidth: 1,
    marginBottom: 5,
  };

  console.log("current", currentUser);
  console.log("users", blog);

  return (
    <div data-testid="blog" style={blogStyle}>
      <p data-testid="blog-title">Title: {blog.title}</p>
      <p data-testid="blog-author">Author: {blog.author}</p>
      <p data-testid="blog-upload">Upload: {blog.user.name}</p>

      <button onClick={toggleVisibility}>view</button>
      {visibleDetails && (
        <div>
          <p data-testid="blog-url">{blog.url}</p>
          <div style={{ display: "flex", alignItems: "center" }}>
            <p data-testid="blog-likes">{blog.likes}</p>
            <button onClick={() => likeBlog(blog)}>Like</button>
            {currentUser.username === blog.user.username && (
              <button onClick={() => removeBlog(blog.id)}>Remove</button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
