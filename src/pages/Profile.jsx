import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ArrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import HomeIcon from '../assets/svg/homeIcon.svg';

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


    const on_submit = async () => {
        
        try {

            if (auth.currentUser.displayName !== name){
            
                await updateProfile(auth.currentUser, {
                    displayName: name
                });
    
                const userRef = doc(db, 'users', auth.currentUser.uid);
                await updateDoc(userRef, {
                    name: name
                });
            };

        } catch(e){

            toast.error('Could not update profile name...')
        };
    };


    const on_change = (e) => {

        setFormData((previousState) => ({
            ...previousState,
            [e.target.id]: e.target.value
        }));
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

            <main>
                <div className="profileDetailsHeader">
                    <p className="profileDetailsText">
                        Personal Details
                    </p>
                    <p 
                        className="changePersonalDetails"
                        onClick={() => {
                            changeDetails && on_submit();
                            setChangeDetails((previousState) => !previousState)
                        }}
                    >
                        {changeDetails ? 'done' : 'change'}
                    </p>
                </div>

                <div className="profileCard">
                    <form>
                        <input 
                            type="text" 
                            id="name" 
                            className={
                                !changeDetails 
                                ? 'profileName' 
                                : 'profileNameActive'
                            }
                            disabled={!changeDetails}
                            value={name}
                            onChange={on_change}
                        />
                        <input 
                            type="text" 
                            id="email" 
                            className={
                                !changeDetails 
                                ? 'profileEmail' 
                                : 'profileEmailActive'
                            }
                            disabled={!changeDetails}
                            value={email}
                            onChange={on_change}
                        />
                    </form>
                </div>

                <Link 
                    to='/create-listing'
                    className="createListing"
                >
                    <img src={HomeIcon} alt="home" />
                    <p>Sell or rent your home</p>
                    <img src={ArrowRight} alt="arrow right" />
                </Link>
            </main>
        </div>
    );
  };
  
  export default Profile;