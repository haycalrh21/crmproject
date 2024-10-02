import axios from "axios";

async function uploadImageToCloudinary(file: File) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append(
    "upload_preset",
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "default_preset"
  );

  const response = await axios.post(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`,
    formData
  );

  return response.data.secure_url; // Mengembalikan URL gambar yang diupload
}
