import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newAuthor, setNewAuthor] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('')
  const [user, setUser] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

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
    } catch (exception) {
      setErrorMessage('Wrong username or password')
      setSuccessMessage(null)
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const addBlog = (event) => {
    event.preventDefault()

    const blogObject = {
      title: newTitle,
      author: newAuthor,
      url: newUrl
    }

    blogService.create(blogObject).then(returnedBlog => {
      setBlogs(blogs.concat(returnedBlog))
      setNewBlog('')
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

  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value)
  }

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value)
  }

  const handleUrlChange = (event) => {
    console.log(event.target)
    setNewUrl(event.target.value)
  }

  const blogForm = () => {
    return (
    <div>
      <h1>create new</h1>
      <form onSubmit={addBlog}>
        <div>
          title:
          <input value={newTitle} onChange={handleTitleChange}/>
        </div>
        <div>
          author:
          <input value={newAuthor} onChange={handleAuthorChange} />
        </div>
        <div>
          url:
          <input value={newUrl} onChange={handleUrlChange} />
        </div>
        <button type="submit">create</button>
      </form>
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