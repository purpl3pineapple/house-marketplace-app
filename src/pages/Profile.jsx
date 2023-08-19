import { getAuth } from "firebase/auth";
import { useEffect, useState } from "react";

const Profile = () => {

    const [user, setUser] = useState({});

    const auth = getAuth();

    useEffect(() => {

        setUser(auth.currentUser);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return user ? <h1>{user.displayName}</h1> : <h1>USER NOT FOUND</h1>;
  };
  
  export default Profile;