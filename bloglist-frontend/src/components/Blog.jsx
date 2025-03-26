import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog }) => {

  const [visibleDetails, setVisibleDetails] = useState(false)
  const [localBlog, setLocalBlog] = useState(blog)
  // const user = useUser()

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
    console.log('do something');
    console.log(blogObject);
  
    let updatedBlogObject = {
      ...blogObject,
      likes: blogObject.likes + 1,
    };
  
    console.log('object is', updatedBlogObject);
    // blogService.setToken(user.token);
    // console.log('user token is', user.token);
    console.log('blog is', blog);
  
    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlogObject); // Added await keyword
      setLocalBlog(returnedBlog);
    } catch (error) {
      console.log('could not like blog', error);
      // Potentially add error handling, such as displaying an error message to the user.
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