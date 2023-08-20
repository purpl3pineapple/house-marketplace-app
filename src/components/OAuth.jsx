import { useLocation, useNavigate } from 'react-router-dom';
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import GoogleIcon from '../assets/svg/googleIcon.svg';

const OAuth = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const onGoogleClick = async e => {

        try {

            const auth = getAuth();
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const { user } = result;
            const { 
                displayName,
                email,
                uid 
            } = user;

            const docRef = doc(db, 'users', uid);
            const docSnap = await getDoc(docRef);

            const { exists } = docSnap;

            if (!exists()){

                await setDoc(db, 'users', uid, {
                    name: displayName,
                    email: email,
                    timestamp: serverTimestamp()
                });
            };

            navigate('/');

        } catch(e){

            toast.error('Could not authorize with Google...');
        };
    };

    return (
        <div className='socialLogin'>

        <p>
            Sign {location.pathname === '/sign-up' ? 'up' : 'in'} with 
        </p>

        <button 
            className="socialIconDiv"
            onClick={onGoogleClick}
        >
            <img 
                src={GoogleIcon} 
                alt="google"
                className='socialIconImg'
            />
        </button>

        </div>
    );
};

export default OAuth;
