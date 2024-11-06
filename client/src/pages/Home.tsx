import { useState } from "react";
import GameList from "../components/GamesList";
import GenreList from "../components/GenreList";
import Search from "../components/Search";
import Toaster from "../components/Toaster";

const Home = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <Search onLoading={handleLoading} onSearch={showToast} />
        <div className="mt-8 flex flex-col lg:flex-row lg:gap-8">
          <aside className="w-full lg:w-64">
            <GenreList />
          </aside>
          <div className="flex-1">
            <GameList onLoading={handleLoading} onError={showToast} />
          </div>
        </div>
      </main>
      <Toaster message={toastMessage} />
    </div>
  );
};

export default Home;
