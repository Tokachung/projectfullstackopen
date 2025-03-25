import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState(null) 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

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

      setUser(user)
      blogService.getAll().then(blogs => {
        setBlogs(blogs)
      })

      setUsername('')
      setPassword('')
      setErrorMessage(null)
      setSuccessMessage(null)
      
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setSuccessMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setSuccessMessage(`a new blog ${returnedBlog.title} by ${user.name} added`)
      setErrorMessage(null)
    })
  }

  const handleLogout = async (event) => {
    event.preventDefault()
    blogService.setToken(null)
    setUser(null)

    window.localStorage.removeItem('loggedBlogappUser')

    setBlogs([])
    blogService.setToken(null)

    setSuccessMessage('Log out successful.')
    setErrorMessage(null)
  }

  const loginForm = () => {

    return (
      <Togglable buttonLabel='login'>
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable>
    )
  }

  const blogForm = () => {
    return (
    <div>
      <Togglable buttonLabel='new blog' ref={blogFormRef}>
        <BlogForm createBlog={addBlog}></BlogForm>
      </Togglable>
    </div>
    )
  }

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs)
    ) .catch(error => {
      if (error.response && error.response.status === 401) {
        setErrorMessage("Please log in to view the blogs")
        setSuccessMessage(null)

      } else {
        setErrorMessage('Failed to fetch blogs.')
        setSuccessMessage(null)
      }
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    console.log('loggedUserJSON', loggedUserJSON)
    if (loggedUserJSON && loggedUserJSON !== null) {
      try {
          
        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      } catch (error) {
        console.error("Could not correctly parse user from local storage", error);
        setUser(null)
        blogService.setToken(null)
      }
    } else {
      setUser(null)
      blogService.setToken(null)
    }
  }, [])

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={errorMessage} type="success" />
      <Notification message={successMessage} type="error" />

      {user === null ? 
        loginForm() : 
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Log out</button>
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