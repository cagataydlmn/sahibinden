import { serverTimestamp } from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  addCategory,
  addDetail,
  addMoreDetail,
  addSubCategory,
  getCategory,
  getDetail,
  getSubCategory,
} from "../../firebase";

export default function Admin() {
  const [categoryName, setCategoryName] = useState("");
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [subCategoryList, setSubCategoryList] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [detail, setDetail] = useState("");
  const [detailList, setDetailList] = useState([]);
  const [moreDetail, setMoreDetail] = useState("");
  const [selectedDetail, setSelectedDetail] = useState("");

  const handleAddCategory = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      alert("Kategori adı boş olamaz!");
      return;
    }

    const categoryData = {
      name: categoryName,
      createdAt: serverTimestamp(),    };

    try {
      await addCategory(categoryData);
      setCategoryName("");
      alert("Kategori başarıyla eklendi!");
    } catch (error) {
      alert("Kategori eklenirken bir hata oluştu.");
    }
  };

  const handleAddSubCategory = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !subCategoryName.trim()) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    const subCategoryData = {
      name: subCategoryName,
      createdAt: serverTimestamp(),    };

    try {
      await addSubCategory(selectedCategory, subCategoryData);
      setSubCategoryName("");
      alert("Alt kategori başarıyla eklendi!");
    } catch (error) {
      alert("Alt kategori eklenirken bir hata oluştu.");
    }
  };

  const handleAddDetail = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedSubCategory) {
      alert("Lütfen hem bir kategori hem de alt kategori seçin!");
      return;
    }

    if (!detail.trim()) {
      alert("Detay boş olamaz!");
      return;
    }

    const detailData = {
      name: detail,
      createdAt: serverTimestamp(),    };

    try {
      await addDetail(selectedCategory, detailData, selectedSubCategory);
      setDetail("");
      alert("Detay başarıyla eklendi!");
    } catch (error) {
      alert("Detay eklenirken bir hata oluştu.");
    }
  };

  useEffect(() => {
    getCategory(setCategoryList);
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getSubCategory(selectedCategory, setSubCategoryList);
    }
  }, [selectedCategory]);

  useEffect(() => {
    let unsubscribe;
    if (selectedCategory && selectedSubCategory) {
      unsubscribe = getDetail(selectedCategory, selectedSubCategory, setDetailList);
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [selectedCategory, selectedSubCategory]);

  const handleAddMoreDetail = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !selectedSubCategory || !selectedDetail) {
      alert("Lütfen tüm alanları doldurun!");
      return;
    }

    if (!moreDetail.trim()) {
      alert("Alt detay boş olamaz!");
      return;
    }

    const moreDetailData = {
      name: moreDetail,
      createdAt: serverTimestamp(),    };

    try {
      await addMoreDetail(selectedCategory, selectedSubCategory, selectedDetail, moreDetailData);
      setMoreDetail("");
      alert("Alt detay başarıyla eklendi!");
    } catch (error) {
      alert("Alt detay eklenirken bir hata oluştu.");
    }
  };

  return (
      <div className="admin__category p-6 bg-gray-100 rounded-lg shadow-lg max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">Kategori Yönetimi</h2>

        {/* Kategori Ekle */}
        <form onSubmit={handleAddCategory} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Kategori Ekle</h3>
          <div className="flex gap-2">
            <input
                type="text"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                placeholder="Kategori adı"
                className="flex-1 p-2 border rounded-md outline-none"
            />
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
              Ekle
            </button>
          </div>
        </form>

        {/* Alt Kategori Ekle */}
        <form onSubmit={handleAddSubCategory} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Alt Kategori Ekle</h3>
          <div className="flex flex-col gap-2">
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded-md"
            >
              <option value="">Ana Kategori Seç</option>
              {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                  type="text"
                  value={subCategoryName}
                  onChange={(e) => setSubCategoryName(e.target.value)}
                  placeholder="Alt kategori adı"
                  className="flex-1 p-2 border rounded-md outline-none"
              />
              <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700">
                Ekle
              </button>
            </div>
          </div>
        </form>

        {/* Detay Ekle */}
        <form onSubmit={handleAddDetail} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Detay Ekle</h3>
          <div className="flex flex-col gap-2">
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded-md"
            >
              <option value="">Kategori Seç</option>
              {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              ))}
            </select>
            <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="p-2 border rounded-md"
            >
              <option value="">Alt Kategori Seç</option>
              {subCategoryList.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                  type="text"
                  value={detail}
                  onChange={(e) => setDetail(e.target.value)}
                  placeholder="Detay adı"
                  className="flex-1 p-2 border rounded-md outline-none"
              />
              <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">
                Ekle
              </button>
            </div>
          </div>
        </form>

        {/* Alt Detay Ekle */}
        <form onSubmit={handleAddMoreDetail} className="bg-white p-4 rounded-lg shadow-md mb-6">
          <h3 className="text-lg font-semibold mb-2">Alt Detay Ekle</h3>
          <div className="flex flex-col gap-2">
            <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="p-2 border rounded-md"
            >
              <option value="">Kategori Seç</option>
              {categoryList.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
              ))}
            </select>
            <select
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                className="p-2 border rounded-md"
            >
              <option value="">Alt Kategori Seç</option>
              {subCategoryList.map((subCategory) => (
                  <option key={subCategory.id} value={subCategory.id}>
                    {subCategory.name}
                  </option>
              ))}
            </select>
            <select
                value={selectedDetail}
                onChange={(e) => setSelectedDetail(e.target.value)}
                className="p-2 border rounded-md"
            >
              <option value="">Detay Seç</option>
              {detailList.map((detail) => (
                  <option key={detail.id} value={detail.id}>
                    {detail.name}
                  </option>
              ))}
            </select>
            <div className="flex gap-2">
              <input
                  type="text"
                  value={moreDetail}
                  onChange={(e) => setMoreDetail(e.target.value)}
                  placeholder="Alt detay adı"
                  className="flex-1 p-2 border rounded-md outline-none"
              />
              <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700">
                Ekle
              </button>
            </div>
          </div>
        </form>


      </div>

  );
}
