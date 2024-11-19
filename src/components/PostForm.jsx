import React, { useState, useContext } from "react";
import { Cloudinary } from "@cloudinary/url-gen";
import { auto } from "@cloudinary/url-gen/actions/resize";
import { autoGravity } from "@cloudinary/url-gen/qualifiers/gravity";
import { AdvancedImage } from "@cloudinary/react";
import { UserContext } from "../utils/userContext";

const PostForm = () => {
  const { loggedInUser, email } = useContext(UserContext);

  const [formData, setFormData] = useState({
    username: loggedInUser,
    email: email,
    title: "",
    description: "",
    location: "",
    category: "",
    image: null,
    showCategoryDropdown: false, // Control dropdown visibility
  });
  const [uploadedImage, setUploadedImage] = useState(null); // Store uploaded image for display
  const cloudinary = new Cloudinary({ cloud: { cloudName: "dcumn7yfo" } });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    if (
      !formData.title ||
      !formData.description ||
      !formData.location ||
      !formData.category
    ) {
      alert("Please fill out all fields.");
      return;
    }

    let imageUrl = "";
    if (formData.image) {
      const formDataImage = new FormData();
      formDataImage.append("file", formData.image);
      formDataImage.append("upload_preset", "mycities");

      try {
        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dcumn7yfo/image/upload",
          {
            method: "POST",
            body: formDataImage,
          }
        );
        if (!res.ok) {
          alert("Failed to upload image to Cloudinary.");
        }
        const data = await res.json();
        console.log("CLoudiary Image data", data);
        imageUrl = data.secure_url;

        console.log("imageURL", imageUrl);
        // Store the uploaded image for display
        setUploadedImage(
          cloudinary
            .image(data.public_id)
            .resize(auto().gravity(autoGravity()).width(500).height(500))
        );
      } catch (error) {
        console.error("Image upload failed:", error);
        alert("Image upload failed. Please try again.");
        return;
      }
    }

    if (!imageUrl) {
      alert("Image upload failed. Please try again.");
      return;
    }

    // Submit post data to the server
    const postPayload = {
      username: formData.username,
      email: formData.email,
      title: formData.title,
      description: formData.description,
      location: formData.location,
      category: formData.category,
      image_url: imageUrl,
    };

    console.log("postPayload", postPayload);

    try {
      console.log("reached try about to post");
      const response = await fetch("http://localhost:8000/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postPayload),
      });

      const data = await response.json();
      console.log("Post created:", data);
      alert("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Post creation failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 flex justify-center">
      <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Create a Post
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="title"
              className="block text-gray-700 font-medium mb-2"
            >
              Title
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter the title"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="block text-gray-700 font-medium mb-2"
            >
              Description
            </label>
            <textarea
              name="description"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              placeholder="Enter the description"
              rows="4"
              required
            ></textarea>
          </div>
          <div className="mt-4">
            <label
              htmlFor="location"
              className="block text-gray-700 font-medium mb-2"
            >
              Location
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full text-left px-4 py-2 border rounded-md bg-gray-100 focus:ring focus:ring-blue-300 flex justify-between items-center"
                onClick={() =>
                  setFormData({
                    ...formData,
                    showLocationDropdown: !formData.showLocationDropdown,
                  })
                }
              >
                {formData.location || "Select Location"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {formData.showLocationDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-40 overflow-y-auto">
                  {[
                    "Vizag",
                    "Srikakulam",
                    "Vijayawada",
                    "Kurnool",
                    "Godavari",
                    "Srisailam",
                  ].map((city) => (
                    <button
                      key={city}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          location: city,
                          showLocationDropdown: false,
                        })
                      }
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="category"
              className="block text-gray-700 font-medium mb-2"
            >
              Category
            </label>
            <div className="relative">
              <button
                type="button"
                className="w-full text-left px-4 py-2 border rounded-md bg-gray-100 focus:ring focus:ring-blue-300 flex justify-between items-center"
                onClick={() =>
                  setFormData({
                    ...formData,
                    showCategoryDropdown: !formData.showCategoryDropdown,
                  })
                }
              >
                {formData.category || "Select Category"}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {formData.showCategoryDropdown && (
                <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg">
                  {["Adventure", "Nature", "Art", "Food"].map((item) => (
                    <button
                      key={item}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          category: item,
                          showCategoryDropdown: false,
                        })
                      }
                      className="block w-full text-left px-4 py-2 hover:bg-gray-200"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label
              htmlFor="image"
              className="block text-gray-700 font-medium mb-2"
            >
              Upload Image
            </label>
            <input
              type="file"
              name="image"
              id="image"
              onChange={handleImageChange}
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300"
              accept="image/*"
            />
          </div>

          {uploadedImage && (
            <div className="mt-4">
              <h3 className="text-gray-700 font-medium mb-2">
                Uploaded Image:
              </h3>
              <AdvancedImage cldImg={uploadedImage} />
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Submit Post
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
