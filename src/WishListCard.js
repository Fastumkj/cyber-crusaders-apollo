import icon from "./assets/icon.jpg";
import "./styles/WishListCard.css";
import { db, auth } from "./utils/firebase";
import {
  writeBatch,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const WishListCard = (game) => {
  let imageUrl = icon;
  if (game.cover) {
    imageUrl =
      "https://images.igdb.com/igdb/image/upload/t_cover_big/" +
      game.cover +
      ".jpg";
  }

  const remove = async () => {
    var db_ref = collection(db, auth.currentUser.uid);
    let batch = writeBatch(db);
    const game_ref = query(db_ref, where("gameDetails.id", "==", game.id));
    const querySnapshot = await getDocs(game_ref);

    querySnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });
    return batch.commit();
  };

  const convert = (release_date) => {
    if (release_date == null) {
      return "No information";
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

  return (
    <div className="wishListCard">
      <img src={imageUrl} alt="game-art"></img>
      <div className="cardDetails">
        <h1> {game.name} </h1>
        <h3> {convert(game.first_release_date)} </h3>
        <img
          className="redX"
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIiq7sZW1MwcJYH5gj-7UsvNp6K379AzJ_yg&usqp=CAU"
          alt="X"
          onClick={remove}
        />
      </div>
    </div>
  );
};

export default WishListCard;
