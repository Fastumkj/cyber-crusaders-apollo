import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/App.css";
import joystick from "./assets/joystick.jpg";
import Card from "./Card";
import Pagination from "./Pagination";
import NavBar from "./NavBar";
import { motion, AnimatePresence } from "framer-motion";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "./utils/firebase";
import { getDownloadURL, getStorage, ref } from "firebase/storage";
import { collection, getDocs } from "firebase/firestore";
import { GameListContext } from "./GameListProvider";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

const App = () => {
  const { gameList, setGameList } = useContext(GameListContext);
  const [currentPage, setCurrent] = useState(1);
  const [original, setOriginal] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [recordsPerPage] = useState(14);
  const [user] = useAuthState(auth);
  const [name, setName] = useState("guest");
  const [photo, setPhoto] = useState(
    "https://st.depositphotos.com/2101611/4338/v/600/depositphotos_43381243-stock-illustration-male-avatar-profile-picture.jpg"
  );
  const [emailSubscribed, setEmailSubscribed] = useState(false); // Track email subscription status
  const [haveGames, setHaveGames] = useState(true);

  const navigate = useNavigate();

  const handleEmailSubscription = (e) => {
    e.preventDefault();
    setEmailSubscribed(true);
  };

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

    const fetchInfo = async () => {
      var myHeaders = new Headers();
      myHeaders.append("x-api-key", "e0kFMFio5QaHanAseqBII1Shr66hKS9n7uDXJHvh");
      myHeaders.append("Content-Type", "text/plain");

      const currentDate = Math.floor(Date.now() / 1000);

      var raw = `fields name, first_release_date, cover.image_id, genres.name, platforms.name, summary,
    release_dates;
      where first_release_date > ${currentDate};
      limit 50;
      sort first_release_date asc;`;

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      try {
        const response = await fetch(
          "https://yzyuo634g3.execute-api.us-west-2.amazonaws.com/production/v4/games",
          requestOptions
        );
        const responseJson = await response.json();
        setGameList(responseJson);
        setOriginal(responseJson);
      } catch (error) {
        console.error(error);
      }
    };

    fetchInfo();
    fetchProfilePic();
    fetchUserName();
  }, []);

  useEffect(() => {
    setCurrent(1);
    if (original.length === 0) {
      setHaveGames(false);
    } else {
      setHaveGames(true);
    }
  }, [original]);

  useEffect(() => {
    let filteredGames = gameList;
    if (platforms.length > 0) {
      filteredGames = filteredGames.filter((game) => {
        return (
          game.platforms &&
          platforms.every((filter) => {
            console.log(filter);
            return game.platforms.some((platform) => {
              return (
                platform.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1
              );
            });
          })
        );
      });
    }
    if (genres.length > 0) {
      filteredGames = filteredGames.filter((game) => {
        return (
          game.genres &&
          genres.every((filter) => {
            return game.genres.some((genre) => genre.name === filter);
          })
        );
      });
    }
    setOriginal(filteredGames);
  }, [gameList, genres, platforms]);

  const handleGenresClick = (filter) => {
    if (genres.includes(filter)) {
      return;
    }
    setGenres([...genres, filter]);
  };

  const handlePlatformClick = (filter) => {
    if (platforms.includes(filter)) {
      return;
    }
    setPlatforms([...platforms, filter]);
  };

  const handleDelete = (filter) => {
    if (genres.includes(filter.filter)) {
      setGenres(genres.filter((x) => x !== filter.filter));
    } else {
      setPlatforms(platforms.filter((x) => x !== filter.filter));
    }
  };

  const paginate = (pageNumber) => {
    setCurrent(pageNumber);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = original.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <>
      <NavBar gameList={gameList}></NavBar>
      <div className="wrapper">
        <div className="filterlist">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="filter">
              Filter
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <div style={{ display: "flex" }}>
                <div style={{ flex: 1 }}>
                  <Dropdown.Header
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "16px",
                    }}
                  >
                    Platform
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => handlePlatformClick("PC")}>
                    PC
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handlePlatformClick("Nintendo Switch")}
                  >
                    Nintendo Switch
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handlePlatformClick("PlayStation")}
                  >
                    PlayStation
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePlatformClick("Xbox")}>
                    Xbox
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePlatformClick("Android")}>
                    Android
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handlePlatformClick("IOS")}>
                    IOS
                  </Dropdown.Item>
                </div>

                <div
                  style={{
                    width: "1px",
                    backgroundColor: "gray",
                    margin: "0 10px",
                  }}
                ></div>

                <div style={{ flex: 1 }}>
                  <Dropdown.Header
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      fontSize: "16px",
                    }}
                  >
                    Genre
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => handleGenresClick("Point-and-click")}
                  >
                    Point-and-click
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Fighting")}>
                    Fighting
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Shooter")}>
                    Shooter
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Music")}>
                    Music
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Platform")}>
                    Platform
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Puzzle")}>
                    Puzzle
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Racing")}>
                    Racing
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("RTS")}>
                    RTS
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("RPG")}>
                    RPG
                  </Dropdown.Item>
                </div>
                <div style={{ flex: 1 }}>
                  <Dropdown.Header style={{ height: "40px" }}>
                    &nbsp;
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => handleGenresClick("Simulator")}>
                    Simulator
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Sport")}>
                    Sport
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Strategy")}>
                    Strategy
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("TBS")}>
                    TBS
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Tactical")}>
                    Tactical
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Quiz")}>
                    Quiz
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenresClick("Hack and Slash")}
                  >
                    Hack and Slash
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Adventure")}>
                    Adventure
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Arcade")}>
                    Arcade
                  </Dropdown.Item>
                </div>
                <div style={{ flex: 1 }}>
                  <Dropdown.Header style={{ height: "40px" }}>
                    &nbsp;
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item
                    onClick={() => handleGenresClick("Visual Novel")}
                  >
                    Visual Novel
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("Indie")}>
                    Indie
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleGenresClick("Card & Board Game")}
                  >
                    Card & Board Game
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => handleGenresClick("MOBA")}>
                    MOBA
                  </Dropdown.Item>
                </div>
              </div>
            </Dropdown.Menu>
          </Dropdown>
          {genres.map((filter) => (
            <Button
              className="button-x"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                marginLeft: "10px",
                height: "40px",
                border: "1px solid white",
                marginTop: "15px",
                color: "white",
                cursor: "default",
              }}
            >
              {" "}
              {filter}{" "}
              <svg
                style={{ marginLeft: "5px", cursor: "pointer" }}
                onClick={() => handleDelete({ filter })}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </Button>
          ))}
          {platforms.map((filter) => (
            <Button
              className="button-x"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "black",
                marginLeft: "10px",
                height: "40px",
                border: "1px solid white",
                marginTop: "15px",
                color: "white",
                cursor: "default",
              }}
            >
              {" "}
              {filter}{" "}
              <svg
                style={{ marginLeft: "5px", cursor: "pointer" }}
                onClick={() => handleDelete({ filter })}
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-x-circle"
                viewBox="0 0 16 16"
              >
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
              </svg>
            </Button>
          ))}
        </div>

        <main>
          <div className={haveGames ? "body-container" : "noShow"}>
            <motion.div layout className="product-container">
              <AnimatePresence>
                {currentRecords.map((game) => (
                  <div
                    key={game.id}
                    onClick={() =>
                      navigate(`/Game/${game.id}`, {
                        state: { gameDetails: game },
                      })
                    }
                  >
                    <Card
                      name={game.name}
                      first_release_date={game.first_release_date}
                      cover={game.cover ? game.cover.image_id : null}
                    />
                  </div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
          <div className={haveGames ? "noShow" : "body-container"}>
            <div className="empty">
              <p>No games found</p>
            </div>
          </div>
        </main>
        <div className="pagination">
          <Pagination
            current={currentPage}
            posts={recordsPerPage}
            total={original.length}
            paginate={paginate}
          />
        </div>
        <footer className="footer">
          <div className="section footer-top">
            <div className="container">
              <div className="footer-list-img">
                <img src={joystick} alt="logo" />
              </div>
            <div className="footer-list">
              <div className="footer-list-desc">
                <p className="title footer-list-title has-after">About Us</p>
                <p style={{ maxWidth: '300px'}}>
                  Welcome to Cyber Crusaders! Our team has worked tirelessly to create a one-stop gaming platform that caters to all your gaming needs.
                  Cyber Crusaders makes it easy to find relevant game information across different platforms and genres.
                </p>
              </div>
            </div>
              <div className="footer-list">
                <p className="title footer-list-title has-after">Contact Us</p>
                <div className="contact-item">
                  <span className="span">Location:</span>
                  <address className="contact-link">
                    National University of Singapore, 21 Lower Kent Ridge Rd
                  </address>
                </div>
                <div className="contact-item">
                  <span className="span">Join Us:</span>
                  <a href="mailto:e0941187@u.nus.edu" className="contact-link">
                    Lim Jun Ming
                  </a>
                  <br></br>
                  <a href="mailto:e0959239@u.nus.edu" className="contact-link">
                    Pung Kah Jyun
                  </a>
                </div>
                <div className="social-media">
                  <a href="https://www.linkedin.com/">
                    <font color="#007cc4">
                      <i className="fab fa-linkedin"></i>
                    </font>
                  </a>
                  <a href="https://github.com/1uck13ss/Cyber-Crusaders">
                    <font color="#007cc4">
                      <i className="fab fa-github"></i>
                    </font>
                  </a>
                  <a href="https://t.me/kahjyun">
                    <font color="#007cc4">
                      <i className="fab fa-telegram"></i>
                    </font>
                  </a>
                </div>
              </div>
              <div className="footer-list">
                <p className="title footer-list-title has-after">
                  Games Updates Signup
                </p>
                {emailSubscribed ? (
                  <p className="subscription"> Thank you for subscribing! :)</p>
                ) : (
                  <form
                    onSubmit={handleEmailSubscription}
                    method="get"
                    className="footer-form"
                  >
                    <input
                      type="email"
                      name="email_address"
                      required
                      placeholder="Your Email"
                      autocomplete="off"
                      className="input-field"
                      value={user?.email}
                    />
                    <br />
                    <button type="submit" className="btn" data-btn>
                      Subscribe Now
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div className="container">
              <p className="copyright">
                &copy; 2023 CyberCrusaders All Rights Reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default App;
