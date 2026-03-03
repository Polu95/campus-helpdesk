import { useState } from "react";
import API from "../api/axios";

const CreateComplaint = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("image", image);

    try {
      const res = await API.post("/complaints", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Complaint submitted successfully!");
      console.log(res.data);

      setTitle("");
      setDescription("");
      setCategory("");
      setImage(null);

    } catch (error) {
      console.error(error);
      alert("Error submitting complaint");
    }
  };

  return (
    <div>
      <h2>Create Complaint</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <br />

        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <br />

        <input
          type="text"
          placeholder="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />

        <br />

        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />

        <br />

        <button type="submit">Submit Complaint</button>
      </form>
    </div>
  );
};

export default CreateComplaint;