import { initializeApp } from "firebase/app";
import "firebase/firestore";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  doc,
  getDoc,
  where,
  getDocs,
  deleteDoc,
  Timestamp,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithRedirect,
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { updateProfilePhoto as updateProfilePhotoAction } from "./store/auth.js"; // Redux aksiyonunu farklı isimle import et

const firebaseConfig = {
  apiKey: "AIzaSyB38qo6DyFftA91SJJwgMgL-BaI8YazfgI",
  authDomain: "sahibinden-45e8d.firebaseapp.com",
  projectId: "sahibinden-45e8d",
  storageBucket: "sahibinden-45e8d.firebasestorage.app",
  messagingSenderId: "1085541590363",
  appId: "1:1085541590363:web:60dda585ebff4b9f5fa67e",
  measurementId: "G-YNJ8QYE3PL",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
export { db, auth };

export const register = async (email, password, name, lastName) => {
  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // Varsayılan fotoğrafı public klasöründen al
    const defaultPhotoPath = "/default-profile.jpeg"; // public klasörüne yerleştirilmiş görsel
    const defaultPhotoFile = await fetch(defaultPhotoPath).then((res) =>
      res.blob()
    );

    const fileRef = ref(
      storage,
      `profilePhotos/${user.uid}/default-profile.jpg`
    );
    await uploadBytes(fileRef, defaultPhotoFile); // İlk yükleme
    const defaultPhotoURL = await getDownloadURL(fileRef); // URL'yi al

    // Firestore'a kullanıcı bilgilerini ekle
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      email: user.email,
      name: name,
      lastName: lastName,
      profilePhoto: defaultPhotoURL, // Fotoğraf URL'si
    });

    return user;
  } catch (error) {
    console.error("Kayıt sırasında bir hata oluştu:", error.message);
    throw error;
  }
};

export const updateProfilePhoto = (file) => async (dispatch) => {
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Kullanıcı bulunamadı.");
    if (!file) throw new Error("Dosya seçilmedi.");

    // Firestore'daki kullanıcı belgesini bul
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      throw new Error("Firestore'da böyle bir kullanıcı bulunamadı!");
    }
    const userDocID = querySnapshot.docs[0].id;

    // Fotoğrafı Storage'a yükle
    const uniqueFileName = `${user.uid}_${new Date().getTime()}_${file.name}`;
    const fileRef = ref(storage, `profilePhotos/${user.uid}/${uniqueFileName}`);
    await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(fileRef);

    // Firestore belgesini güncelle
    const userDocRef = doc(db, "users", userDocID);
    await updateDoc(userDocRef, { profilePhoto: downloadURL });

    // Authentication güncelle
    await updateProfile(user, { photoURL: downloadURL });
    await auth.currentUser.reload();

    // LocalStorage güncelle
    localStorage.setItem("profilePhoto", auth.currentUser.photoURL);

    console.log("Profil fotoğrafı başarıyla güncellendi:", downloadURL);

    // Redux state'i güncelle (sadece URL'i gönderiyoruz)
    dispatch(updateProfilePhotoAction(downloadURL));

    // downloadURL'i return et
    return downloadURL;
  } catch (error) {
    console.error("Profil fotoğrafı yükleme hatası:", error.message);
    throw error;
  }
};

//google ile giriş
export const googleSignIn = () => {
  const { provider } = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};
export const login = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return { user };
};
export const getUserById = async (uid) => {
  try {
    const usersRef = collection(db, "users");
    const userQuery = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(userQuery);

    if (!querySnapshot.empty) {
      const userDoc = querySnapshot.docs[0];
      return userDoc.data();
    } else {
      console.error("Kullanıcı bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Kullanıcı bilgisi alınırken hata oluştu:", error);
    return null;
  }
};

// kategoriler

export const addCategory = async (categoryData) => {
  try {
    await addDoc(collection(db, "categories"), categoryData);
    console.log("Kategori başarıyla eklendi!");
  } catch (error) {
    console.error("Kategori eklenirken bir hata oluştu:", error);
  }
};

export const getCategory = (callback) => {
  return onSnapshot(query(collection(db, "categories")), (snapshot) => {
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(categories);
  });
};

//altkategori
export const addSubCategory = async (categoryId, subCategoryData) => {
  try {
    const subCategoriesRef = collection(
      db,
      `categories/${categoryId}/subcategories`
    );
    await addDoc(subCategoriesRef, subCategoryData);
    console.log("Alt kategori başarıyla eklendi!");
  } catch (error) {
    console.error("Alt kategori eklenirken bir hata oluştu:", error);
  }
};

export const getSubCategory = (categoryId, callback) => {
  return onSnapshot(
    query(collection(db, `categories/${categoryId}/subcategories`)),
    (snapshot) => {
      const subCategories = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(subCategories);
    }
  );
};

//detay ekleme

export const addDetail = async (categoryId, detailData, subcategoryId) => {
  try {
    const detailRef = collection(
      db,
      `categories/${categoryId}/subcategories/${subcategoryId}/details`
    );
    const docRef = await addDoc(detailRef, detailData);
    console.log("Detay başarıyla eklendi:", docRef.id);
  } catch (error) {
    console.error("Detay eklenirken bir hata oluştu:", error);
    throw error;
  }
};

export const getDetail = (categoryId, subcategoryId, callback) => {
  return onSnapshot(
    query(
      collection(
        db,
        `categories/${categoryId}/subcategories/${subcategoryId}/details`
      )
    ),
    (snapshot) => {
      const details = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(details);
    }
  );
};

//son detay ekleme

export const addMoreDetail = async (
  categoryId,
  subcategoryId,
  detailId,
  moreDetailData
) => {
  try {
    const moreDetailRef = collection(
      db,
      `categories/${categoryId}/subcategories/${subcategoryId}/details/${detailId}/moreDetail`
    );

    const docRef = await addDoc(moreDetailRef, moreDetailData);
    console.log("Başarıyla yüklendi:", docRef.id);
  } catch (error) {
    console.error("Error adding more detail:", error);
    throw error;
  }
};

export const getMoreDetail = (
  categoryId,
  subcategoryId,
  detailId,
  callback
) => {
  try {
    const moreDetailRef = collection(
      db,
      `categories/${categoryId}/subcategories/${subcategoryId}/details/${detailId}/moreDetail`
    );

    return onSnapshot(query(moreDetailRef), (snapshot) => {
      const moreDetails = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(moreDetails);
    });
  } catch (error) {
    console.error("More detail alınırken bir hata oluştu:", error);
    throw error;
  }
};

export const addAdvert = async (data) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("Kullanıcı giriş yapmamış.");
      return;
    }

    if (
      data === null ||
      (Array.isArray(data) && data.length === 0) ||
      (typeof data === "string" && data.trim().length === 0)
    ) {
      console.log("Eklenecek veri yok.");
      return;
    }

    await addDoc(collection(db, "products"), {
      ...data,
      uid: user.uid,
      createdAt: Timestamp.now(),
    });

    console.log("İlan başarıyla eklendi");
  } catch (error) {
    console.error("İlan eklenirken hata oluştu: ", error);
  }
};

export const getAddvert = (callback) => {
  return onSnapshot(query(collection(db, "products")), (snapshot) => {
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(products);
  });
};
export async function updateAdvert(id, updatedData) {
  const docRef = doc(db, "products", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    const currentData = docSnap.data();


    const dataToUpdate = { ...currentData, ...updatedData };

    await updateDoc(docRef, dataToUpdate);
  } else {
    console.log("İlan bulunamadı!");
  }
}
const storage = getStorage(app);

export const uploadImage = async (file, folderName) => {
  try {
    const storageRef = ref(storage, `${folderName}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log("Görsel Yüklendi:", downloadURL);
    return downloadURL;
  } catch (error) {
    console.error("Görsel yüklenirken hata oluştu:", error);
    throw error;
  }
};
export const deleteImage = async (photoURL,folderName,file) => {
  try {
    const photoRef = ref(storage, photoURL);

    await deleteObject(photoRef);
    console.log("Fotoğraf başarıyla silindi");

    const advertRef = ref(storage, `${folderName}/${file.name}`);
    await updateDoc(advertRef, {
      foto: arrayRemove(photoURL),  
    });
    console.log("Firestore güncellendi");
  } catch (error) {
    console.error("Fotoğraf silinirken hata oluştu:", error);
  }
};

export const getCategoryById = async (categoryId) => {
  try {
    const categoryRef = doc(db, "categories", categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (categoryDoc.exists()) {
      return categoryDoc.data().name;
    } else {
      console.error("Kategori bulunamadı.");
      return "Bilinmeyen Kategori";
    }
  } catch (error) {
    console.error("Kategori bilgisi alınırken hata oluştu:", error);
    return "Hata";
  }
};

export const getSubCategoryById = async (subCategoryId, categoryId) => {
  try {
    const subCategoryRef = doc(
      db,
      `categories/${categoryId}/subcategories`,
      subCategoryId
    );
    const subCategoryDoc = await getDoc(subCategoryRef);

    if (subCategoryDoc.exists()) {
      return subCategoryDoc.data().name;
    } else {
      console.error("Kategori bulunamadı.");
      return "Bilinmeyen Kategori";
    }
  } catch (error) {
    console.error("Kategori bilgisi alınırken hata oluştu:", error);
    return "Hata";
  }
};

export const getDetailById = async (categoryId, subcategoryId, detailId) => {
  try {
    const detailRef = doc(
      db,
      `categories/${categoryId}/subcategories/${subcategoryId}/details`,
      detailId
    );
    const detailDoc = await getDoc(detailRef);

    if (detailDoc.exists()) {
      return detailDoc.data().name;
    } else {
      console.error("Detay bulunamadı.");
      return "Bilinmeyen Detay";
    }
  } catch (error) {
    console.error("Detay bilgisi alınırken hata oluştu:", error);
    return "Hata";
  }
};

export const getMoreDetailById = async (
  categoryId,
  subcategoryId,
  detailId,
  moreDetailId
) => {
  try {
    const detailRef = doc(
      db,
      `categories/${categoryId}/subcategories/${subcategoryId}/details/${detailId}/moreDetail`,
      moreDetailId
    );
    const detailDoc = await getDoc(detailRef);

    if (detailDoc.exists()) {
      return detailDoc.data().name;
    } else {
      console.error("Detay bulunamadı.");
      return "Bilinmeyen Detay";
    }
  } catch (error) {
    console.error("Detay bilgisi alınırken hata oluştu:", error);
    return "Hata";
  }
};

export const deleteAdvert = async (itemId) => {
  const itemRef = doc(db, "products", itemId);
  await deleteDoc(itemRef);
};

export const changePassword = async (currentPassword, newPassword) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı oturum açmamış");
  }

  const credentials = EmailAuthProvider.credential(user.email, currentPassword);

  try {
    await reauthenticateWithCredential(user, credentials);

    await updatePassword(user, newPassword);

    return "Şifre başarıyla değiştirildi!";
  } catch (error) {
    throw new Error(error.message);
  }
};

//like

export const addLike = async (likeItem, uid) => {
  try {
    const likesRef = collection(db, "likeAdverts");
    const q = query(likesRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      console.log("Bu ürün zaten beğenilenlerde mevcut!");
    } else {
      await addDoc(likesRef, {
        ...likeItem,
        uid: uid,
      });
      console.log("Ürün beğenilere eklendi");
    }
  } catch (error) {
    console.error("Ürün beğenilere eklenirken hata oluştu: ", error);
  }
};

//Mesajlar
// giriş  yapan kullanıcı id sini al. ürünü ekleyenin kullanıcı idsini al.
