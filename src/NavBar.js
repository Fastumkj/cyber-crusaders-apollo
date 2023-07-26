import { useState, useEffect } from "react";
import { auth, db } from "./utils/firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import "./styles/NavBar.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate, Link } from "react-router-dom";

const NavBar = ({ photoURL, newName }) => {
  const [name, setName] = useState(newName || "guest");
  const [photo, setPhoto] = useState(
    photoURL ||
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfv6MLV9O02vHcqwZkaz4AjSunSuSjL-u_2g&usqp=CAU"
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
    const unsub = auth.onAuthStateChanged((authObj) => {
      if (authObj) {
        fetchProfilePic();
        fetchUserName();
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      unsub();
    };
  }, []);

  useEffect(() => {
    setPhoto(
      photoURL ||
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfv6MLV9O02vHcqwZkaz4AjSunSuSjL-u_2g&usqp=CAU"
    );
  }, [photoURL]);

  useEffect(() => {
    setName(newName || "Guest");
  }, [newName]);

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div className="navbar">
      <header className="navbar-fixed">
        <div className="navbar-logo">
          <Link to="/home" className="navbar-cc">
            CyberCrusaders
          </Link>
        </div>

        <div className="navbar-profile">
          <img src={photo} alt="profile pic" className="NavBar-pp" />

          <div className="dropdown">
            <Dropdown>
              <Dropdown.Toggle data-bs-theme="dark" className="bs-button">
                Profile
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Header> Hi, {name} </Dropdown.Header>
                <Dropdown.Divider></Dropdown.Divider>
                <Dropdown.Item onClick={() => navigate("/Profile")}>
                  My Account
                </Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>
      </header>
    </div>
  );
};

export default NavBar;
