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
        console.log(isFormVisible);
      }
    }

    return fileUrls;
  };

  const submitHandle = async (e) => {
    e.preventDefault();

    const photoUrls = await handleFileUpload(photos);

    const advertData = {
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
    <div className="addadvert flex justify-center py-6">
      <form onSubmit={submitHandle} className="w-full max-w-4xl space-y-6">
        <div>
          {step === 1 &&
            categories.map((category) => (
              <div className="flex w-full mb-4" key={category.id}>
                <button
                  className={`w-full py-3 px-6 text-center rounded-lg ${
                    tempCategory === category.id
                      ? "bg-blue-600 text-white border-2 border-blue-700 shadow-md"
                      : "bg-gray-200 text-gray-700 border-2 border-gray-300"
                  } transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
                  type="button"
                  onClick={() => handleCategorySelect(category.id)}
                >
                  {category.name}
                </button>
              </div>
            ))}
        </div>
        {step === 2 &&
          subCategories.map((sub) => (
            <div
              key={sub.id}
              onClick={() => handleSubCategorySelect(sub.id)}
              className={`cursor-pointer py-3 px-4 rounded-lg mb-4 transition-all duration-200 ${
                selectedSubCategory === sub.id
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  : "bg-white text-gray-700 border-2 border-gray-200"
              } hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {sub.name}
            </div>
          ))}

        {step === 3 &&
          details.map((detail) => (
            <div
              key={detail.id}
              onClick={() => handleDetailSelect(detail.id)}
              className={`cursor-pointer py-3 px-4 rounded-lg mb-4 transition-all duration-200 ${
                selectedDetail === detail.id
                  ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                  : "bg-white text-gray-700 border-2 border-gray-200"
              } hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
            >
              {detail.name}
            </div>
          ))}

        {step === 4 && moreDetails && moreDetails.length > 0
          ? moreDetails.map((moreDetail) => (
              <div
                key={moreDetail.id}
                onClick={() => handleMoreDetailSelect(moreDetail.id)}
                className={`cursor-pointer py-3 px-4 rounded-lg mb-4 transition-all duration-200 ${
                  selectedMoreDetail === moreDetail.id
                    ? "bg-blue-100 text-blue-700 border-2 border-blue-300"
                    : "bg-white text-gray-700 border-2 border-gray-200"
                } hover:bg-blue-50 focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50`}
              >
                {moreDetail.name}
              </div>
            ))
          : step === 4 && setStep((prevStep) => prevStep + 1)}
        {step === 5 && (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Fotoğrafları Yükleyin
            </h3>
            <input
              value={foto}
              type="file"
              accept="image/*"
              multiple
              onChange={handlePhotoUpload}
              className="w-full py-2 px-4 mb-4 border-2 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {previews.length > 0 && (
              <div className="flex flex-wrap space-x-4 mt-4">
                {previews.map((preview, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center justify-center"
                  >
                    <img
                      src={preview}
                      alt={`Preview ${index}`}
                      className="w-24 h-24 object-cover rounded-lg mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => removePhoto(index)}
                      value={foto}
                      className="bg-red-500 text-white py-1 px-3 rounded-lg hover:bg-red-600"
                    >
                      Kaldır
                    </button>
                  </div>
                ))}
              </div>
            )}
            <p className="mt-2 text-sm text-gray-600">
              {photos.length}/10 fotoğraf yüklendi.
            </p>
          </div>
        )}

        {step === 6 && (
          <>
            {selectedCategory === "FecwhXkriZmMzoepLg4E" ? (
              <div className="car">
                <h3>Otomobil Detayları</h3>
                <div className="car__title w-full ">
                  başlık:
                  <input
                    value={title}
                    type="text"
                    onChange={(e) => setTitle(e.target.value)}
                    className="h-[50px]"
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
          <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col">
            <h3 className="text-2xl font-semibold text-center mb-4">
              İlan Önizlemesi
            </h3>
            <div className="border-b pb-4 mb-4 text-center md:text-left">
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
            </div>
            <div className="flex flex-col">
              <h4 className="text-lg font-semibold mb-2 text-center md:text-left">
                Fotoğraflar:
              </h4>
              {previews.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {previews.map((preview, index) => (
                    <div
                      key={index}
                      className="border rounded-lg overflow-hidden"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index}`}
                        className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg shadow"
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">Fotoğraf yüklenmedi.</p>
              )}
            </div>
            <div className="mt-6 flex flex-col md:flex-row justify-between gap-4">
              <button
                onClick={submitHandle}
                className="px-6 py-3 bg-green-600 text-white rounded-lg shadow hover:bg-green-700"
              >
                İlanı Yayınla
              </button>
            </div>
          </div>
        )}
        <div className="flex justify-center">
          {step > 1 && (
            <div className="flex justify-start">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  previousStep();
                }}
              >
                Geri
              </button>
            </div>
          )}
          {step < 7 && (
            <div className="flex justify-end">
              <button
                className=""
                onClick={(e) => {
                  e.preventDefault();
                  nextStep();
                }}
              >
                Devam Et
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
