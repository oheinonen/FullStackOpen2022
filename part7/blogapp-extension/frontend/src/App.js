import { useEffect, useRef } from 'react';
import BlogList from './components/BlogList';
import LoginForm from './components/LoginForm';
import NewBlogForm from './components/NewBlogForm';
import Notification from './components/Notification';
import User from './components/User';
import Blog from './components/Blog';
import Togglable from './components/Togglable';
import { initializeBlogs } from './reducers/blogReducer';
import { initializeUsers } from './reducers/userReducer';
import { initializeUser } from './reducers/loginReducer';
import { useDispatch, useSelector } from 'react-redux';
import UserList from './components/UserList';
import {
    BrowserRouter as Router, // eslint-disable-line
    Routes,
    Route,
} from 'react-router-dom';
import NavBar from './components/NavBar';

const App = () => {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(initializeBlogs());
        dispatch(initializeUsers());
        dispatch(initializeUser());
    }, [dispatch]);

    const blogFormRef = useRef();
    const user = useSelector((state) => state.login);
    if (user === null) {
        return (
            <>
                <Notification />
                <LoginForm />
            </>
        );
    }

    return (
        <div>
            <NavBar/>
            <h1>Blog App</h1>
            <Notification />

            <Routes>
                <Route path="/blogs/:id" element={<Blog />} />
                <Route path="/users/:id" element={<User />} />
                <Route path="/users" element={<UserList />} />
                <Route
                    path="/"
                    element={
                        <>
                            <Togglable buttonLabel="new blog" ref={blogFormRef}>
                                <NewBlogForm />
                            </Togglable>

                            <div id="blogs">
                                <BlogList />
                            </div>
                        </>
                    }
                />
            </Routes>
        </div>
    );
};

export default App;
