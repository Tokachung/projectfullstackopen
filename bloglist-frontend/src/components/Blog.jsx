import { useState } from 'react'

const Blog = ({ blog }) => {

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
    {blog.title} {blog.author}
    <button onClick={toggleVisibility}>view</button>
    {visibleDetails && (
      <div>
      <p>{blog.url}</p>
      <p>{blog.likes}</p>
      </div>
    )}
  </div>  
  ) 
}

export default Blog