import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Blog from './components/Blog'
import Notification from './components/Notification'
import ErrorNotification from './components/ErrorNotification'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'


const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)
    const [notification,setNotification] = useState(null)
    const [errorNotification,setErrorNotification] = useState(null)
    const blogFormRef = useRef()


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

    const addBlog = async (blogObject) => {
        blogFormRef.current.toggleVisibility()
        blogObject['user'] = user.id
        blogService
            .addBlog(blogObject)
            .then( createdBlog => {
                setBlogs(blogs.concat(createdBlog))
                showNotification(`new blog ${blogObject.title} by ${blogObject.author} added`)
            })
            .catch((err) => {
                showErrorNotification('adding new blog failed', err)
            })

    }

    const addLike = (blog, likes) => {
        blogService.addLike(blog, likes)
        const updatedBlogs = blogs.map((currentBlog) =>
            currentBlog.id === blog.id
                ? { ...currentBlog, likes: currentBlog.likes + 1 }
                : currentBlog
        )
        setBlogs(updatedBlogs)
    }

    const handleRemove = (blog) => {
        if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)){
            blogService.remove(blog)
            const updatedBlogs = blogs.filter((currentBlog) => currentBlog.id !== blog.id)
            setBlogs(updatedBlogs)
        }
    }

    const handleLogin = async (event) => {
        event.preventDefault()
        console.log('logging in with', username, password)
        try {
            const user = await loginService.login({
                username, password,
            })
            setUser(user)
            blogService.setToken(user.token)
            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )
            setUsername('')
            setPassword('')
            showNotification(`Welcome ${user.name}`)

        } catch (exception) {
            showErrorNotification('wrong credentials')
        }

    }

    const handleLogout = async (event) => {
        event.preventDefault()
        console.log('logging out with', user.name)
        try {
            await loginService.logout()
            setUser(null)
            setUsername('')
            setPassword('')
            showNotification('Logged out')
        } catch (exception) {
            showErrorNotification('logout failed')
        }

    }

    const showErrorNotification = (message) => {
        setErrorNotification(message)
        setTimeout(() => {
            setErrorNotification(null)
        }, 2000)
    }

    const showNotification = (message) => {
        setNotification(message)
        setTimeout(() => {
            setNotification(null)
        }, 2000)
    }

    const loginView = () => (
        <div>
            <h2>Login to application</h2>
            <LoginForm
                username={username}
                password={password}
                handleUsernameChange={({ target }) => setUsername(target.value)}
                handlePasswordChange={({ target }) => setPassword(target.value)}
                handleSubmit={handleLogin}
            />
        </div>
    )

    const blogView = () => {
        blogs.sort((a, b) => b.likes - a.likes)
        return   (
            <div>
                <h2>blogs</h2>
                <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>
                <div>
                    <Togglable buttonLabel="create new blog"  ref={blogFormRef}>
                        <BlogForm
                            createBlog={addBlog}
                        />
                    </Togglable>
                </div>

                {blogs.map((blog) =>
                    <Blog key={blog.id}
                        username={user.name}
                        blog={blog}
                        handleLike={addLike}
                        handleRemove={handleRemove}
                    />
                )}
            </div>)}

    return (
        <div>
            <Notification message={notification} />
            <ErrorNotification message={errorNotification} />
            {user === null ?
                loginView() :
                blogView()
            }
        </div>
    )
}

export default App
