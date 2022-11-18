import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const User = () => {
    const { id } = useParams();
    const user = useSelector((state) => state.users.find((u) => u.id === id));
    if (!user) {
        return null;
    };

    const style = {
        padding: 3,
        margin: 5,
        borderStyle: 'solid',
        borderWidth: 1,
    };
    console.log(user);
    return (
        <div style={style} className="user">
            <h2> {user.name} </h2>
            <h3> added blogs </h3>
            <ul>
                {user.blogs.map( blog => (
                    <li key={blog.id}>
                        {blog.title}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default User;
