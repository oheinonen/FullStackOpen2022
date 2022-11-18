import { logout } from '../reducers/loginReducer';
import { setNotification } from '../reducers/notificationReducer';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Link, useNavigate } from 'react-router-dom'; //eslint-disable-line

const NavBar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const user = useSelector((state) => state.login);

    const handleLogout = () => {
        dispatch(logout());
        dispatch(setNotification('good bye!', 5));
        navigate('/');
    };

    const padding = {
        padding: 5
    };

    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        background:'lightgrey'
    };


    return (
        <div>
            <div style={style} >
                <Link style={padding} to={'/'}> home </Link>
                <Link style={padding} to={'/users'}> users </Link> {user.name} logged in <button onClick={() => handleLogout()}>logout</button>
            </div>
        </div>
    );
};

export default NavBar;