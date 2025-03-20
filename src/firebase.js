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
  setDoc,
  arrayRemove,
  orderBy,
  serverTimestamp,
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
  updateProfile,signOut
} from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

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
    const { user } = await createUserWithEmailAndPassword(auth, email, password);

    await updateProfile(auth.currentUser, {
      username: `${name} ${lastName}`
    });

    // Firestore'a kullanıcı bilgilerini ekle
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: name,
      lastName: lastName,
      username: `${name} ${lastName}`,
      createdAt: Timestamp.now(),
      password:password
    });

    return user;
  } catch (error) {
    console.error("Kayıt sırasında bir hata oluştu:", error.message);
    throw error;
  }
};
export const updateProfilePhoto = (file) => async (dispatch) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı oturum açmamış!");
  }

  const storage = getStorage();
  const storageRef = ref(storage, `profilePhotos/${user.uid}.jpg`);

  try {
    // Yüklenen dosyanın MIME türünü belirt
    const metadata = {
      contentType: 'image/jpeg',
    };

    // Dosyayı Firebase Storage'a yükle
    await uploadBytes(storageRef, file, metadata);

    // Yüklenen dosyanın URL'sini al
    const profilePhoto = await getDownloadURL(storageRef);

    // Firebase Authentication'da profil fotoğrafını güncelle
    await updateProfile(user, { profilePhoto });

    // Firestore'da kullanıcı bilgilerini güncelle (bu adımı ekledik)
    const db = getFirestore();
    const userRef = doc(db, "users", user.uid);
    await updateDoc(userRef, {
      profilePhoto: profilePhoto
    });

    // Redux state'ini güncelle
    dispatch({ type: "UPDATE_PROFILE_PHOTO", payload: profilePhoto });

    return profilePhoto;
  } catch (error) {
    console.error("Profil fotoğrafı güncellenirken hata:", error);
    throw error;
  }
};


//google ile giriş 
export const googleSignIn = () => {
  const {provider} = new GoogleAuthProvider();
  signInWithRedirect(auth, provider);
};

export const login = async (email, password) => {
  const { user } = await signInWithEmailAndPassword(auth, email, password);
  if (!user.emailVerified) {
    throw new Error("Hesabınızı kullanabilmek için e-posta adresinizi doğrulamanız gerekiyor.");
  }
  return { user };
};
export const logout = async () => {
  try {
    await signOut(auth); // Firebase oturumunu kapat
    localStorage.removeItem("user"); // LocalStorage'dan kullanıcıyı sil
    document.location.href = "/"; // Sayfayı yenileyerek yönlendirme yap
  } catch (error) {
    console.error("Çıkış yaparken hata oluştu:", error);
  }
};
export const getUserById = async (uid) => {
  try {
    const userDoc = await getDoc(doc(db, "users", uid));
    if (userDoc.exists()) {
      return userDoc.data();
    } else {
      console.warn(`Kullanıcı bulunamadı (UID: ${uid})`);
      return null;
    }
  } catch (error) {
    console.error("Kullanıcı verisi çekilirken hata:", error);
    throw error;
  }
};
export const getUserByUID = async (uid) => {
  if (!uid) return null;

  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("uid", "==", uid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return querySnapshot.docs[0].data(); // Kullanıcı bilgilerini döndür
    } else {
      console.warn("Kullanıcı bulunamadı.");
      return null;
    }
  } catch (error) {
    console.error("Kullanıcı verisi alınırken hata oluştu:", error);
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
};export const getCategoryById = async (categoryId, subCategoryId) => {
  try {
    // Kategori verisini al
    const categoryRef = doc(db, "categories", categoryId);
    const categoryDoc = await getDoc(categoryRef);

    if (!categoryDoc.exists()) {
      console.error("Kategori bulunamadı.");
      return "Bilinmeyen Kategori";
    }

    const categoryName = categoryDoc.data().name;

    // Eğer alt kategori varsa, alt kategoriyi al
    if (subCategoryId) {
      const subCategoryRef = doc(db, "categories", categoryId, "subcategories", subCategoryId);
      const subCategoryDoc = await getDoc(subCategoryRef);

      if (subCategoryDoc.exists()) {
        return subCategoryDoc.data().name; // Alt kategori adı
      } else {
        console.error("Alt kategori bulunamadı.");
        return categoryName; // Alt kategori yoksa ana kategori adı
      }
    }

    return categoryName; // Alt kategori yoksa ana kategori adı döndür
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
      return subCategoryDoc.data().name; // Alt kategori adı
    } else {
      console.error("Alt kategori bulunamadı.");
      return "Bilinmeyen Alt Kategori"; // Alt kategori yoksa bilinen bir değer döndür
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
export const changePassword = async (currentPassword, newPassword) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Kullanıcı oturum açmamış');
  }

  const credentials = EmailAuthProvider.credential(user.email, currentPassword);

  try {
    await reauthenticateWithCredential(user, credentials);

    // Yeni şifreyi güncelleme
    await updatePassword(user, newPassword);
    
    return 'Şifre başarıyla değiştirildi!';
  } catch (error) {
    throw new Error(error.message);
  }
};

export const toggleFavoriteFirebase = async (uid, advertId, currentFavorites) => {
  if (!advertId) {
    console.error("Advert ID geçerli değil!");
    return;
  }

  // currentFavorites geçerli bir dizi mi diye kontrol et
  if (!Array.isArray(currentFavorites)) {
    console.error("currentFavorites geçerli bir dizi değil!");
    currentFavorites = [];  // Geçerli değilse boş bir dizi ile başla
  }

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Kullanıcı bulunamadı.");
  }

  // Kullanıcının Firestore'daki belgesini bul
  const usersRef = collection(db, "users");
  const q = query(usersRef, where("uid", "==", user.uid));
  const querySnapshot = await getDocs(q);

  if (querySnapshot.empty) {
    console.error("Kullanıcı belgesi bulunamadı!");
    throw new Error("Kullanıcı belgesi bulunamadı!");
  }

  // Kullanıcı belgesini al
  const userDoc = querySnapshot.docs[0];
  const userRef = doc(db, "users", userDoc.id); // userDoc.id, Firestore'daki belge ID'sidir

  // Favori ekleme ya da çıkarma işlemi
  const updatedFavorites = currentFavorites.includes(advertId)
    ? currentFavorites.filter(id => id !== advertId)
    : [...currentFavorites, advertId];

  await updateDoc(userRef, { favorites: updatedFavorites });
  return updatedFavorites;
};
export const checkIfFavorite = async (uid, advertId) => {
  try {
    const userRef = doc(db, "users", uid);  // Kullanıcının UID'sini kullanarak kullanıcı belgesini alıyoruz
    const userDoc = await getDoc(userRef);

    // Kullanıcı belgesi var mı diye kontrol et
    if (!userDoc.exists()) {
      console.error("Kullanıcı bulunamadı.");
      return false;
    }

    // Kullanıcının favorites alanını kontrol et
    const favorites = userDoc.data()?.favorites || [];
    if (!Array.isArray(favorites)) {
      console.error("Favoriler geçerli bir dizi değil!");
      return false;
    }

    return favorites.includes(advertId);  // Favori listesinde var mı diye kontrol et
  } catch (error) {
    console.error("Favori kontrol hatası:", error);
    return false;
  }
};


export const getUserFavorites = async (uid) => {
  if (!uid) {
    console.warn("UID bulunamadı!");
    return null;
  }

  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      return userData.favorites || []; // Favorites varsa döndür, yoksa boş array
    } else {
      console.warn(`Kullanıcı bulunamadı (UID: ${uid})`);
      return [];
    }
  } catch (error) {
    console.error("Favoriler çekilirken hata oluştu:", error);
    throw error;
  }
};


export const getProductsById = async (productIds) => {
  try {
    const productsRef = collection(db, "products"); // products koleksiyonuna referans
    const q = query(productsRef, where("id", "in", productIds)); // `in` operatörü ile birden fazla ID sorgulama
    const querySnapshot = await getDocs(q); // Sorguyu çalıştır

    const productsData = [];
    
    querySnapshot.forEach((doc) => {
      productsData.push(doc.data()); // Her bir ürünün verisini productsData dizisine ekle
    });

    return productsData; // Ürünleri döndür
  } catch (error) {
    console.error("Ürünler alınırken hata oluştu:", error);
    return []; // Hata durumunda boş bir dizi döndür
  }
};

export const sendMessage = async (chatId, senderId, receiverId, text) => {
  const chatRef = doc(db, "messages", chatId); // chatId'yi parametre olarak al

  // Mesajı messages/{chatId}/messages alt koleksiyonuna ekle
  const messagesRef = collection(db, "messages", chatId, "messages");
  await addDoc(messagesRef, {
    senderId,
    receiverId,
    text,
    timestamp: serverTimestamp(),
    chatId,
  });

  // Chat belgesini güncelle
  await setDoc(
    chatRef,
    {
      lastMessage: text,
      lastMessageTimestamp: serverTimestamp(),
      userIds: [senderId, receiverId],
    },
    { merge: true }
  );
};

// Kullanıcının sohbetlerini getir
export const getChats = async (userId) => {
  const chatsRef = collection(db, "messages");
  const q = query(chatsRef, where("userIds", "array-contains", userId));
  const querySnapshot = await getDocs(q);

  const chats = [];
  querySnapshot.forEach((doc) => {
    chats.push({ id: doc.id, ...doc.data() });
  });

  return chats;
};

// Belirli bir chat'in mesajlarını getir
export const getMessages = async (chatId) => {
  const messagesRef = collection(db, "messages", chatId, "messages");
  const q = query(messagesRef, orderBy("timestamp", "asc"));
  const querySnapshot = await getDocs(q);

  const messages = [];
  querySnapshot.forEach((doc) => {
    messages.push({ id: doc.id, ...doc.data() });
  });

  return messages;
};

