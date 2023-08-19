import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ReactComponent as ArrowRightIcon } from "../assets/svg/keyboardArrowRightIcon.svg";
import VisibilityIcon from "../assets/svg/visibilityIcon.svg";

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

        return (
            <div className="pageContainer">
                <header>
                    <p className="pageHeader">
                        Welcome Back!
                    </p>
                </header>
                <form>
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