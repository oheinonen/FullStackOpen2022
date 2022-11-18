import { login } from '../reducers/loginReducer';
import { useDispatch } from 'react-redux';

const LoginForm = () => {
    const dispatch = useDispatch();

    const handleSubmit = (event) => {
        event.preventDefault();
        const username = event.target.username.value;
        const password = event.target.password.value;
        dispatch(login(username, password));
    };

    return (
        <div>
            <h2>Log in to application</h2>

            <form onSubmit={handleSubmit}>
                <div>
                    username
                    <input name="username" />
                </div>
                <div>
                    password
                    <input type="password" name="password" />
                </div>
                <button id="login-button" type="submit">
                    login
                </button>
            </form>
        </div>
    );
};

export default LoginForm;
