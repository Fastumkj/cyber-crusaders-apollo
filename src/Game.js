import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { auth, db } from "./utils/firebase.js";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import {
  writeBatch,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  orderBy,
} from "firebase/firestore";
import "./styles/Game.css";
import icon from "./assets/icon.jpg";
import Comment from "./Comment.js";
import CommentData from "./CommentData.js";
import Comments from "./Comments";
import NavBar from "./NavBar.js";
import { Button } from "react-bootstrap";

const Game = ({ setIsLoggedIn }) => {
  const location = useLocation();
  const gameDetails = location.state?.gameDetails;
  const [name, setName] = useState("Guest");
  const [photoURL, setPhotoURL] = useState(
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfv6MLV9O02vHcqwZkaz4AjSunSuSjL-u_2g&usqp=CAU"
  );
  const [loading, setLoading] = useState(true);
  const [comments, setComments] = useState([]);
  const [display, setDisplay] = useState(true);
  const [isAdded, setIsAdded] = useState(false);
  const [isInWishList, setIsInWishList] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  useEffect(() => {
    const fetchProfilePic = async () => {
      const storage = getStorage();
      const pic = ref(storage, "images/" + auth.currentUser.uid);
      try {
        const url = await getDownloadURL(pic);
        setPhotoURL(url);
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

    const fetchComments = async () => {
      const commentRef = query(
        collection(db, gameDetails.id.toString()),
        orderBy("index")
      );
      if (commentRef) {
        const snapshot = await getDocs(commentRef);
        let list = [];
        snapshot.forEach((doc) => {
          var comment = doc.data();
          list.push(
            new CommentData(
              comment.index,
              comment.comment,
              comment.name,
              comment.photo,
              comment.id
            )
          );
        });
        console.log(list);
        list.sort((a, b) => a.index - b.index);
        setComments(list);
        console.log(list);
      }
    };

    const checkWishlist = async () => {
      const currentUser = auth.currentUser.uid;

      var dbRef = collection(db, currentUser);
      const gameQuery = query(
        dbRef,
        where("gameDetails.id", "==", gameDetails.id)
      );

      const querySnapshot = await getDocs(gameQuery);
      if (!querySnapshot.empty) {
        setIsInWishList(true);
      }
    };

    fetchProfilePic();
    fetchUserName();
    fetchComments();
    checkWishlist();
    setLoading(false);
  }, []);

  let current = comments.length;

  const handleDelete = async (commentID) => {
    setCommentToDelete(commentID);
    setShowConfirmationModal(true);
  };

  const confirmDelete = async () => {
    const list = comments.filter((a) => {
      return a.index !== commentToDelete;
    });
    setComments(list);
    var db_ref = collection(db, gameDetails.id.toString());
    let batch = writeBatch(db);
    const comment_ref = query(db_ref, where("index", "==", commentToDelete));
    const querySnapshot = await getDocs(comment_ref);
    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    setShowConfirmationModal(false);
    return batch.commit();
  };

  const cancelDelete = () => {
    setShowConfirmationModal(false);
  };

  const onSubmit = async (text, setText) => {
    await setDoc(doc(db, gameDetails.id.toString(), current.toString()), {
      index: current,
      name: name,
      comment: text,
      photo: photoURL,
      id: auth.currentUser.uid,
    });
    const comment = new CommentData(
      current,
      text,
      name,
      photoURL,
      auth.currentUser.uid
    );
    setText("");
    var list = [...comments, comment];
    list.sort((a, b) => a.index - b.index);
    setComments(list, () => {
      current += comment.length;
    });
    current = list.length;
  };

  const shouldDisplay = (id) => {
    return id === auth.currentUser.uid;
  };

  const addToWishlist = async () => {
    const currentUser = auth.currentUser.uid;

    var dbRef = collection(db, currentUser);
    const gameQuery = query(
      dbRef,
      where("gameDetails.id", "==", gameDetails.id)
    );

    const querySnapshot = await getDocs(gameQuery);

    if (!querySnapshot.empty) {
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      setIsInWishList(false);
    } else {
      setIsAdded(true);
      setTimeout(() => {
        setIsAdded(false);
      }, 1000);
      await addDoc(dbRef, { gameDetails });
      setIsInWishList(true);
    }
  };

  const convert = (release_date) => {
    if (release_date == null) {
      return null;
    }

    const date = new Date(release_date * 1000);

    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const formattedDate = `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year.toString()}`;

    return formattedDate;
  };

  let imageUrl = null;
  if (gameDetails.cover) {
    imageUrl =
      "https://images.igdb.com/igdb/image/upload/t_cover_big/" +
      gameDetails.cover.image_id +
      ".jpg";
  }

  return (
    <>
      <NavBar setIsLoggedIn={setIsLoggedIn}></NavBar>

      <div className="game">
        <div className="gameBackground"></div>
        <div class="tab">
          <Button
            variant="primary"
            class="tablinks"
            onClick={() => {
              setDisplay(true);
              window.history.back();
            }}
          >
            Go Back
          </Button>
        </div>
        <div className="gameDescription">
          <img
            src={imageUrl ? imageUrl : icon}
            alt="Product 1"
            className="coverart"
          />
          <div className="gameInfo">
            <h1> Title Name </h1>
            <h3> {gameDetails.name}</h3>
            <h1>Summary</h1>
            <h3>{gameDetails.summary}</h3>
            <h1>Release Dates</h1>
            {gameDetails.first_release_date ? (
              <h3>{convert(gameDetails.first_release_date)} </h3>
            ) : (
              <h3>No release dates available.</h3>
            )}

            <h1>Platforms</h1>
            {gameDetails.platforms && gameDetails.platforms.length > 0 ? (
              <ul className="horizontal-list">
                {gameDetails.platforms.map((platform) => (
                  <li>{platform.name}</li>
                ))}
              </ul>
            ) : (
              <p>No known information available.</p>
            )}

            <h1>Genres</h1>
            {gameDetails.genres && gameDetails.genres.length > 0 ? (
              <ul className="horizontal-list">
                {gameDetails.genres.map((genre) => (
                  <li>{genre.name}</li>
                ))}
              </ul>
            ) : (
              <p>No known information available.</p>
            )}
            <Button
              onClick={addToWishlist}
              style={{
                width: "200px",
                backgroundColor: isAdded
                  ? "black"
                  : isInWishList
                  ? "red"
                  : "green",
              }}
            >
              {isAdded
                ? "Adding..."
                : isInWishList
                ? "Remove from Wish List"
                : "Add to Wish List"}
            </Button>
          </div>
        </div>

        <div className="gamecomment">
          <div className="commentsection">
            <h1> Comments </h1>
            <Comment onSubmit={onSubmit} photoURL={photoURL}></Comment>
            {comments.map((comment) => (
              <Comments
                Comment={comment}
                display={shouldDisplay}
                handleDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>

      {showConfirmationModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Confirm Deletion</h2>
            <div className="modal-actions">
              <Button onClick={confirmDelete}>Confirm</Button>
              <Button onClick={cancelDelete}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Game;
