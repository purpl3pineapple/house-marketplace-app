import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase.config';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css/bundle';
import Spinner from './Spinner';

const Slider = () => {

    const [ loading, setLoading ] = useState( true );

    const [ listings, setListings ] = useState( null );

    const navigate = useNavigate();

    useEffect(() => {

        const fetchListings = async () => {

            const listingsRef = collection( db, 'listings' );

            const q = query( listingsRef, orderBy( 'timestamp', 'desc' ), limit(5) );

            const querySnapshot = await getDocs( q );

            let listings = [];

            querySnapshot.forEach(( dcmnt ) => listings.push({
                id: dcmnt.id,
                data: dcmnt.data()
            }));

            setListings( listings );

            setLoading( false );
        };

        fetchListings();

    }, []);

    if ( loading ) return <Spinner />;

    if ( listings.length === 0 ) return <></>;

    return (
        <>
            <p className="exploreHeading">Recommended</p>
            <Swiper
                modules={[Navigation, Pagination, Scrollbar, A11y]}
                slidesPerView={1} 
                pagination={{ clickable: true }}
                height='300px'
            >
                {
                    listings.map(({ data, id }) => (
                        <SwiperSlide 
                            key={id} 
                            onClick={() => navigate(`/category/${data.type}/${id}`)}
                        >

                            <div 
                                className="swiperSlideDiv"
                                style={{ 
                                    background: `url(${data.imgUrls[0]}) center no-repeat`, 
                                    backgroundSize: '100% 300px', 
                                    height: '300px',
                                }}
                            >
                                <p className="swiperSlideText">{data.name}</p>
                                <p className="swiperSlidePrice">
                                    ${data.discountedPrice ?? data.regularPrice}{' '}
                                    {data.type === 'rent' && '/ month'}
                                </p>
                            </div>

                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </>
    );
};

export default Slider;
