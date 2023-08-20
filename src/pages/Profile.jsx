import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase.config";

const Profile = () => {

    const auth = getAuth();
    const navigate = useNavigate();

    const [changeDetails, setChangeDetails] = useState(false);
    
    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { name, email } = formData;

    const log_out = () => {
        auth.signOut();
        navigate('/');
    };

    return (
        <div className="profile">
            <header className="profileHeader">
                <p className="pageHeader">My Profile</p>
                <button 
                    type="button" 
                    className="logOut"
                    onClick={log_out}
                >
                    Logout
                </button>
            </header>
        </div>
    );
  };
  
  export default Profile;