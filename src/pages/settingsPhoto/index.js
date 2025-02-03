import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfilePhoto } from "../../firebase"; // Thunk fonksiyonu

const ProfilePhotoUpload = () => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Lütfen bir dosya seçin!");
      return;
    }

    setUploading(true);
    setError("");
    setSuccess("");

    try {
      // Redux'a sadece URL gönderiyoruz!
      await dispatch(updateProfilePhoto(selectedFile));
      setSuccess("Profil fotoğrafı başarıyla güncellendi!");
    } catch (error) {
      console.error("Fotoğraf güncellenirken hata oluştu:", error.message);
      setError("Fotoğraf yüklenirken bir hata oluştu.");
    } finally {
      setUploading(false);
    }
  };
  return (
    <div>
      <h2>Profil Fotoğrafı Güncelle</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? "Yükleniyor..." : "Yükle"}
      </button>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>{success}</p>}
    </div>
  );
};

export default ProfilePhotoUpload;
