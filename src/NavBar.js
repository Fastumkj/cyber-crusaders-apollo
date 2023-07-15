import { useState, useEffect } from "react";
import { auth, db } from "./utils/firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import "./styles/NavBar.css";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate, Link } from "react-router-dom";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";
import icon from "./assets/icon.jpg";

const NavBar = ({ gameList }) => {
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

  const displayPhoto = (photo) => {
    if (photo) {
      return (
        "https://images.igdb.com/igdb/image/upload/t_cover_big/" +
        photo +
        ".jpg"
      );
    }
  };

  const handleLogout = () => {
    auth.signOut();
    window.location.reload();
  };

  return (
    <div className="navbar">
      <header>
        <div className="navbar-logo">
          <Link to="./home" className="navbar-cc">
            CyberCrusaders
          </Link>
        </div>

        <div className="navbar-search">
          <Autocomplete
            style={{ backgroundColor: "white", color: "black" }}
            options={gameList}
            getOptionLabel={(option) => option.name}
            sx={{ width: 300 }}
            renderOption={(props, option) => {
              const { name, cover } = option;

              const photoURL =
                cover && cover.image_id ? displayPhoto(cover.image_id) : icon;

              return (
                <div
                  {...props}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    height: "100px",
                  }}
                  onClick={() =>
                    navigate(`/Game/${option.id}`, {
                      state: { gameDetails: option },
                    })
                  }
                >
                  <img
                    src={photoURL}
                    alt="coverart"
                    style={{
                      height: "90px",
                      width: "80px",
                      flexShrink: 0,
                      marginBottom: "5px",
                    }}
                  />
                  <span style={{ color: "black" }}>{name}</span>
                </div>
              );
            }}
            renderInput={(renderInputParams) => (
              <div
                ref={renderInputParams.InputProps.ref}
                style={{
                  alignItems: "center",
                  width: "100%",
                  display: "flex",
                  flexDirection: "row",
                }}
              >
                <TextField
                  style={{ flex: 1 }}
                  InputProps={{
                    ...renderInputParams.InputProps,
                    startAdornment: (
                      <InputAdornment position="start"> </InputAdornment>
                    ),
                  }}
                  placeholder="Search"
                  inputProps={{
                    ...renderInputParams.inputProps,
                  }}
                  InputLabelProps={{ style: { display: "none" } }}
                />
              </div>
            )}
          />
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
    </div>
  );
};

export default NavBar;
