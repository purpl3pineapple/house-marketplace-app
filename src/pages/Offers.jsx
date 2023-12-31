import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
    collection, 
    getDocs, 
    query, 
    where, 
    orderBy, 
    limit, 
    startAfter 
} from 'firebase/firestore';
import { db } from '../firebase.config';
import { toast } from 'react-toastify';
import Spinner from '../components/Spinner';
import ListingItem from '../components/ListingItem';

const Offers = () => {

  const [listings, setListings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchedListing, setLastFetchedListing] = useState(null);

  const params = useParams();

  useEffect(() => {

    const fetchListings = async () => {

      try {

        const listingsRef = collection(db, 'listings');


        const q = query(
          listingsRef,
          where('offer', '==', true), 
          orderBy('timestamp', 'desc'),
          limit(10)
        );


        const querySnapshot = await getDocs(q);

        const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

        setLastFetchedListing( lastVisible );

        const listings = [];
        
        querySnapshot.forEach((dcmnt) => listings.push({
          id: dcmnt.id,
          data: dcmnt.data()
        }));


        setListings(listings);
        setLoading(false);

      } catch(e){

        toast.error('Could not get listings...');
      };
            
    };

    fetchListings();

  }, []);


  const fetchMoreListings = async () => {

    try {

      const listingsRef = collection(db, 'listings');

      const q = query(
        listingsRef,
        where('offer', '==', true), 
        orderBy('timestamp', 'desc'),
        startAfter(lastFetchedListing),
        limit(10)
      );

      const querySnapshot = await getDocs(q);

      const lastVisible = querySnapshot.docs[querySnapshot.docs.length - 1];

      setLastFetchedListing( lastVisible );
        
      const listings = [];
        
      querySnapshot.forEach((dcmnt) => listings.push({
        id: dcmnt.id,
        data: dcmnt.data()
      }));

      setListings((previousState) => [...previousState, ...listings]);
        
      setLoading(false);

    } catch(e){

      toast.error('Could not get listings...');
    };
};

    


    return (
      <div className='category'>
        <header>
          <p className="pageHeader">Offers</p>
        </header>
        {
          loading 
          ? (
            <Spinner />
          )
          : listings && listings.length > 0 
          ? (
              <>
                <main>
                  <ul className="categoryListings">{
                    listings.map((listing) => (
                      <ListingItem 
                        listing={listing.data} 
                        id={listing.id} 
                        key={listing.id} 
                      />
                    ))
                  }</ul>
                  <br />
                  <br />
                  {lastFetchedListing && (
                    <p 
                      className="loadMore" 
                      onClick={fetchMoreListings}
                    >
                      Load More
                    </p>
                  )}
                </main>
              </>
            )
          : <p>There are no current offers...</p>
        }
      </div>
    );
};

export default Offers;
