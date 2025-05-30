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
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  const blogFormRef = useRef()

  const sortBlogs = (blogs) => {
    const blogsCopy = [...blogs]
    return blogsCopy.sort((a, b) => b.likes - a.likes)
  }

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
      blogService.getAllBlogs().then(blogs => {
        setBlogs(blogs)
        console.log('blogs are', blogs)
      })

      console.log('set user is, ', user)

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
    blogService.createBlog(blogObject).then(returnedBlog => {
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
    if (!user) {
      setErrorMessage('Please log in to view the blogs')
      setSuccessMessage(null)
    } else {
      blogService.getAllBlogs().then(blogs =>
        setBlogs(sortBlogs(blogs))

      ) .catch(error => {
        if (error.response && error.response.status === 401) {
          setErrorMessage('Please log in to view the blogs')
          setSuccessMessage(null)

        } else {
          setErrorMessage('Failed to fetch blogs.')
          setSuccessMessage(null)
        }
      })
    }

  }, [user])


  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')

    if (loggedUserJSON) {
      try {

        const user = JSON.parse(loggedUserJSON)
        setUser(user)
        blogService.setToken(user.token)
      } catch (error) {
        console.error('Could not correctly parse user from local storage', error)
        setUser(null)
        blogService.setToken(null)
      }
    } else {
      setUser(null)
      blogService.setToken(null)
    }
  }, [])

  const removeBlog = async (blogId) => {
    let userResponse = confirm('Are you sure you want to do this bro?')
    console.log('user response is, ', userResponse)
    if (userResponse) {
      try {
        await blogService.deleteBlog(blogId)
        setBlogs(blogs.filter(blog => blog.id !== blogId))
      } catch (error) {
        console.log('error is', error)
      }
    }
  }

  const likeBlog = async (blogObject) => { // Added async keyword
    let updatedBlogObject = {
      ...blogObject,
      likes: blogObject.likes + 1,
    }

    try {
      const returnedBlog = await blogService.updateBlog(blogObject.id, updatedBlogObject) // Added await keyword
      setBlogs(prevBlogs =>
        prevBlogs.map(blog =>
          blog.id === returnedBlog.id ? { ...returnedBlog } : blog
        )
      )
    } catch (error) {
      console.log('error is', error)
    }

    console.log('like button clicked')
  }

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={errorMessage} type="error" />
      <Notification message={successMessage} type="success" />

      {user === null ?
        loginForm() :
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Log out</button>
          {blogForm()}
        </div>
      }

      {blogs.map(blog =>
        <Blog currentUser={user} removeBlog={removeBlog} likeBlog={likeBlog} key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App