import { useState } from "react";
import { useDispatch } from "react-redux";
import { updateProfilePhoto } from "../../firebase"; // Thunk fonksiyonu

const ProfilePhotoUpload = () => {
  const dispatch = useDispatch();
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // Fotoğrafın önizlemesi için state

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    // Fotoğraf seçildiyse, önizlemeyi oluştur
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
    }
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
      
      {/* Seçilen fotoğraf varsa, önizlemeyi göster */}
      {previewUrl && (
        <div>
          <img src={previewUrl} alt="Preview" style={{ width: "100px", height: "100px", objectFit: "cover" }} />
        </div>
      )}

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