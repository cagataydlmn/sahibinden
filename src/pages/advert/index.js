import { current } from "@reduxjs/toolkit";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useState } from "react";
import { useSite } from "../../context";
import { addAdvert } from "../../firebase";

export default function Advert() {
  const {
    selectedSubCategory,
    selectedDetail,
    details,
    subCategories,
    selectedMoreDetail,
    selectedCategory,
    categories,
    setSelectedMoreDetail,
    setSelectedDetail,
    setSelectedSubCategory,
    setSelectedCategory,
    moreDetails,
  } = useSite();

  const [isFormVisible, setIsFormVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [detail, setDetail] = useState(null);
  const [tempCategory, setTempCategory] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const [model, setModel] = useState(null);
  const [altcategory, setaltCategory] = useState(null);
  const [marka, setMarka] = useState(null);
  const [yakıt, setYakıt] = useState("");
  const [foto, setFoto] = useState("");
  const [km, setKm] = useState("");
  const [renk, setRenk] = useState("");
  const [hasar, setHasar] = useState("");
  const [takas, setTakas] = useState("");
  const [vites, setVites] = useState("");
  const [brut, setBrut] = useState("");
  const [net, setNet] = useState("");
  const [oda, setOda] = useState("");
  const [bina, setBina] = useState("");
  const [price, setPrice] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const nextStep = () => {
    if (step === 1 && !tempCategory) {
      alert("Lütfen bir kategori seçin.");
      return;
    }
    if (step === 2 && !selectedSubCategory) {
      alert("Lütfen bir alt kategori seçin.");
      return;
    }
    if (step === 3 && !selectedDetail) {
      alert("Lütfen bir detay seçin.");
      return;
    }
    if (step === 4 && !selectedMoreDetail) {
      alert("Lütfen bir daha fazla detay seçin.");
      return;
    }
    if (step === 1 && tempCategory) {
      setSelectedCategory(tempCategory);
    }
    if (step === 2 && altcategory) {
      setSelectedSubCategory(altcategory);
    }

    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleCategorySelect = (categoryId) => {
    setTempCategory(categoryId);
  };
  const handleSubCategorySelect = (subcategoryId) => {
    setaltCategory(subcategoryId);
    setSelectedSubCategory(subcategoryId);
    setIsFormVisible(false);
  };
  const handleDetailSelect = (detailId) => {
    setSelectedDetail(detailId);
    setMarka(detailId);
    setIsFormVisible(false);
  };
  const handleMoreDetailSelect = (moreDetailId) => {
    setSelectedMoreDetail(moreDetailId);
    setModel(moreDetailId);
    setIsFormVisible(true);
  };
  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    if (files.length + photos.length > 10) {
      alert("En fazla 10 fotoğraf yükleyebilirsiniz!");
      return;
    }

    const newPhotos = [...photos, ...files];
    const newPreviews = [
      ...previews,
      ...files.map((file) => URL.createObjectURL(file)),
    ];

    setPhotos(newPhotos);
    setPreviews(newPreviews);
  };
  const removePhoto = (index) => {
    const updatedPhotos = [...photos];
    const updatedPreviews = [...previews];
    updatedPhotos.splice(index, 1);
    updatedPreviews.splice(index, 1);

    setPhotos(updatedPhotos);
    setPreviews(updatedPreviews);
  };
  const handleFileUpload = async (files) => {
    const storage = getStorage();
    const fileUrls = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const storageRef = ref(storage, `images/${file.name}`);

      try {
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        fileUrls.push(downloadURL);
      } catch (error) {
        console.error("Fotoğraf yüklenirken bir hata oluştu:", error);
      }
    }

    return fileUrls;
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    const photoUrls = await handleFileUpload(photos);

    const advertData = {
      model,
      tempCategory,
      altcategory,
      price: parseFloat(price),
      marka,
      createdAt: new Date(),
      foto: photoUrls,
      renk,
      hasar,
      takas,
      brut,
      net,
      oda,
      bina,
      model,
      description,
      title,
      vites,
      yakıt,
    };

    try {
      await addAdvert(advertData);
      alert("İlan başarıyla eklendi!");

      setaltCategory("");
      setYakıt("");
      setMarka("");
      setFoto("");
      setKm("");
      setRenk("");
      setHasar("");
      setTakas("");
      setBrut("");
      setNet("");
      setOda("");
      setBina("");
      setPrice("");
      setTempCategory("");
      setModel("");
      setTitle("");
      setDescription("");
      setVites("");
    } catch (error) {
      console.error("İlan eklenirken hata oluştu:", error);
      alert("İlan eklenirken bir hata oluştu.");
    }
  };

  return (
    <div
      className="addadvert"
      style={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <form onSubmit={submitHandle}>
        {step}
        {step === 1 &&
          categories.map((category) => (
            <button
              type="button"
              key={category.id}
              onClick={() => handleCategorySelect(category.id)}
              value={category}
              style={{
                margin: "5px",
                background: tempCategory === category.id ? "lightblue" : "gray",
              }}
            >
              {category.name}
            </button>
          ))}
        {step === 2 &&
          subCategories.map((sub) => (
            <div
              value={altcategory}
              key={sub.id}
              onClick={() => handleSubCategorySelect(sub.id)}
              style={{
                cursor: "pointer",
                padding: "5px",
                background: selectedSubCategory === sub.id ? "#eee" : "#fff",
              }}
            >
              {sub.name}
            </div>
          ))}

        {step === 3 &&
          details.map((detail) => (
            <div
              key={detail.id}
              value={marka}
              onClick={() => handleDetailSelect(detail.id)}
              style={{
                cursor: "pointer",
                padding: "5px",
                background: selectedDetail === detail.id ? "#eee" : "#fff",
              }}
            >
              {detail.name}
            </div>
          ))}

        {step === 4 && moreDetails && moreDetails.length > 0
          ? moreDetails.map((moreDetail) => (
              <div
                value={model}
                key={moreDetail.id}
                onClick={() => handleMoreDetailSelect(moreDetail.id)}
                style={{
                  cursor: "pointer",
                  padding: "5px",
                  background:
                    selectedMoreDetail === moreDetail.id ? "#eee" : "#fff",
                }}
              >
                {moreDetail.name}
              </div>
            ))
          : 
            step === 4 && setStep((prevStep) => prevStep + 1)}
        {step === 5 && (
          <div>
            <h3>Fotoğrafları Yükleyin</h3>
            <input
              value={foto}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
            />
            {previews.length > 0 && (
              <div
                style={{ display: "flex", flexWrap: "wrap", marginTop: "10px" }}
              >
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    style={{ margin: "10px", textAlign: "center" }}
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      style={{
                        width: "100px",
                        height: "auto",
                        display: "block",
                        marginBottom: "5px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      value={foto}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "5px",
                        cursor: "pointer",
                      }}
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p>{photos.length}/10 fotoğraf yüklendi.</p>
          </div>
        )}

        {step === 6 && (
          <>
            {selectedCategory === "FecwhXkriZmMzoepLg4E" ? (
              <div className="car">
                <h3>Otomobil Detayları</h3>
                <div className="car__title">
                  başlık:
                  <input
                    value={title}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="car__price">
                  fiyat:
                  <input
                    value={price}
                    type="text"
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      const formattedValue = new Intl.NumberFormat(
                        "tr-TR"
                      ).format(rawValue);
                      setPrice(formattedValue);
                    }}
                  />
                </div>
                <div className="car__km">
                  Kilometre:
                  <input
                    value={km}
                    type="text"
                    onChange={(e) => {
                      const rawValue = e.target.value.replace(/\D/g, "");
                      const formattedValue = new Intl.NumberFormat(
                        "tr-TR"
                      ).format(rawValue);
                      setKm(formattedValue); // Durumu güncelle
                    }}
                  />
                </div>
                <div className="car__bilgi">
                  <div className="car__bilgi__renk">
                    Renk:
                    <select
                      value={renk}
                      onChange={(e) => setRenk(e.target.value)}
                    >
                      <option value="">Seçin</option>
                      <option value="red">Kırmızı</option>
                      <option value="black">Siyah</option>
                      <option value="white">Beyaz</option>
                    </select>
                  </div>

                  <div className="car__bilgi__hasar">
                    Ağır Hasar Kaydı:
                    <select
                      value={hasar}
                      onChange={(e) => setHasar(e.target.value)}
                    >
                      <option value="">Seçin</option>
                      <option value="yes">Evet</option>
                      <option value="no">Hayır</option>
                    </select>
                  </div>
                  <div className="car__bilgi__takas">
                    Takaslı mı:
                    <select
                      value={takas}
                      onChange={(e) => setTakas(e.target.value)}
                    >
                      <option value="">Seçin</option>
                      <option value="yes">Evet</option>
                      <option value="no">Hayır</option>
                    </select>
                  </div>
                  <div className="car__bilgi__vites">
                    vites tipi:
                    <select
                      value={vites}
                      onChange={(e) => setVites(e.target.value)}
                    >
                      <option value="">Seçin</option>
                      <option value="yes">otomatik</option>
                      <option value="no">düz</option>
                    </select>
                  </div>
                  <div className="car__bilgi__yakıt">
                    yakıt tipi:
                    <select
                      value={yakıt}
                      onChange={(e) => setYakıt(e.target.value)}
                    >
                      <option value="">Seçin</option>
                      <option value="yes">benzin</option>
                      <option value="no">dizel</option>
                      <option value="no">hibrit</option>
                    </select>
                  </div>
                </div>

                <div className="car__description">
                  açıklama:
                  <textarea
                    value={description}
                    type="text"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              selectedCategory === "PKHj5ev6aFCMDyJVQpka" && (
                <div className="emlak">
                  <h3>Emlak Detayları</h3>
                  <div className="emlak__title">
                    İlan başlığı
                    <input
                      className="emlak__title__input"
                      value={title}
                      type="text"
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="emlak__price">
                    Fiyat:
                    <input
                      value={price}
                      type="text"
                      onChange={(e) => {
                        let rawValue = e.target.value.replace(/[^0-9.]/g, "");

                        rawValue =
                          rawValue.indexOf(".") !== rawValue.lastIndexOf(".")
                            ? rawValue.slice(0, rawValue.lastIndexOf("."))
                            : rawValue;

                        setPrice(rawValue);
                      }}
                      onBlur={() => {
                        if (price) {
                          const formattedValue = new Intl.NumberFormat(
                            "tr-TR"
                          ).format(Number(price));
                          setPrice(formattedValue);
                        }
                      }}
                      onFocus={() => {
                        setPrice(price.replace(/\D/g, ""));
                      }}
                    />
                  </div>

                  <div className="emlak__m2">
                    <div className="emlak__m2__net">
                      Net m2:
                      <input
                        value={net}
                        type="number"
                        onChange={(e) => setNet(e.target.value)}
                      />
                    </div>
                    <div className="emlak__m2__brut">
                      Brüt m2:
                      <input
                        value={brut}
                        type="number"
                        onChange={(e) => setBrut(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="emlak__bilgi">
                    <div className="emlak__bilgi__oda">
                      Oda Sayısı:
                      <select
                        value={oda}
                        onChange={(e) => setOda(e.target.value)}
                      >
                        <option value="">Seçin</option>
                        <option value="1+1">1+1</option>
                        <option value="2+1">2+1</option>
                        <option value="3+1">3+1</option>
                      </select>
                    </div>

                    <div className="emlak__bilgi__yas">
                      Bina Yaşı:
                      <select>
                        <option
                          value={bina}
                          onChange={(e) => setBina(e.target.value)}
                        >
                          Seçin
                        </option>
                        {[...Array(30)].map((_, i) => (
                          <option key={i} value={i + 1}>
                            {i + 1}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="emlak__description">
                    <div>açıklama gir:</div>
                    <textarea
                      value={description}
                      type="text"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>
                </div>
              )
            )}
          </>
        )}
        {step === 7 && (
          <div>
            <h3>İlan Önizlemesi</h3>
            <p>
              <strong>Kategori:</strong>{" "}
              {categories.find((cat) => cat.id === selectedCategory)?.name ||
                "Belirtilmedi"}
            </p>

            <p>
              <strong>Alt Kategori:</strong>{" "}
              {subCategories.find((sub) => sub.id === selectedSubCategory)
                ?.name || "Belirtilmedi"}
            </p>

            <p>
              <strong>Detay:</strong>{" "}
              {details.find((detail) => detail.id === selectedDetail)?.name ||
                "Belirtilmedi"}
            </p>

            <p>
              <strong>Daha Fazla Detay:</strong>{" "}
              {moreDetails.find((more) => more.id === selectedMoreDetail)
                ?.name || "Belirtilmedi"}
            </p>

            <div>
              <h4>Fotoğraflar:</h4>
              {previews.length > 0 ? (
                <div>
                  {previews.map((preview, index) => (
                    <div key={index}>
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        style={{
                          width: "100px",
                          height: "auto",
                          display: "block",
                          marginBottom: "5px",
                        }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p>Fotoğraf yüklenmedi.</p>
              )}
            </div>

            <button
              onClick={submitHandle}
              style={{
                marginTop: "20px",
                padding: "10px",
                backgroundColor: "green",
                color: "white",
                border: "none",
                cursor: "pointer",
              }}
            >
              İlanı Yayınla
            </button>
          </div>
        )}

        {step > 1 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              previousStep();
            }}
          >
            Geri
          </button>
        )}
        {step < 7 && (
          <button
            onClick={(e) => {
              e.preventDefault();
              nextStep();
            }}
          >
            Devam Et
          </button>
        )}
      </form>
    </div>
  );
}
