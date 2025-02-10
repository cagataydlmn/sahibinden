import React, { useState } from "react";
import { deleteImage, updateAdvert, uploadImage } from "../../firebase";

const AdvertModal = ({ advert, onUpdate, onClose }) => {
  const [model, setModel] = useState(advert.model || null);
  const [altcategory, setaltCategory] = useState(advert.altcategory || null);
  const [marka, setMarka] = useState(advert.marka || null);
  const [yakıt, setYakıt] = useState(advert.yakıt || "");
  const [foto, setFoto] = useState(advert.foto || []);  // Fotoğraf dizisi
  const [km, setKm] = useState(advert.km || "");
  const [renk, setRenk] = useState(advert.renk || "");
  const [hasar, setHasar] = useState(advert.hasar || "");
  const [takas, setTakas] = useState(advert.takas || "");
  const [vites, setVites] = useState(advert.vites || "");
  const [brut, setBrut] = useState(advert.brut || "");
  const [net, setNet] = useState(advert.net || "");
  const [oda, setOda] = useState(advert.oda || "");
  const [bina, setBina] = useState(advert.bina || "");
  const [price, setPrice] = useState(advert.price || "");
  const [title, setTitle] = useState(advert.title || "");
  const [description, setDescription] = useState(advert.description || "");
  const [selectedCategory] = useState(advert.categoryId || "");

  // Fotoğraf ekleme fonksiyonu
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const photoURL = await uploadImage(file); // Fotoğrafı Firebase Storage'a yükle
        setFoto((prevFotos) => [...prevFotos, photoURL]); // Fotoğraf URL'sini dizine ekle
      } catch (error) {
        console.error("Fotoğraf yüklenirken hata oluştu:", error);
      }
    }
  };

  // Fotoğraf silme fonksiyonu
  const handleImageDelete = async (photoURL) => {
    try {
      await deleteImage(photoURL); // Fotoğrafı Firebase Storage'dan sil
      setFoto((prevFotos) => prevFotos.filter((url) => url !== photoURL)); // Fotoğraf dizisinden çıkar
    } catch (error) {
      console.error("Fotoğraf silinirken hata oluştu:", error);
    }
  };

  // Kategoriye bağlı input alanlarını render eden fonksiyon
  const renderCategoryFields = () => {
    if (selectedCategory === "FecwhXkriZmMzoepLg4E") {
      // Araba kategorisi
      return (
        <>
          <label>
            KM:
            <input
              type="text"
              value={km}
              onChange={(e) => setKm(e.target.value)}
            />
          </label>
          <label>
            Renk:
            <input
              type="text"
              value={renk}
              onChange={(e) => setRenk(e.target.value)}
            />
          </label>
          <label>
            Hasar:
            <input
              type="text"
              value={hasar}
              onChange={(e) => setHasar(e.target.value)}
            />
          </label>
          <label>
            Takas:
            <input
              type="checkbox"
              checked={takas}
              onChange={(e) => setTakas(e.target.checked)}
            />
          </label>
          <label>
            Vites:
            <select value={vites} onChange={(e) => setVites(e.target.value)}>
              <option value="">Seçin</option>
              <option value="manuel">Manuel</option>
              <option value="otomatik">Otomatik</option>
            </select>
          </label>
          <label>
            Yakıt:
            <select value={yakıt} onChange={(e) => setYakıt(e.target.value)}>
              <option value="">Seçin</option>
              <option value="benzin">Benzin</option>
              <option value="dizel">Dizel</option>
              <option value="elektrik">Elektrik</option>
            </select>
          </label>
        </>
      );
    } else if (selectedCategory === "PKHj5ev6aFCMDyJVQpka") {
      // Emlak kategorisi
      return (
        <>
          <h3>Emlak İlanı</h3>
          <label>
            Net m²:
            <input
              type="text"
              value={net}
              onChange={(e) => setNet(e.target.value)}
            />
          </label>
          <label>
            Brüt m²:
            <input
              type="text"
              value={brut}
              onChange={(e) => setBrut(e.target.value)}
            />
          </label>
          <label>
            Oda Sayısı:
            <input
              type="text"
              value={oda}
              onChange={(e) => setOda(e.target.value)}
            />
          </label>
          <label>
            Bina Yaşı:
            <input
              type="text"
              value={bina}
              onChange={(e) => setBina(e.target.value)}
            />
          </label>
        </>
      );
    }
  };

  // Form submit fonksiyonu
  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {};

    // Güncellenen alanları kontrol et
    if (price !== advert.price) updatedData.price = parseFloat(price);
    if (km !== advert.km) updatedData.km = km;
    if (renk !== advert.renk) updatedData.renk = renk;
    if (hasar !== advert.hasar) updatedData.hasar = hasar;
    if (takas !== advert.takas) updatedData.takas = takas;
    if (vites !== advert.vites) updatedData.vites = vites;
    if (yakıt !== advert.yakıt) updatedData.yakıt = yakıt;
    if (description !== advert.description) updatedData.description = description;
    if (title !== advert.title) updatedData.title = title;
    if (model !== advert.model) updatedData.model = model;
    if (marka !== advert.marka) updatedData.marka = marka;
    if (altcategory !== advert.altcategory) updatedData.altcategory = altcategory;
    if (brut !== advert.brut) updatedData.brut = brut;
    if (net !== advert.net) updatedData.net = net;
    if (oda !== advert.oda) updatedData.oda = oda;
    if (bina !== advert.bina) updatedData.bina = bina;

    // Fotoğraf dizisini güncelle
    if (foto !== advert.foto) updatedData.foto = foto;

    // Eğer kategori değiştiyse, onu da güncelle
    if (selectedCategory !== advert.categoryId) updatedData.categoryId = selectedCategory;

    // Firebase'de güncellemeyi yap
    if (Object.keys(updatedData).length > 0) {
      try {
        await updateAdvert(advert.id, updatedData);
        resetForm();
      } catch (error) {
        console.error("Güncelleme sırasında hata oluştu:", error);
      }
    }

    onClose();
  };

  // Formu sıfırlama fonksiyonu
  const resetForm = () => {
    setaltCategory("");
    setYakıt("");
    setMarka("");
    setFoto([]);  
    setKm("");
    setRenk("");
    setHasar("");
    setTakas("");
    setBrut("");
    setNet("");
    setOda("");
    setBina("");
    setPrice("");
    setModel("");
    setTitle("");
    setDescription("");
    setVites("");
  };

  return (
    <div className="modal-overlay">
      <div className="model-content">
        <form onSubmit={handleSubmit}>
          <h2>İlan Güncelle</h2>

          {/* Fotoğrafları gösterme ve silme */}
          <div>
            <h3>Fotoğraflar</h3>
            <input type="file" onChange={handleImageUpload} />
            <div>
              {foto && foto.map((url, index) => (
                <div key={index}    style={{
                  flexDirection:"column"
                  }}>
                  <img src={url} alt={`Fotoğraf ${index}`} style={{ width: 100, height: 100 }} />
                  <button type="button" onClick={() => handleImageDelete(url)}>Sil</button>
                </div>
              ))}
            </div>
          </div>

          {/* Başlık ve Fiyat */}
          <label>
            Başlık:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </label>
          <label>
            Fiyat:
            <input
              type="text"
              value={price}
              onChange={(e) => {
                const rawValue = e.target.value.replace(/\D/g, ""); // Sadece rakamlar
                setPrice(rawValue);
              }}
            />
          </label>

          {/* Kategoriye bağlı input alanları */}
          {renderCategoryFields()}

          {/* Açıklama */}
          <label>
            Açıklama:
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </label>

          <button type="submit">Güncelle</button>
          <button type="button" onClick={onClose}>
            Kapat
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdvertModal;
