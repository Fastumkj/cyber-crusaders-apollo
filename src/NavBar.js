import { useState, useEffect } from "react";
import { auth, db } from "./utils/firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import "./styles/NavBar.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate } from "react-router-dom";

const NavBar = () => {
  const [name, setName] = useState("guest");
  const [photo, setPhoto] = useState(
    "https://st.depositphotos.com/2101611/4338/v/600/depositphotos_43381243-stock-illustration-male-avatar-profile-picture.jpg"
  );

  let navigate = useNavigate();

  useEffect(() => {
    const fetchProfilePic = async () => {
      const storage = getStorage();
      const pic = ref(storage, "images/" + auth.currentUser.uid);
      try {
        const url = await getDownloadURL(pic);
        setPhoto(url);
      } catch (error) {
        console.log("No profile pic found");
      }
    };

    const fetchUserName = async () => {
      const username = collection(db, "user");
      const snapshot = await getDocs(username);
      snapshot.forEach((doc) => {
        if (doc.id === auth.currentUser.uid) {
          setName(doc.data().name);
        }
      });
    };
    fetchProfilePic();
    fetchUserName();
  }, [photo]);

  const handleLogout = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <header>
      <div className="navbar-logo">
        <h1 className="navbar-cc">CyberCrusaders</h1>
      </div>

      <div className="navbar-profile">
        <img src={photo} alt="profile pic" className="NavBar-pp" />

        <div className="dropdown">
          <Dropdown>
            <Dropdown.Toggle data-bs-theme="dark" className="bs-button">
              me
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => navigate("/Profile")}>
                my profile
              </Dropdown.Item>
              <Dropdown.Item onClick={handleLogout}>log out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
