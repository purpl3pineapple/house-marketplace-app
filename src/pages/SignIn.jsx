import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";

const SignIn = () => {

        const [showPassword, setShowPassword] = useState(false);

        const [formData, setFormData] = useState({
            email: '',
            password: ''
        });

        const { email, password } = formData;

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

                const userCredential = await signInWithEmailAndPassword(
                    auth, 
                    email, 
                    password
                );

                if(userCredential.user) navigate('/profile');

            } catch(error){

                console.log({error})
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

                    <div className="signInBar">
                        <p className="signInText">
                            Sign In
                        </p>
                        <button className="signInButton">
                            <ArrowRightIcon fill="#ffffff" width='34px' height='34px' />
                        </button>
                    </div>
                </form>

                {/* Google OAuth */}

                <Link to='/sign-up' className="registerLink">
                    Sign Up
                </Link>
            </div>
        );
  };
  
  export default SignIn;