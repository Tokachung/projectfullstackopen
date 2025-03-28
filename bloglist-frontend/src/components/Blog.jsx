import { useState } from 'react'

const Blog = ({ blog, removeBlog, likeBlog }) => {

  const [visibleDetails, setVisibleDetails] = useState(false)

  const toggleVisibility = () => {
    setVisibleDetails(!visibleDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <p>Title: {blog.title}</p>
      <p>Author: {blog.author}</p>
      <p>Upload: {blog.user.name}</p>

      <button onClick={toggleVisibility}>view</button>
      {visibleDetails && (
        <div>
          <p>{blog.url}</p>
          <div style={{ display:'flex', alignItems:'center' }}>
            <p>{blog.likes}</p><button onClick={() => likeBlog(blog)}>Like</button>
            <button onClick={() => removeBlog(blog.id)}>Remove</button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Blog