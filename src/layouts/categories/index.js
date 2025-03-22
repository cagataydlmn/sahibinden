import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useSite } from "../../context";
import { getSubCategory } from "../../firebase";

export default function Categories() {
    const { categories } = useSite();
    const [subCategories, setSubCategories] = useState({});
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const dropdownRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        categories.forEach((category) => {
            getSubCategory(category.id, (subCategoriesData) => {
                setSubCategories((prev) => ({
                    ...prev,
                    [category.id]: subCategoriesData,
                }));
            });
        });
    }, [categories]);

    const handleMouseEnter = () => {
        setIsDropdownOpen(true);
    };

    const handleMouseLeave = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.relatedTarget) && !buttonRef.current.contains(e.relatedTarget)) {
            setIsDropdownOpen(false);
        }
    };

    return (
        <div className="flex w-full bg-white shadow-md rounded-md p-3 relative">
            <div className="w-[90%] mx-auto flex">
            {/* Tüm Kategoriler Dropdown */}
            <div
                ref={buttonRef}
                className="flex items-center cursor-pointer font-semibold text-gray-800 px-4 py-2 hover:text-blue-600 transition"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                Tüm Kategoriler
            </div>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
                <div
                    ref={dropdownRef}
                    className="absolute left-0 mt-2 bg-white border shadow-md rounded-md w-full z-10 transition-all duration-300 ease-in-out"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="overflow-y-auto max-h-80 flex">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                to={`/category/${category.id}`}
                                className="px-4 py-2 text-gray-800  transition w-full text-2xl no-underline"
                            >
                                <div className="bg-red-100">
                                    {category.name}

                                </div>
                                {/* Render Subcategories */}
                                <ul className="p-0 text-lg flex flex-col">
                                    {subCategories[category.id] && subCategories[category.id].map((subCategory) => (
                                        <Link to={`/category/${category.id}/sub/${subCategory.id}`} key={subCategory.id} className="list-none no-underline text-black">
                                            {subCategory.name}
                                        </Link>
                                    ))}
                                </ul>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            <div className="flex items-center justify-center gap-6 text-gray-700 font-medium overflow-x-auto">
                {categories.map((category) => (
                    <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="hover:text-blue-600 transition no-underline text-black"
                    >
                        {category.name}
                    </Link>
                ))}
            </div></div>
        </div>
    );
}
