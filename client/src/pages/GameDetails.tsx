import { useParams } from "react-router-dom";
import GameDetails from "../components/GameDetails";
import Comment from "../components/Comment";
import Rating from "../components/Rating";

const GameDetailsPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <GameDetails />
        <div className="mt-8 grid gap-8 md:grid-cols-2">
          <Rating gameId={gameId ?? ""} />
          <Comment gameId={gameId ?? ""} />
        </div>
      </div>
    </div>
  );
};

export default GameDetailsPage;
