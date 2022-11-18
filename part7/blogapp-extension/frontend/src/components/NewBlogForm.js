import { connect } from 'react-redux';
import { createBlog } from '../reducers/blogReducer';
import { setNotification } from '../reducers/notificationReducer';

const NewBlogForm = (props) => {
    const addBlog = async (event) => {
        event.preventDefault();
        const title = event.target.title.value;
        const author = event.target.author.value;
        const url = event.target.url.value;
        event.target.title.value = '';
        event.target.author.value = '';
        event.target.url.value = '';
        props.createBlog({ title, author, url });
        props.setNotification(`added new blog '${title}' by ${author}`, 5);
    };

    return (
        <div>
            <h2>Create new</h2>

            <form onSubmit={addBlog}>
                <div>
                    title
                    <input name="title" placeholder="title of the blog" />
                </div>
                <div>
                    author
                    <input name="author" placeholder="author of the blog" />
                </div>
                <div>
                    url
                    <input name="url" placeholder="url of the blog" />
                </div>
                <button id="create-button" type="submit">
                    create
                </button>
            </form>
        </div>
    );
};

export default connect(null, { createBlog, setNotification })(NewBlogForm);
