import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Link } from 'react-router-dom'; //eslint-disable-line

const BlogList = () => {
    const blogs = useSelector((state) => {
        return [...state.blogs].sort((a, b) => (b.likes > a.likes ? 1 : -1));
    });

    const padding = {
        padding: 5,
    };

    return (
        <div>
            <table>
                {blogs.map((blog) => (
                    <tr key= {blog.id}>
                        <td>
                            <Link style={padding} to={`/blogs/${blog.id}`}>
                                {blog.title} by {blog.author}
                            </Link>
                        </td>
                    </tr>
                ))}
            </table>

        </div>
    );
};

export default BlogList;
