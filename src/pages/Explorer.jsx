import { Link } from 'react-router-dom';
import RentCategoryImage from '../assets/jpg/rentCategoryImage.jpg';
import SellCategoryImage from '../assets/jpg/sellCategoryImage.jpg';

const Explorer = () => {
  return (
    <div className='explore'>
      <header>
        <p className="pageHeader"></p>
      </header>

      <main>
        {/* Slider */}

        <p className="exploreCategoryHeading">
          Categories
        </p>
        <div className="exploreCategories">
          <Link to='/category/rent'>
            <img src={RentCategoryImage} alt="rent" className='exploreCategoryImg'/>
            <p className="exploreCategoryName">
              Places for rent
            </p>
          </Link>
          <Link to='/category/sale'>
            <img src={SellCategoryImage} alt="sell" className='exploreCategoryImg'/>
            <p className="exploreCategoryName">
              Places for sale
            </p>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Explorer;
