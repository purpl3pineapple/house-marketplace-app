import { useNavigate, useLocation } from "react-router-dom";
import { ReactComponent as OfferIcon } from "../assets/svg/localOfferIcon.svg";
import { ReactComponent as ExplorerIcon } from "../assets/svg/exploreIcon.svg";
import { ReactComponent as ProfileIcon } from "../assets/svg/personOutlineIcon.svg";

const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const explorerPath = '/';
    const offersPath = '/offers';
    const profilePath = '/profile';

    const pathMatchesRoute = (route) => {
        if (route === location.pathname) return true;
    };

    return (
        <footer className="navbar">
        <nav className="navbarNav">
            <ul className="navbarListItems">
                <li 
                    className="navbarListItem"
                    onClick={() => navigate(explorerPath)}
                >
                    <ExplorerIcon fill={pathMatchesRoute(explorerPath) ? "#2c2c2c" : "8f8f8f"} width="36px" height="36px" />
                    <p
                        className={
                            pathMatchesRoute(explorerPath) 
                            ? 'navbarListItemNameActive' 
                            : 'navbarListItemName'
                        }
                    >
                        Explore
                    </p>
                </li>
                <li 
                    className="navbarListItem"
                    onClick={() => navigate(offersPath)}
                >
                    <OfferIcon fill={pathMatchesRoute(offersPath) ? "#2c2c2c" : "8f8f8f"} width="36px" height="36px" />
                    <p
                        className={
                            pathMatchesRoute(offersPath) 
                            ? 'navbarListItemNameActive' 
                            : 'navbarListItemName'
                        }
                    >
                        Offer
                    </p>
                </li>
                <li 
                    className="navbarListItem"
                    onClick={() => navigate(profilePath)}
                >
                    <ProfileIcon fill={pathMatchesRoute(profilePath) ? "#2c2c2c" : "8f8f8f"} width="36px" height="36px" />
                    <p
                        className={
                            pathMatchesRoute(profilePath) 
                            ? 'navbarListItemNameActive' 
                            : 'navbarListItemName'
                        }
                    >
                        Profile

                    </p>
                </li>
            </ul>
        </nav>
        </footer>
    );
};

export default Navbar;
