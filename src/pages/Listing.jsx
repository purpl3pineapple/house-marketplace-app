import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import Spinner from '../components/Spinner';
import ShareIcon from '../assets/svg/shareIcon.svg';

const Listing = () => {

    const [ listing, setListing ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    const [ shareLinkCopied, setShareLinkCopied ] = useState(false);

    const navigate = useNavigate();
    const params = useParams();
    const auth = getAuth();

    useEffect(() => {

        const fetchListing = async () => {

            const docRef = doc( db, 'listings', params.listingId );

            const docSnapshot = await getDoc( docRef );

            if ( docSnapshot.exists() ){

                console.log( docSnapshot.data() );

                setListing( docSnapshot.data() );

                setLoading(false);
            };
        };

        fetchListing();

    }, [ navigate, params.listingId ]);


    if (loading) return <Spinner />;
    
    return (
        <div>LISTING</div>
    );
};

export default Listing;
