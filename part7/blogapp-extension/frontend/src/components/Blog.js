import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { likeBlog, removeBlog, commentBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';
import userService from '../services/user';

const Blog = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const blog = useSelector((state) => state.blogs.find((b) => b.id === id));
    if (!blog) {
        return null;
    };
    const user = userService.getUser();

    const handleLike = (blog) => {
        dispatch(likeBlog(blog));
        dispatch(setNotification(`liked '${blog.title}'`, 5));
    };

    const handleRemove = (blog) => {
        const ok = window.confirm(`remove '${blog.title}' by ${blog.author}?`);
        if (!ok) {
            return;
        }
        dispatch(removeBlog(blog.id));
        dispatch(setNotification(`'${blog.title}' removed`, 5));
    };

    const handleComment = (event) => {
        event.preventDefault();
        const comment = event.target.comment.value;
        event.target.comment.value = '';
        dispatch(commentBlog(blog.id, comment));
    };

    const addedBy = blog.user && blog.user.name ? blog.user.name : 'anonymous';
    const own = blog.user && user.username === blog.user.username;

    const style = {
        padding: 3,
        margin: 5,
        borderStyle: 'solid',
        borderWidth: 1,
    };
    return (
        <div style={style} className="blog">
            {blog.title} {blog.author}
            <div>
                <div>
                    <a href={blog.url}>{blog.url}</a>
                </div>
                <div>
                    {blog.likes} likes{' '}
                    <button onClick={() => handleLike(blog)}>like</button>
                </div>
                added by {addedBy}
                {own && <button onClick={() => handleRemove(blog)}>remove</button>}
            </div>
            <h3> comments </h3>
            <form onSubmit={handleComment}>
                <div>
                    <input name="comment" />
                    <button id="create-button" type="submit">
                        comment
                    </button>
                </div>
            </form>

            <ul>
                {blog.comments && blog.comments.map(comment => (
                    <li key={comment}> {comment} </li>
                ))}
            </ul>
        </div>
    );
};

export default Blog;
