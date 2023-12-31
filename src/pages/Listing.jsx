import { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { getDoc, doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../firebase.config';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
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
        <main>
            <Swiper
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            navigation
            slidesPerView={1} 
            pagination={{ clickable: true }}
            scrollbar={{ draggable: true }}
            >
                {listing.imgUrls.map((imgURL, index) => (
                    <SwiperSlide key={index}>
                    <div 
                        className="swiperSlideDiv"
                        style={{ 
                            background: `url(${listing.imgUrls[index]}) center no-repeat`, 
                            backgroundSize: '100% 300px', 
                            height: '300px',
                        }}
                    ></div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <div className="shareIconDiv" onClick={() => {

                navigator.clipboard.writeText(window.location.href);

                setShareLinkCopied(true);

                setTimeout(() => setShareLinkCopied(false), 2000);
            }}>
                <img src={ ShareIcon } alt="" />
            </div>

            {shareLinkCopied && (
            
                <p className='linkCopied'>
                    Link Copied!
                </p>
            )}

            <div className="listingDetails">
                <p className="listName">
                    { listing.name } - $
                    
                    { listing.offer

                        ? listing.discountedPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

                        : listing.regularPrice
                        .toString()
                        .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                    }
                </p>

                <p className="listingLocation">{ listing.location }</p>

                <p className="listingType">For { listing.type === 'rent' ? 'Rent' : 'Sale' }</p>

                { listing.offer && (
                
                    <p className='discountPrice'>
                        ${ listing.regularPrice - listing.discountedPrice } discount
                    </p>
                )}

                <ul className="listingDetailsList">
                    <li>
                        {listing.bedrooms > 1 ? `${ listing.bedrooms } Bedrooms` : '1 Bedroom'}
                    </li>
                    <li>
                        {listing.bathrooms > 1 ? `${ listing.bathrooms } Bathrooms` : '1 Bathroom'}
                    </li>
                    <li>
                        {listing.parking && 'Parking spot'}
                    </li>
                    <li>
                        {listing.furnished && 'Furnished'}
                    </li>
                </ul>

                <p className="listingLocationTitle">Location</p>

                <div className="leafletContainer">
                    <MapContainer 
                        style={{ height: '100%', width: '100%'}}
                        center={[
                            listing.geolocation.lat,
                            listing.geolocation.lng
                        ]}
                        zoom={13}
                        scrollWheelZoom={false}
                    >

                        <TileLayer 
                            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                        />

                        <Marker position={[
                            listing.geolocation.lat,
                            listing.geolocation.lng
                        ]}>
                            <Popup>{listing.location}</Popup>
                        </Marker>
                    </MapContainer>
                </div>

                {auth.currentUser?.uid !== listing.userRef && (
                    <Link 
                        to={`/contact/${listing.userRef}?listingName=${listing.name}`} 
                        className='primaryButton'
                    >
                        Contact Landlord
                    </Link>
                )}
            </div>
        </main>
    );
};

export default Listing;
