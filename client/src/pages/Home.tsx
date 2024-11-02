import GameList from "../components/GamesList";
import GenreList from "../components/GenreList";
import Search from "../components/Search";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <Search />
        <div className="mt-8 flex flex-col lg:flex-row lg:gap-8">
          <aside className="w-full lg:w-64">
            <GenreList />
          </aside>
          <div className="flex-1">
            <GameList />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
