import { createContext, useContext, useEffect, useState } from "react";
import {
  getCategory,
  getDetail,
  getMoreDetail,
  getSubCategory,
} from "../firebase";

export const AppContext = createContext();

const Provider = ({ children }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [details, setDetails] = useState([]);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [moreDetails, setMoreDetails] = useState([]);
  const [selectedMoreDetail, setSelectedMoreDetail] = useState(null);
  const [likeItems, setLikeItems] = useState([]);

  useEffect(() => {
    getCategory(setCategories);
  }, []);

  useEffect(() => {
    if (likeItems.length > 0) {
      localStorage.setItem("likeItems", JSON.stringify(likeItems));
    }
  }, [likeItems]);

  useEffect(() => {
    const liked = JSON.parse(localStorage.getItem("likeItems"));

    if (liked?.length > 0) {
      setLikeItems(liked);
    }
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      getSubCategory(selectedCategory, setSubCategories);
      setSelectedSubCategory(null);
      setDetails([]);
      setMoreDetails([]);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedCategory && selectedSubCategory) {
      getDetail(selectedCategory, selectedSubCategory, setDetails);
      setSelectedDetail(null);
      setMoreDetails([]);
    }
  }, [selectedCategory, selectedSubCategory]);

  useEffect(() => {
    if (selectedCategory && selectedSubCategory && selectedDetail) {
      getMoreDetail(
        selectedCategory,
        selectedSubCategory,
        selectedDetail,
        setMoreDetails,
        likeItems,
        setLikeItems
      );
    }
  }, [selectedCategory, selectedSubCategory, selectedDetail, likeItems]);

  return (
    <AppContext.Provider
      value={{
        categories,
        selectedCategory,
        setSelectedCategory,
        subCategories,
        selectedSubCategory,
        setSelectedSubCategory,
        details,
        selectedDetail,
        setSelectedDetail,
        moreDetails,
        selectedMoreDetail,
        setSelectedMoreDetail,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useSite = () => useContext(AppContext);
export default Provider;
