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

const App = () => {
  const { gameList, setGameList } = useContext(GameListContext);
  const [currentPage, setCurrent] = useState(1);
  const [original, setOriginal] = useState([]);
  const [genres, setGenres] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [recordsPerPage] = useState(12);
  const [user] = useAuthState(auth);
  const [name, setName] = useState("guest");
  const [photo, setPhoto] = useState(
    "https://st.depositphotos.com/2101611/4338/v/600/depositphotos_43381243-stock-illustration-male-avatar-profile-picture.jpg"
  );
  const [emailSubscribed, setEmailSubscribed] = useState(false); // Track email subscription status
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubscription = () => {
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

    fetchInfo();
    fetchProfilePic();
    fetchUserName();
  }, []);

  useEffect(() => {
    const updateGameList = () => {
      let filteredGames = original;
      if (platforms) {
        filteredGames = original.filter((game) => {
          return (
            game.platforms &&
            platforms.every((filter) => {
              return game.platforms.some((platform) => {
                return (
                  platform.name.toLowerCase().indexOf(filter.toLowerCase()) !==
                  -1
                );
              });
            })
          );
        });
      }
      if (genres) {
        filteredGames = filteredGames.filter((game) => {
          return (
            game.genres &&
            genres.every((filter) => {
              return game.genres.some((genre) => genre.name === filter);
            })
          );
        });
      }
      setGameList(filteredGames);
    };

    updateGameList();
  }, [original, platforms, genres]);

  const fetchInfo = async () => {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", "e0kFMFio5QaHanAseqBII1Shr66hKS9n7uDXJHvh");
    myHeaders.append("Content-Type", "text/plain");

    const currentDate = Math.floor(Date.now() / 1000);

    var raw = `fields name, first_release_date, cover.image_id, genres.name, platforms.name, summary,
    release_dates;
      where first_release_date > ${currentDate};
      limit 19;
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

  const filterCondition = (filter, type) => {
    if (type && (!genres || !genres.includes(filter))) {
      setGenres([...genres, filter]);
      return true;
    } else if (
      !type &&
      (!platforms ||
        platforms.every(
          (platform) =>
            filter.toLowerCase().indexOf(platform.toLowerCase()) === -1
        ))
    ) {
      setPlatforms([...platforms, filter]);
      return true;
    } else if (type) {
      setGenres(genres.filter((g) => g !== filter));
      return false;
    } else {
      setPlatforms(
        platforms.filter(
          (p) => filter.toLowerCase().indexOf(p.toLowerCase()) === -1
        )
      );
      return false;
    }
  };

  const paginate = (pageNumber) => {
    setCurrent(pageNumber);
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = gameList.slice(indexOfFirstRecord, indexOfLastRecord);

  return (
    <>
      <NavBar gameList={gameList}></NavBar>
      <div className="wrapper">
        {/*  <header>
        <div className="nav-container">
          <div className="logo">
            <a className="cc">CyberCrusaders</a>
          </div>
          <nav className="platform-filter">
            <Platform filterByPlatform={filterCondition} />
          </nav>
        </div>

        <div className="nav-container1">
          <div className="user-container">
            <div className="emailname">{user && <span>Hello {name}</span>}</div>
            <div className="profile">
              <Link to="/Profile" className="Profile">
                My Profile
              </Link>
            </div>
            <button onClick={handleLogout} className="logout-button">
              Log out
            </button>
          </div>
        </div>
      </header> */}
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
                <Dropdown.Item>PC</Dropdown.Item>
                <Dropdown.Item>Nintendo Switch</Dropdown.Item>
                <Dropdown.Item>PlayStation</Dropdown.Item>
                <Dropdown.Item>Xbox</Dropdown.Item>
                <Dropdown.Item>Android</Dropdown.Item>
                <Dropdown.Item>IOS</Dropdown.Item>
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
                <Dropdown.Item>Point-and-click</Dropdown.Item>
                <Dropdown.Item>Fighting</Dropdown.Item>
                <Dropdown.Item>Shooter</Dropdown.Item>
                <Dropdown.Item>Music</Dropdown.Item>
                <Dropdown.Item>Platform</Dropdown.Item>
                <Dropdown.Item>Puzzle</Dropdown.Item>
                <Dropdown.Item>Racing</Dropdown.Item>
                <Dropdown.Item>RTS</Dropdown.Item>
                <Dropdown.Item>RPG</Dropdown.Item>
              </div>
              <div style={{ flex: 1 }}>
                <Dropdown.Header style={{ height: "40px" }}>
                  &nbsp;
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item>Simulator</Dropdown.Item>
                <Dropdown.Item>Sport</Dropdown.Item>
                <Dropdown.Item>Strategy</Dropdown.Item>
                <Dropdown.Item>TBS</Dropdown.Item>
                <Dropdown.Item>Tactical</Dropdown.Item>
                <Dropdown.Item>Quiz</Dropdown.Item>
                <Dropdown.Item>Hack and Slash</Dropdown.Item>
                <Dropdown.Item>Adventure</Dropdown.Item>
                <Dropdown.Item>Arcade</Dropdown.Item>
              </div>
              <div style={{ flex: 1 }}>
                <Dropdown.Header style={{ height: "40px" }}>
                  &nbsp;
                </Dropdown.Header>
                <Dropdown.Divider />
                <Dropdown.Item>Visual Novel</Dropdown.Item>
                <Dropdown.Item>Indie</Dropdown.Item>
                <Dropdown.Item>Card & Board Game</Dropdown.Item>
                <Dropdown.Item>MOBA</Dropdown.Item>
                {/* Add more genre options here */}
              </div>
            </div>
          </Dropdown.Menu>
        </Dropdown>

        <main>
          <div className="body-container">
            {/* fields name, release_dates, screenshots, prices */}
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
        </main>
        <div className="pagination">
          <Pagination
            current={currentPage}
            posts={recordsPerPage}
            total={gameList.length}
            paginate={paginate}
          />
        </div>
        <footer className="footer">
          <div className="section footer-top">
            <div className="container">
              <div className="footer-brand">
                <img
                  className="footer-profile"
                  src={photo}
                  width="75"
                  height="75"
                  loading="lazy"
                  alt="CC logo"
                />
              </div>
              <div className="footer-list-img">
                <img src={joystick} alt="logo" />
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
                      value={user.email}
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
