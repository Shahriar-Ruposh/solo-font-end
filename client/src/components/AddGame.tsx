import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserGameThunk } from "../store/userGameReducer";
import { RootState } from "../store/store";
import { fetchGenresThunk } from "../store/genresReducer";
import Select from "react-select";
import { toast } from "react-toastify";

const AddGame: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const { data: genres } = useSelector((state: RootState) => state.genres);

  const [formData, setFormData] = useState({
    title: "",
    publisher: "",
    release_date: "",
    description: "",
    genres: [] as string[],
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState();
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    dispatch(fetchGenresThunk() as any);
  }, [dispatch]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.title) newErrors.title = "Title is required.";
    if (!formData.publisher) newErrors.publisher = "Publisher is required.";
    if (!formData.release_date) newErrors.release_date = "Release date is required.";
    if (!formData.description) newErrors.description = "Description is required.";
    if (formData.genres.length === 0) newErrors.genres = "Select at least one genre.";
    if (!thumbnail) newErrors.thumbnail = "Thumbnail is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const gameData = { ...formData, thumbnail };
    console.log(">>>>>>>>>>>", thumbnail);
    if (token) {
      try {
        await dispatch(createUserGameThunk(gameData, token) as any);
        toast.success("Game added successfully!");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 2000);
      } catch (error) {
        toast.error("Failed to add game. Please try again.");
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenreChange = (selectedOptions: any) => {
    setFormData((prev) => ({
      ...prev,
      genres: selectedOptions ? selectedOptions.map((option: any) => option.value) : [],
    }));
  };

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    console.log(file);
    //@ts-ignore
    setThumbnail(file);
    console.log(thumbnail);
    //@ts-ignore
    setThumbnailPreview(file ? URL.createObjectURL(file) : null);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    //@ts-ignore
    setThumbnailPreview(null);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 p-6">
      <form onSubmit={handleSubmit} className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg p-8 space-y-6">
        <h2 className="text-3xl font-semibold text-white mb-6">Add New Game</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Thumbnail Upload Section */}
          <div className="col-span-1 flex flex-col items-center space-y-4">
            <label className="block text-white font-medium mb-1">Thumbnail</label>
            {thumbnailPreview ? (
              <div className="relative">
                <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-32 h-32 object-cover rounded-md border border-gray-300" />
                <button type="button" onClick={removeThumbnail} className="absolute top-0 right-0 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center">
                  &times;
                </button>
              </div>
            ) : (
              <input type="file" accept="image/*" onChange={handleThumbnailChange} className="w-full border border-gray-500 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-300" />
            )}
            {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail}</p>}
          </div>

          {/* Form Fields Section */}
          <div className="col-span-2 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-medium mb-1">Title</label>
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Title" className="w-full border border-gray-500 rounded-md px-4 py-2 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-white font-medium mb-1">Publisher</label>
              <input
                name="publisher"
                value={formData.publisher}
                onChange={handleInputChange}
                placeholder="Publisher"
                className="w-full border border-gray-500 rounded-md px-4 py-2 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher}</p>}
            </div>

            <div>
              <label className="block text-white font-medium mb-1">Release Date</label>
              <input type="date" name="release_date" value={formData.release_date} onChange={handleInputChange} className="w-full border border-gray-500 rounded-md px-4 py-2 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
              {errors.release_date && <p className="text-red-500 text-sm mt-1">{errors.release_date}</p>}
            </div>

            <div>
              <label className="block text-white font-medium mb-1">Genres</label>
              <Select
                options={genres?.map((genre) => ({ value: genre.id, label: genre.name }))}
                isMulti
                placeholder="Select genres"
                onChange={handleGenreChange}
                styles={{
                  control: (base) => ({ ...base, backgroundColor: "#2d3748", borderColor: "#4a5568", color: "#e2e8f0" }),
                  multiValue: (base) => ({ ...base, backgroundColor: "#2b6cb0", color: "#e2e8f0" }),
                  placeholder: (base) => ({ ...base, color: "#a0aec0" }),
                }}
              />
              {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres}</p>}
            </div>

            <div className="col-span-2">
              <label className="block text-white font-medium mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Description"
                className="w-full border border-gray-500 rounded-md px-4 py-2 bg-gray-700 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-medium py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Add Game
        </button>
      </form>
    </div>
  );
};

export default AddGame;
