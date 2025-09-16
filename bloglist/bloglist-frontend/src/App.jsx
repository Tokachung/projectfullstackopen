import { useState, useEffect, useRef, useReducer } from "react";
import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Notification from "./components/Notification";
import LoginForm from "./components/LoginForm";
import Togglable from "./components/Togglable";
import BlogForm from "./components/BlogForm";

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  // const [errorMessage, setErrorMessage] = useState(null);
  // const [successMessage, setSuccessMessage] = useState(null);

  function messageReducer(state, action) {
    switch (action.type) {
      case "SUCCESS":
        return {
          type: action.type,
          text: action.text
        }
      
        case 'ERROR': {
          return {
            type: action.type.toLowerCase(),
            text: action.text ?? 'Wrong username or password'
          }

        }

        case 'CLEAR': {
          return {
            type: null,
            text: null
          }
        }
        default:
          return state;
    }
  }

  function blogReducer(state, action) {
    switch (action.type) {
      case "SET":
        return action.blogs ?? [];
      
      case "ADD": {
        return state.concat(action.blog)
      }

      case "REMOVE": {
        return state.filter((blog) => blog.id !== action.id)
      }

      case "LIKE": {
        return state.map((blog) => blog.id === action.likedBlog.id ? { ...action.likedBlog } : blog)
      }

      case "FILTER":
        return [...state].sort((a, b) => b.likes - a.likes);
      }   
  }

  
  const [message, dispatchMessage] = useReducer(messageReducer, { type: null, text: null })
  const [blog, dispatchBlog] = useReducer(blogReducer, { type:null })

  const blogFormRef = useRef();

  // const sortBlogs = (blogs) => {
  //   const blogsCopy = [...blogs];
  //   return blogsCopy.sort((a, b) => b.likes - a.likes);
  // };

  const handleLogin = async (event) => {
    event.preventDefault(); // By default, this would cause page to reload due to default for form submission
    try {
      const user = await loginService.login({
        username,
        password, // From the useState variable
      });

      window.localStorage.setItem("loggedBlogappUser", JSON.stringify(user));

      blogService.setToken(user.token);

      setUser(user);
      blogService.getAllBlogs().then((blogs) => {
        dispatchBlog({type: 'SET', blogs: blogs});
        console.log("blogs are", blogs);
      });
      
      console.log("set user is, ", user);

      setUsername("");
      setPassword("");
    } catch (exception) {
      dispatchMessage({ type: 'ERROR' })
      setTimeout(() => {
        dispatchMessage( { type: 'CLEAR' })
      }, 5000);
    }
  };

  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility();
    blogService.createBlog(blogObject).then((returnedBlog) => {
      //setBlogs(blogs.concat(returnedBlog));
      dispatchBlog({type: 'ADD', blog: returnedBlog})
      dispatchMessage({
        type: 'SUCCESS',
        text: `a new blog ${returnedBlog.title} by ${user.name} added`,
      });
      setTimeout(() => dispatchMessage({ type: 'CLEAR' }), 4000);
    });
  };

  const handleLogout = async (event) => {
    event.preventDefault();
    blogService.setToken(null);
    setUser(null);

    window.localStorage.removeItem("loggedBlogappUser");

    //setBlogs([]);
    dispatchBlog({type: 'SET'})
    blogService.setToken(null);

    dispatchMessage({
        type: 'SUCCESS',
        text: `Log out successful`,
    });

    setTimeout(() => dispatchMessage({ type: 'CLEAR' }), 3000);

  };

  const loginForm = () => {
    return (
      <Togglable buttonLabel="login">
        <LoginForm
          handleSubmit={handleLogin}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          username={username}
          password={password}
        />
      </Togglable>
    );
  };

  const blogForm = () => {
    return (
      <div>
        <Togglable buttonLabel="new blog" ref={blogFormRef}>
          <BlogForm createBlog={addBlog}></BlogForm>
        </Togglable>
      </div>
    );
  };

  useEffect(() => {
    if (!user) {
      dispatchMessage({
        type: 'ERROR',
        text: "Please log in to view the blogs",
      });
      setTimeout(() => dispatchMessage({ type: 'CLEAR' }), 5000);
    } else {
      blogService
        .getAllBlogs()
        .then((blogs) => dispatchBlogs({type: 'FILTER'}))//setBlogs(sortBlogs(blogs))
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            dispatchMessage({
              type: 'ERROR',
              text: "Please log in to view the blogs",
            });
          } else {
            dispatchMessage({
              type: 'ERROR',
              text: "Failed to fetch blogs",
            });
          }
          setTimeout(() => dispatchMessage({ type: 'CLEAR' }), 5000);
        });
    }
  }, [user]);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogappUser");

    if (loggedUserJSON) {
      try {
        const user = JSON.parse(loggedUserJSON);
        setUser(user);
        blogService.setToken(user.token);
      } catch (error) {
        console.error(
          "Could not correctly parse user from local storage",
          error,
        );
        setUser(null);
        blogService.setToken(null);
      }
    } else {
      setUser(null);
      blogService.setToken(null);
    }
  }, []);

  const removeBlog = async (blogId) => {
    let userResponse = confirm("Are you sure you want to do this bro?");
    console.log("user response is, ", userResponse);
    if (userResponse) {
      try {
        await blogService.deleteBlog(blogId);
        
        // setBlogs(blogs.filter((blog) => blog.id !== blogId));
        dispatchBlog({type: 'REMOVE', id: blog.id})
      } catch (error) {
        console.log("error is", error);
      }
    }
  };

  const likeBlog = async (blogObject) => {
    // Added async keyword
    let updatedBlogObject = {
      ...blogObject,
      likes: blogObject.likes + 1,
    };

    try {
      const returnedBlog = await blogService.updateBlog(
        blogObject.id,
        updatedBlogObject,
      ); // Added await keyword
      // setBlogs((prevBlogs) =>
      //   prevBlogs.map((blog) =>
      //     blog.id === returnedBlog.id ? { ...returnedBlog } : blog,
      //   ),
      // );
      dispatchBlog({type: 'LIKE', likedBlog: updatedBlogObject})
    } catch (error) {
      console.log("error is", error);
    }

    console.log("like button clicked");
  };

  return (
    <div>
      <h2>blogs</h2>

      <Notification message={message.text} type={message.type} />
      {/* <Notification message={message} type="success" /> */}

      {user === null ? (
        loginForm()
      ) : (
        <div>
          <p>{user.name} logged-in</p>
          <button onClick={handleLogout}>Log out</button>
          {blogForm()}
        </div>
      )}

      {blogs.map((blog) => (
        <Blog
          currentUser={user}
          removeBlog={removeBlog}
          likeBlog={likeBlog}
          key={blog.id}
          blog={blog}
        />
      ))}
    </div>
  );
};

export default App;
