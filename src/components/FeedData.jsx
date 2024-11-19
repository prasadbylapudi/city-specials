import React, { useState, useEffect, useContext } from "react";
import Header from "./Header";
import { UserContext } from "../utils/userContext";
import axios from "axios";
import "../App.css";

const PostsFeed = () => {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [interactions, setInteractions] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const { loggedInUser, email } = useContext(UserContext);

  useEffect(() => {
    fetch("http://localhost:8000/posts")
      .then((response) => response.json())
      .then((data) => {
        setPosts(data);
        setFilteredPosts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching posts:", error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetch("http://localhost:8000/post-interactions")
      .then((response) => response.json())
      .then((data) => {
        console.log("Interactions fetched:", data);
        setInteractions(data);
      })
      .catch((error) => {
        console.error("Error fetching interactions:", error);
      });
  }, []);

  const handleInteraction = async (postId, interactionType) => {
    console.log(`making request for ${interactionType} interaction`);

    try {
      const response = await fetch("http://localhost:8000/post-interactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          post_id: postId,
          user_identifier: email,
          type: interactionType,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setInteractions((prev) => {
          const updated = { ...prev };
          if (!updated[postId]) updated[postId] = {};
          updated[postId][interactionType] = [
            ...(updated[postId][interactionType] || []),
            { post_id: postId, type: interactionType, user_identifier: email },
          ];
          return updated;
        });
        console.log("interactions", interactions);
        // alert(data.message); // Success message
      } else if (response.status === 409) {
        alert("You have already recorded this interaction.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      alert("Something went wrong. Please try again.");
      console.error(error);
    }
  };
  const isInteracted = (postId, interactionType) => {
    const postInteractions = interactions[postId]?.[interactionType];
    console.log("postInteractions", postInteractions);
    return postInteractions?.some(
      (interaction) => interaction.user_identifier === email
    );
  };

  const handleFilter = () => {
    const filtered = posts.filter((post) => {
      const matchesSearch = post.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesLocation =
        selectedLocation === "All" || post.location === selectedLocation;
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      return matchesSearch && matchesLocation && matchesCategory;
    });
    setFilteredPosts(filtered);
  };

  useEffect(() => {
    handleFilter();
  }, [searchQuery, selectedLocation, selectedCategory]);

  const uniqueLocations = [...new Set(posts.map((post) => post.location))];
  const uniqueCategories = [...new Set(posts.map((post) => post.category))];

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 py-10">
        <div className="container mx-auto px-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row md:justify-between mb-6 gap-4">
            <input
              type="text"
              placeholder="Search by title..."
              className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <select
              className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
            >
              <option value="All">All Locations</option>
              {uniqueLocations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
            <select
              className="w-full md:w-1/3 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              {uniqueCategories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Posts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                {post.image_url && (
                  <img
                    src={post.image_url}
                    alt={post.title}
                    className="h-48 w-full object-cover"
                  />
                )}
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mt-2 line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <span className="text-sm text-gray-500">
                      Location: {post.location}
                    </span>
                    <span
                      className={`text-sm text-white px-3 py-1 rounded-full ${
                        post.category === "Food"
                          ? "bg-rose-500"
                          : post.category === "Nature"
                          ? "bg-green-500"
                          : post.category === "Adventure"
                          ? "bg-yellow-500"
                          : post.category === "Art"
                          ? "bg-sky-500"
                          : "bg-gray-400"
                      }`}
                    >
                      {post.category}
                    </span>
                  </div>

                  <div className="mt-4 flex justify-around items-center">
                    {/* Like Button */}
                    <div className="relative group">
                      <button
                        onClick={() => handleInteraction(post.id, "like")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                          interactions[post.id]?.liked
                            ? "bg-red-500 text-red-600"
                            : "bg-gray-200 text-gray-600 hover:bg-blue-100"
                        } transition-colors`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={interactions[post.id]?.liked ? "red" : "none"}
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                          />
                        </svg>
                      </button>
                      <span className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg">
                        Like
                      </span>
                    </div>
                    {/* Dislike Button */}
                    <div className="relative group">
                      <button
                        onClick={() => handleInteraction(post.id, "dislike")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                          interactions[post.id]?.disliked
                            ? "bg-blue-100 text-blue-600"
                            : "bg-gray-200 text-gray-600 hover:bg-blue-100"
                        } transition-colors`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={
                            interactions[post.id]?.disliked ? "blue" : "none"
                          }
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10 14H5.236c-.952 0-1.786-.717-1.894-1.663l-.67-5.57A2 2 0 014.656 4h4.97c.451 0 .887-.158 1.24-.445L12 2m0 0l1.134 1.155C13.486 3.842 13.92 4 14.37 4h2.024a2 2 0 011.896 2.765l-.673 5.57c-.108.946-.942 1.663-1.894 1.663H14m-4 0v6.5a1.5 1.5 0 003 0V14m-3 0h3"
                          />
                        </svg>
                      </button>
                      <span className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg">
                        Dislike
                      </span>
                    </div>
                    {/* Poop Button */}
                    <div className="relative group">
                      <button
                        onClick={() => handleInteraction(post.id, "poop")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                          interactions[post.id]?.pooped
                            ? "bg-orange-950 text-amber-700"
                            : "bg-gray-200 text-gray-600 hover:bg-amber-200"
                        } transition-colors`}
                      >
                        <span
                          role="img"
                          aria-label="poop"
                          className="inline-block text-2xl"
                        >
                          💩
                        </span>
                      </button>
                      <span className="absolute left-1/2 bottom-full mb-2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-gray-800 text-white text-sm rounded-md px-2 py-1 shadow-lg">
                        Poop
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* No Posts Found */}
        {filteredPosts.length === 0 && (
          <p className="text-center text-gray-600 mt-8">
            No posts match your search criteria. wait while we fetch Posts.
          </p>
        )}
      </div>
    </>
  );
};

export default PostsFeed;
