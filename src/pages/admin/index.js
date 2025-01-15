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
    <div className="admin__category">
      <form onSubmit={handleAddCategory}>
        <h3>Kategori Ekle</h3>
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Kategori adı"
        />
        <button type="submit">Kategori Ekle</button>
      </form>

      <form onSubmit={handleAddSubCategory}>
        <h3>Alt Kategori Ekle</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Ana Kategori Seç</option>
          {categoryList.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={subCategoryName}
          onChange={(e) => setSubCategoryName(e.target.value)}
          placeholder="Alt kategori adı"
        />
        <button type="submit">Alt Kategori Ekle</button>
      </form>

      <form onSubmit={handleAddDetail}>
        <h3>Detay Ekle</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
        >
          <option value="">Alt Kategori Seç</option>
          {subCategoryList.map((subCategory) => (
            <option key={subCategory.id} value={subCategory.id}>
              {subCategory.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={detail}
          onChange={(e) => setDetail(e.target.value)}
          placeholder="Detay adı"
        />
        <button type="submit">Detay Ekle</button>
      </form>

      <form onSubmit={handleAddMoreDetail}>
        <h3>Alt Detay Ekle</h3>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
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
        >
          <option value="">Detay Seç</option>
          {detailList.map((detail) => (
            <option key={detail.id} value={detail.id}>
              {detail.name}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={moreDetail}
          onChange={(e) => setMoreDetail(e.target.value)}
          placeholder="Alt detay adı"
        />
        <button type="submit">Alt Detay Ekle</button>
      </form>

      <h3>Detaylar</h3>
      <ul>
        {detailList.map((detail) => (
          <li key={detail.id}>{detail.name}</li>
        ))}
      </ul>
    </div>
  );
}
