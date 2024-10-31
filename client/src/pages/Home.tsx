import GameList from "../components/GamesList";
import GenreList from "../components/GenreList";
import Search from "../components/Search";
const Home = () => {
  return (
    <div>
      <div>
        <Search />
      </div>
      <div>
        <div>
          <GenreList />
        </div>

        <div>
          <GameList />
        </div>
      </div>
    </div>
  );
};

export default Home;
