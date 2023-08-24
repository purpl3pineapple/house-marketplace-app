import { useEffect, useState, useRef } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

const CreateListing = () => {

    const [geolocationEnabled, setGeolocationEnabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        type: 'rent',
        name: '',
        bedrooms: 1,
        bathrooms: 1,
        parking: false,
        furnished: false,
        address: '',
        offer: false,
        regularPrice: 0,
        discountedPrice: 0,
        images: [],
        latitude: 0,
        longitude: 0
    });

    const {
        type,
        name,
        bedrooms,
        bathrooms,
        parking,
        furnished,
        address,
        offer,
        regularPrice,
        discountedPrice,
        images,
        latitude,
        longitude
    } = formData;

    const auth = getAuth();
    const navigate = useNavigate();
    const isMounted = useRef(true);

    const on_submit = async (e) => {

        e.preventDefault();

        setLoading(true);

        try {

            if (discountedPrice >= regularPrice){

                toast.error('Discounted price must be less than regular price...');
                setLoading(false);
                return;
            };

            if (images.length > 6){

                toast.error('Max 6 images...');
                setLoading(false);
                return;
            };

            let geolocation = {};
            let location;

            if(geolocationEnabled){

                const response = await fetch(
                    `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`
                );

                const data = await response.json();

                const { status, results } = data;


                geolocation.lat = results[0]?.geometry.location.lat ?? 0;
                geolocation.lng = results[0]?.geometry.location.lng ?? 0;

                location = status === 'ZERO_RESULTS' ? undefined : results[0]?.formatted_address;

                console.log({status, results})

                if (location === undefined || location.includes('undefined')){

                    console.log('Please enter the correct address')

                    setLoading(false);
                    toast.error('Please enter the correct address');
                    return;
                };

                setFormData((previousState) => ({
                    ...previousState,
                    address: location,
                    latitude: geolocation.lat,
                    longitude: geolocation.lng
                }));

            } else {

                geolocation.lat = latitude;
                geolocation.lng = longitude;
                location = address;
            };

            setLoading(false);

        } catch(e){

        };
    };


    const mutate = (e) => {

        let boolean = null;

        if (e.target.value === 'true') boolean = true;
        if (e.target.value === 'false') boolean = false;

        if (e.target.files){

            setFormData((previousState) => ({
                ...previousState,
                images: e.target.files
            }));
        };

        if (!e.target.files){

            setFormData((previousState) => ({
                ...previousState,
                [e.target.id]: boolean ?? e.target.value
            }));
        };
    };

    useEffect(() => {
        
        if(isMounted){

            onAuthStateChanged(auth, (user) => {

                if (user) setFormData({...formData, userRef: user.uid});
                else navigate('/sign-in');
            });
        };

    }, [isMounted]);


    if(loading) return <Spinner />;    

    return (
        <div className='profile'>
            <header>
                <p className="pageHeader">
                    Create a listing
                </p>
            </header>
            <main>
                <form onSubmit={on_submit}>

                    <label className="formLabel">
                        Sell / Rent
                    </label>
                    <div className="formButtons">
                        <button 
                            type='button'
                            className={type === 'sale' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='sale'
                            onClick={mutate}
                        >
                            Sell
                        </button>
                        <button 
                            type='button'
                            className={type === 'rent' ? 'formButtonActive' : 'formButton'}
                            id='type'
                            value='rent'
                            onClick={mutate}
                        >
                            Rent
                        </button>
                    </div>
                    
                    <label className="formLabel">
                        Name
                    </label>
                    <input 
                        type='text'
                        className='formInputName'
                        id='name'
                        value={name}
                        onChange={mutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    <div className="formRooms flex">
                        <div>
                            <label className="formLabel">
                                Bedrooms
                            </label>
                            <input
                                type='number'
                                className='formInputSmall'
                                id='bedrooms'
                                value={bedrooms}
                                onChange={mutate}
                                min='1'
                                max='20'
                                required
                            />
                        </div>
                        <div>
                            <label className="formLabel">
                                Bathrooms
                            </label>
                            <input
                                type='number'
                                className='formInputSmall'
                                id='bathrooms'
                                value={bathrooms}
                                onChange={mutate}
                                min='1'
                                max='20'
                                required
                            />
                        </div>
                    </div>

                    <label className="formLabel">
                        Parking
                    </label>
                    <div className="formButtons">
                        <button
                            type='button'
                            className={parking ? 'formButtonActive' : 'formButton'}
                            id='parking'
                            value={true}
                            onClick={mutate}
                        >
                            Yes
                        </button>
                        <button
                            type='button'
                            className={!parking && parking !== null ? 'formButtonActive' : 'formButton'}
                            id='parking'
                            value={false}
                            onClick={mutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel">
                        Furnished
                    </label>
                    <div className="formButtons">
                        <button
                            type='button'
                            className={furnished ? 'formButtonActive' : 'formButton'}
                            id='furnished'
                            value={true}
                            onClick={mutate}
                        >
                            Yes
                        </button>
                        <button
                            type='button'
                            className={!furnished && furnished !== null ? 'formButtonActive' : 'formButton'}
                            id='furnished'
                            value={false}
                            onClick={mutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel">
                        Address
                    </label>
                    <input
                        type='text'
                        className='formInputName'
                        id='address'
                        value={address}
                        onChange={mutate}
                        maxLength='32'
                        minLength='10'
                        required
                    />

                    {!geolocationEnabled && (
                        <div className="formLatLng flex">
                            <div>
                                <label htmlFor="" className="formLabel">
                                    Latitude
                                </label>
                                <input 
                                    type="number" 
                                    value={latitude} 
                                    id="latitude" 
                                    className="formInputSmall"
                                    onChange={mutate}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="" className="formLabel">
                                    Longitude
                                </label>
                                <input 
                                    type="number" 
                                    value={longitude} 
                                    id="longitude" 
                                    className="formInputSmall"
                                    onChange={mutate}
                                    required
                                />
                            </div>
                        </div>
                    )}

                    <label className="formLabel">
                        Offer
                    </label>
                    <div className="formButtons">
                        <button
                            type='button'
                            className={offer ? 'formButtonActive' : 'formButton'}
                            id='offer'
                            value={true}
                            onClick={mutate}
                        >
                            Yes
                        </button>
                        <button
                            type='button'
                            className={!offer && offer !== null ? 'formButtonActive' : 'formButton'}
                            id='offer'
                            value={false}
                            onClick={mutate}
                        >
                            No
                        </button>
                    </div>

                    <label className="formLabel">
                        Regular Price
                    </label>
                    <div className="formPriceDiv">
                        <input
                            type='text'
                            className='formInputSmall'
                            id='regularPrice'
                            value={`${regularPrice}`}
                            onChange={mutate}
                            min='50'
                            max='75000000000'
                            required
                        />
                        {type === 'rent' && <p className='formPriceText'> / Month</p>}
                    </div>

                    {offer && 
                        <>
                            <label className="formLabel">
                                Discounted Price
                            </label>
                            <input
                                type='text'
                                className='formInputSmall'
                                id='discountedPrice'
                                value={`${discountedPrice}`}
                                onChange={mutate}
                                min='50'
                                max='75000000000'
                            />
                        </>
                    }

                    <label className="formLabel">
                        Images
                    </label>
                    <p className="imagesInfo">The first image will be the cover (max 6).</p>
                    <input 
                        type="file"
                        id="images" 
                        className="formInputFile" 
                        max="6" 
                        accept=".jpg,.png,.jpeg" 
                        multiple 
                        required
                        onChange={mutate} 
                    />
                    <button 
                        type='submit' 
                        className="primaryButton createListingButton"
                    >
                        Create Listing
                    </button>
                </form>
            </main>
        </div>
    );
};

export default CreateListing;
