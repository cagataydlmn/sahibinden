import { createContext, useContext, useEffect, useState } from "react";
import { getCategory, getDetail, getMoreDetail, getSubCategory } from "../firebase";

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

  useEffect(() => {
    getCategory(setCategories);
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
        setMoreDetails
      );
    }
  }, [selectedCategory, selectedSubCategory, selectedDetail]);

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
