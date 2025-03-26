import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {

  const [visibleDetails, setVisibleDetails] = useState(false)
  const [localBlog, setLocalBlog] = useState(blog)

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

  const doSomething = async (blogObject) => { // Added async keyword
  
    let updatedBlogObject = {
      ...blogObject,
      likes: blogObject.likes + 1,
    };
  
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlogObject); // Added await keyword
      setLocalBlog(returnedBlog);
    } catch (error) {
    }
  };


  return (
  
  <div style={blogStyle}>
    {localBlog.title} {localBlog.author}
    <button onClick={toggleVisibility}>view</button>
    {visibleDetails && (
      <div>
      <p>{localBlog.url}</p>
        <div style={{display:'flex', alignItems:'center'}}>
          <p>{localBlog.likes}</p><button onClick={() => doSomething(localBlog)}>LIKE</button>
        </div>
      </div>
    )}
  </div>  
  ) 
}

export default Blog