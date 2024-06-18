import {useState} from "react";
import styles from './loginSignup.module.css';
import user_icon from '../../assets/person.png'
import email_icon from '../../assets/email.png';
import password_icon from '../../assets/password.png';
import axios from "axios";
import {useNavigate} from "react-router-dom";
import classNames from 'classnames';
import LoadingSpinner from '../loadingSpinner/LoadingSpinner.jsx';

const LoginSignup = () => {

    const [action, setAction] = useState('Login');
    const [message, setMessage] = useState(`Click button below to ${action.toLowerCase()}`);
    const [isSuccessful, setIsSuccessful] = useState(false);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Dodaj nowy stan

    let navigation = useNavigate();

    const handleRegister = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (username === '' || email === '' || password === '') {
            setMessage('Failed: All fields are required for registration');
            setIsSuccessful(false);
            return;
        } else if (!emailRegex.test(email)) {
            setMessage('Failed: Invalid email format');
            setIsSuccessful(false);
            return;
        }
        setIsLoading(true);
        const data = {
            username: username,
            email: email,
            password: password
        }
        await axios.post('http://localhost:8080/api/v1/auth/register', data, {withCredentials: true})
            .then(response => {
                console.log(response);
                setMessage('Successfully registered!');
                setIsSuccessful(true);
                setIsLoading(false);
            })
            .catch(error => {
                console.log(error);
                setMessage(`Registration failed due to: ${error.response.data}`);
                setIsSuccessful(false);
                setIsLoading(false);
            });
    }

    const handleLogin = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (email === '' || password === '') {
            setMessage('Failed: Both email and password are required for login');
            setIsSuccessful(false);
            return;
        } else if (!emailRegex.test(email)) {
            setMessage('Failed: Invalid email format');
            setIsSuccessful(false);
            return;
        }
        setIsLoading(true);
        const data = {
            email: email,
            password: password
        }
        await axios.post('http://localhost:8080/api/v1/auth/authenticate', data, {withCredentials: true})
            .then(async response => {
                console.log(response);
                setMessage('Successfully logged in!');
                setIsSuccessful(true);
                setIsLoading(false);
                console.log(isSuccessful, isLoading)
                navigation('/contacts');
            })
            .catch(error => {
                console.log(error);
                setMessage(`Login failed due to: ${error.message}`);
                setIsSuccessful(false);
                setIsLoading(false);
            });

    }

    const handleClick = (button) => {
        if (action !== button) {
            setMessage(`Click button below to ${button.toLowerCase()}`);
        } else {
            if (button === "Sign Up")
                handleRegister();
            else if (button === "Login")
                handleLogin();
        }
        setAction(button);
    }
    return (
        <>
            {isLoading ? <LoadingSpinner/> :
                <div className={styles.background}>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <div className={styles.text}>{action}</div>
                            <div className={styles.underline}></div>
                        </div>
                        <div className={styles.inputs}>
                            <div className={styles.input} style={{display: action === "Login" ? "none" : "flex"}}>
                                <img src={user_icon} alt=""/>
                                <input type='text' placeholder="Username" value={username}
                                       onChange={(e) => setUsername(e.target.value)}/>
                            </div>
                            <div className={styles.input}>
                                <img src={email_icon} alt=""/>
                                <input type='email' placeholder="Email" value={email}
                                       onChange={(e) => setEmail(e.target.value)}/>
                            </div>
                            <div className={styles.input}>
                                <img src={password_icon} alt=""/>
                                <input type='password' placeholder="Password" value={password}
                                       onChange={(e) => setPassword(e.target.value)}/>
                            </div>
                        </div>
                        <div className={classNames(styles.info_text, {
                            [styles.success]: isSuccessful && message.includes('Successfully'),
                            [styles.failure]: !isSuccessful && (message.includes('failed') || message.includes('Failed'))
                        })}>
                            <p>{message}</p>
                        </div>

                        <div className={styles.submit_container}>
                            <div className={action === "Login" ? `${styles.submit} ${styles.gray}` : `${styles.submit}`}
                                 onClick={() => handleClick("Sign Up")}>
                                Sign Up
                            </div>
                            <div
                                className={action === "Sign Up" ? `${styles.submit} ${styles.gray}` : `${styles.submit}`}
                                onClick={() => handleClick("Login")}>
                                Log in
                            </div>
                        </div>
                    </div>
                </div>
            }
        </>
    );
}
export default LoginSignup;