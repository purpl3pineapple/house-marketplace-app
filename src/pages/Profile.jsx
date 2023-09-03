import { getAuth, updateProfile } from "firebase/auth";
import { updateDoc, doc, collection, getDocs, query, where, orderBy, deleteDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { db } from "../firebase.config";
import { toast } from "react-toastify";
import ArrowRight from '../assets/svg/keyboardArrowRightIcon.svg';
import HomeIcon from '../assets/svg/homeIcon.svg';
import ListingItem from "../components/ListingItem";

const Profile = () => {

    const auth = getAuth();
    const navigate = useNavigate();

    const [changeDetails, setChangeDetails] = useState( false );
    const [ listings, setListings ] = useState( null );
    const [ loading, setLoading ] = useState( true );

    const [formData, setFormData] = useState({
        name: auth.currentUser.displayName,
        email: auth.currentUser.email,
    });

    const { name, email } = formData;


    useEffect(() => {

        const fetchUserListings = async () => {

            const listingsRef = collection( db, 'listings' );

            const q = query(
                listingsRef, 
                where( 'userRef', '==', auth.currentUser.uid ), 
                orderBy( 'timestamp', 'desc' ) 
            );

            const querySnapshot = await getDocs( q );

            let listings = [];


            querySnapshot.forEach(( dcmnt ) => listings.push({
                id: dcmnt.id,
                data: dcmnt.data()
            }));

            setListings( listings );

            setLoading( false );
        };

        fetchUserListings();

    }, [ auth.currentUser.uid ]);

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


    const on_delete = async listingId => {

        if (window.confirm('Are you sure you want to delete?')){

            await deleteDoc( doc( db, 'listings', listingId ) );

            const updatedListings = listings.filter( ( listing ) => listing.id !== listingId );

            setListings( updatedListings );

            toast.success('Successfully deleted listing!');
        };
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

                {!loading && listings?.length > 0 && (
                    <>
                        <p className="listingText">Your Listings:</p>
                        <ul className="listingsList">
                            {listings.map(( listing ) => (
                                <ListingItem
                                    key={ listing.id }
                                    listing={ listing.data }
                                    id={ listing.id }
                                    onDelete={() => on_delete( listing.id )}
                                />
                            ))}
                        </ul>
                    </>
                )}
            </main>
        </div>
    );
  };
  
  export default Profile;