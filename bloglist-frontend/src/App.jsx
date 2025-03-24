import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'


const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('a new blog...')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const handleLogin = async (event) => {
    event.preventDefault() // By default, this would cause page to reload due to default for form submission

    try {
      const user = await loginService.login({
        username, password // From the useState variable
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      console.log('user is ', user)
      setUser(user)

      // clear form
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => {
    return (
      <form onSubmit={handleLogin}>
        <div>
          username:
          <input type="text" 
            value={username} 
            name="Username" 
            onChange={({ target }) => setUsername(target.value)}/>
        </div>
        <div>
          password:
          <input type="password" 
          value={password} 
          name="Password"
          onChange={({ target }) => setPassword(target.value)}/>
        </div>
        <button type="submit">login</button>
      </form>
    )
  }

  const handleBlogChange = (event) => {
    console.log(event.target)
    setNewBlog(event.target.value)
  }

  const blogForm = () => {
    return (
    <form>
      <input value={newBlog} 
      onChange={handleBlogChange}/>
      <button type="submit">save</button>
    </form>
    )
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])
  
  return (
    <div>
      <h2>blogs</h2>

      <Notification message={errorMessage} />

      {user === null ? 
        loginForm() : 
        <div>
          <p>{user.name} logged-in</p>
          {blogForm()}
        </div>  
      } 

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App