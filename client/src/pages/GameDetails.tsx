import { useParams } from "react-router-dom";
import GameDetails from "../components/GameDetails";
import Comment from "../components/Comment";
import Rating from "../components/Rating";

const GameDetailsPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  return (
    <div>
      <GameDetails />
      <Rating gameId={gameId} />
      <Comment gameId={gameId} />
    </div>
  );
};

export default GameDetailsPage;
