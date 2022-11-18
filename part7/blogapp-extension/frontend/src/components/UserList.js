import { useSelector } from 'react-redux';
import { BrowserRouter as Router, Link } from 'react-router-dom'; //eslint-disable-line

const UserList = () => {
    const users = useSelector((state) => {
        return state.users;
    });
    const padding = {
        padding: 5,
    };

    return (
        <div>
            <h2> Users </h2>
            <table>
                <tr>
                    <th></th>
                    <th>blogs created</th>
                </tr>
                {users.map((user) => (
                    <tr key={user.id}>
                        <td>
                            <Link style={padding} to={`/users/${user.id}`}>
                                {user.name}
                            </Link>
                        </td>
                        <td>{user.blogs.length}</td>
                    </tr>
                ))}
            </table>
        </div>
    );
};

export default UserList;
