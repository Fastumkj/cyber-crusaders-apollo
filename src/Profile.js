import { auth, db, storage } from "./utils/firebase.js";
import { collection, onSnapshot, setDoc, doc } from "firebase/firestore";
import { useState, useEffect, useRef, useContext } from "react";
import { updateProfile } from "firebase/auth";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import "./styles/Profile.css";
import edit from "./assets/edit.png";
import plus from "./assets/plus.jpg";
import pbackground from "./assets/profilebackground.jpg";
import WishListCard from "./WishListCard";
import { GameListContext } from "./GameListProvider.js";
import NavBar from "./NavBar.js";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [list, setList] = useState([]);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [name, setName] = useState("Guest");
  const [loading, setLoading] = useState(false);
  const [photoURL, setPhotoURL] = useState(
    "https://st.depositphotos.com/2101611/4338/v/600/depositphotos_43381243-stock-illustration-male-avatar-profile-picture.jpg"
  );
  const inputRef = useRef(null);
  const { gameList } = useContext(GameListContext);
  let navigate = useNavigate();

  useEffect(() => {
    const storage = getStorage();
    const pic = ref(storage, "images/" + auth.currentUser.uid);
    if (pic) {
      getDownloadURL(pic)
        .then((url) => setPhotoURL(url))
        .catch((error) => {
          console.log("No profile pic found");
        });
    }
    const username = collection(db, "user");
    onSnapshot(username, (names) => {
      names.forEach((doc) => {
        if (doc.id === auth.currentUser.uid) {
          setName(doc.data().name);
        }
      });
    });
    const dbRef = collection(db, auth.currentUser.uid);
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      const documents = [];
      snapshot.forEach((doc) => {
        documents.push(doc.data());
      });
      setList(documents);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const upload = async () => {
    const file = inputRef.current.files[0];
    const storageRef = ref(storage, "/images/" + auth.currentUser.uid);
    const metadata = {
      contentType: "image/*",
    };
    setPhotoURL(URL.createObjectURL(file));
    const uploadingElement = await uploadBytes(storageRef, file, metadata);
  };

  const handleNameChange = () => {
    setEditingName(true);
    setNewName(auth.currentUser.displayName || "");
  };

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      saveName();
    }
  };

  const saveName = async () => {
    if (newName !== auth.currentUser.displayName) {
      updateProfile(auth.currentUser, { displayName: newName })
        .then(() => {
          console.log("Display name updated successfully.");
        })
        .catch((error) => {
          console.log("Error updating display name:", error);
        });
    }
    setEditingName(false);
    setName(newName);
    await setDoc(doc(db, "user", auth.currentUser.uid), { name: newName });
  };

  const cancelNameChange = () => {
    setEditingName(false);
  };

  return (
    <>
      <NavBar gameList={gameList} />
      <div className="profilePage">
        <div className="nav-container-profile">
          <div className="profile-config">
            <div className="profile">
              <p>Profile</p>
              <div
                className="pbackground"
                style={{ backgroundImage: `url(${[pbackground]})` }}
              ></div>
              <img src={photoURL} alt="profile pic" className="profile-pic" />
              <img
                src={plus}
                alt="add"
                className="add"
                onClick={() => inputRef.current.click()}
              />
              <input
                type="file"
                ref={inputRef}
                onChange={upload}
                accept="image/*"
                style={{ display: "none" }}
              />
              <div className="profilepage-name">
                {editingName ? (
                  <>
                    <h2> hello, </h2>
                    <input
                      type="text"
                      value={newName}
                      ref={inputRef}
                      onChange={handleInputChange}
                      onKeyPress={handleKeyPress}
                      style={{ backgroundColor: "black" }}
                      maxLength={25}
                    />
                    <button
                      onClick={saveName}
                      style={{ backgroundColor: "green" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={cancelNameChange}
                      style={{ backgroundColor: "grey" }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <h2>hello, {name}</h2>
                    <img
                      src={edit}
                      alt="edit"
                      onClick={handleNameChange}
                      className="pencil"
                    />
                  </>
                )}
              </div>
            </div>

            <div className="wishlistbackground">
              <div className="profile-wishList">
                <h1> Wish List </h1>
                <ul>
                  {list.map((game) => {
                    return (
                      <li>
                        {" "}
                        <WishListCard
                          className="wishListCard"
                          game={game.gameDetails}
                        />
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
        {/*<ul className="wishListGame">
        {list.map((game) => (
          <li key={game.gameDetails.name}>{game.gameDetails.name}</li>
        ))}
        </ul>*/}
        {loading && <p>Loading...</p>}
      </div>
    </>
  );
};

export default Profile;
