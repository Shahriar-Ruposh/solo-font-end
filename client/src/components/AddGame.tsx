import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createUserGameThunk } from "../store/userGameReducer";
import { RootState } from "../store/store";
import { fetchGenresThunk } from "../store/genresReducer";
import Select from "react-select";
import Toaster from "../components/Toaster";

export default function AddGame() {
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
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [toasterMessage, setToasterMessage] = useState("");
  const [toasterColor, setToasterColor] = useState("green");

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchGenresThunk() as any);
  }, []);

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

    setLoading(true);
    const gameData = { ...formData, thumbnail };

    if (token) {
      try {
        await dispatch(createUserGameThunk(gameData, token) as any);
        setToasterMessage("Game added successfully!");
        setToasterColor("green");
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 800);
      } catch (error) {
        setToasterMessage("Failed to add game. Please try again.");
        setToasterColor("red");
      } finally {
        setLoading(false);
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
    if (file) {
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="min-h-screen bg-[#1a1f2e]">
      <div className="container mx-auto p-6">
        <div className="bg-[#1e2536] rounded-lg shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left side - Image Upload */}
            <div className="p-6 flex flex-col items-center justify-center">
              {thumbnailPreview ? (
                <div className="relative w-full">
                  <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-[400px] object-cover rounded-lg" />
                  <button type="button" onClick={removeThumbnail} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-700">
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-full h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-600 rounded-lg">
                  <input type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" ref={fileInputRef} />
                  <button type="button" onClick={handleUploadClick} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                    Upload Thumbnail
                  </button>
                </div>
              )}
              {errors.thumbnail && <p className="text-red-500 text-sm mt-2">{errors.thumbnail}</p>}
            </div>

            {/* Right side - Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Title</label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full bg-[#2a3142] border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter game title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Publisher</label>
                  <input
                    name="publisher"
                    value={formData.publisher}
                    onChange={handleInputChange}
                    className="w-full bg-[#2a3142] border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter publisher name"
                  />
                  {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Genres</label>
                  <Select
                    options={genres?.map((genre) => ({ value: genre.id, label: genre.name }))}
                    isMulti
                    onChange={handleGenreChange}
                    className="text-gray-200"
                    styles={{
                      control: (base) => ({
                        ...base,
                        backgroundColor: "#2a3142",
                        borderColor: "#4a5568",
                      }),
                      menu: (base) => ({
                        ...base,
                        backgroundColor: "#2a3142",
                      }),
                      option: (base, state) => ({
                        ...base,
                        backgroundColor: state.isFocused ? "#3a4356" : "#2a3142",
                        color: "#e2e8f0",
                      }),
                      multiValue: (base) => ({
                        ...base,
                        backgroundColor: "#3b82f6",
                      }),
                      multiValueLabel: (base) => ({
                        ...base,
                        color: "white",
                      }),
                      multiValueRemove: (base) => ({
                        ...base,
                        color: "white",
                        ":hover": {
                          backgroundColor: "#2563eb",
                          color: "white",
                        },
                      }),
                    }}
                  />
                  {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Release Date</label>
                  <input type="date" name="release_date" value={formData.release_date} onChange={handleInputChange} className="w-full bg-[#2a3142] border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  {errors.release_date && <p className="text-red-500 text-sm mt-1">{errors.release_date}</p>}
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-[#2a3142] border border-gray-600 rounded-md px-4 py-2 text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter game description"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-[#1e2536] disabled:opacity-50">
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Adding Game...
                    </div>
                  ) : (
                    "Add Game"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster message={toasterMessage} color={toasterColor} />
    </div>
  );
}
