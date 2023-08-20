import { Link } from 'react-router-dom';
import { ReactComponent as DeleteIcon } from '../assets/svg/deleteIcon.svg';
import BedIcon from '../assets/svg/bedIcon.svg';
import BathtubIcon from '../assets/svg/bathtubIcon.svg';

const ListingItem = ({ listing, id }) => {
    return (
        <div className='categoryListing'>
            <Link 
                to={`/category/${listing.type}/${id}`}
                className='categoryListingLink'
            >
                <img 
                    src={listing.imgUrls[0]} 
                    alt={listing.name}
                    className='categoryListingImg'
                />
            </Link>
        </div>
    );
};

export default ListingItem;
