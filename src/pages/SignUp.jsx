import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase.config";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";
import { toast } from "react-toastify";

const SignUp = () => {

        const [showPassword, setShowPassword] = useState(false);

        const [formData, setFormData] = useState({
            name: '',
            email: '',
            password: ''
        });

        const { name, email, password } = formData;

        const navigate = useNavigate();

        const on_change = (e) => {

            setFormData((previousState) => ({
                ...previousState,
                [e.target.id]: e.target.value
            }));
        };

        const on_submit = async (e) => {

            e.preventDefault();

            try {

                const auth = getAuth();

                const userCredential = await createUserWithEmailAndPassword(
                    auth, 
                    email, 
                    password
                );

                const user = userCredential.user;

                updateProfile(auth.currentUser, {
                    displayName: name
                });

                const formData_copy = { ...formData };
                delete formData_copy.password;
                formData_copy.timestamp = serverTimestamp();

                await setDoc(doc(db, 'users', user.uid), formData_copy);

                navigate('/');

            } catch(e){

                toast.error('Something went wrong wtih registration...');
            };
        };

        return (
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back!
                    </p>
                </header>
                <form onSubmit={on_submit}>
                    <input 
                        type="text" 
                        className="nameInput" 
                        placeholder="Name" 
                        id="name" 
                        value={name}
                        onChange={on_change}
                    />
                    <input 
                        type="email" 
                        className="emailInput" 
                        placeholder="Email" 
                        id="email" 
                        value={email}
                        onChange={on_change}
                    />

                    <div className="passwordInputDiv">
                        <input 
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="passwordInput"
                            placeholder="Password"
                            value={password}
                            onChange={on_change}
                        />
                        <img 
                            src={VisibilityIcon} alt="Show Password"
                            className="showPassword"
                            onClick={() => setShowPassword((previousState) => !previousState)}
                        />
                    </div>

                    <Link 
                        to='/forgot-password'
                        className="forgotPasswordLink"
                    >
                        Forgot Password
                    </Link>

                    <div className="signUpBar">
                        <p className="signUpText">
                            Sign Up
                        </p>
                        <button className="signUpButton">
                            <ArrowRightIcon fill="#ffffff" width='34px' height='34px' />
                        </button>
                    </div>
                </form>

                {/* Google OAuth */}

                <Link to='/sign-in' className="registerLink">
                    Sign In
                </Link>
            </div>
        );
  };
  
  export default SignUp;