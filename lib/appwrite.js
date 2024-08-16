import {
  Client,
  Account,
  ID,
  Avatars,
  Databases,
  Query,
} from "react-native-appwrite";

export const appwriteConfig = {
  endpoint: "https://cloud.appwrite.io/v1",
  platform: "com.company.moviebazz",
  projectId: "669bd609002ef86e1cad",
  databaseId: "669bfd7800023e7875ab",
  userCollectionId: "669c0dd5003d30a17bc2",
  watchlistCollectionId: "669cfd980034de27bad5",
  storageId: "669c06c2002438f1a357",
};

// Init your React Native SDK
const client = new Client();

client
  .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
  .setProject(appwriteConfig.projectId) // Your project ID
  .setPlatform(appwriteConfig.platform); // Your application ID or bundle ID.

const account = new Account(client);
const avatar = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password) => {
  try {
    const newAccount = await account.create(ID.unique(), email, password);
    if (!newAccount) throw Error;
    await signIn(email, password);
    const newUser = databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      {
        accountId: newAccount.$id,
        email,
      }
    );
    if (newUser) {
      console.log("successfully created user");
    }
    return newUser;
  } catch (error) {
    throw new Error(error);
  }
};

export const signOut = async () => {
  try {
    console.log("Attempting to delete session...");
    const session = await account.deleteSession("current");
    return session;
    // return session;
  } catch (error) {
    console.log("Error during sign out:", error);
    throw new Error(error);
  }
};
export const signIn = async (email, password) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    console.log(session);
    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const getCurrentUser = async () => {
  try {
    const currentAccount = await account.get();

    const currentUser = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountId", currentAccount.$id)]
    );

    if (!currentUser) throw Error;

    return currentUser.documents[0];
  } catch (error) {
    console.log("Error here", error);
  }
};
export const checkWatchlist = async (form) => {
  try {
    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.watchlistCollectionId,
      [Query.equal("user", form.userId), Query.equal("id", form.contentId)]
    );
    console.log("Available in Watchlist", response.documents.length > 0);
    return response.documents.length > 0;
  } catch (error) {
    console.log("Error checking Wishlist", error);
  }
};

export const delTitle = async (userId, titleId) => {
  try {
    // userId is coming from the call itself from Global User object

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.watchlistCollectionId,
      [Query.equal("user", userId), Query.equal("id", titleId)]
    );
    const document = response.documents[0].$id;

    await databases.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.watchlistCollectionId,
      document
    );
    return true;
  } catch (error) {
    console.log("Error checking Wishlist", error);
    return false;
  }
};
export const getWatchlist = async (userId) => {
  try {
    // userId is coming from the call itself from Global User object

    const response = await databases.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.watchlistCollectionId,
      [Query.equal("user", userId)]
    );
    return response;
  } catch (error) {
    console.log("Error checking Wishlist", error);
  }
};

export async function addToWatchList(form) {
  try {
    const newPost = await databases.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.watchlistCollectionId,
      ID.unique(),
      {
        title: form.title,
        id: form.id,
        poster: form.poster,
        user: form.user,
        movie: form.movie,
        tv: form.tv,
        date: form.date,
        votes: form.votes,
      }
    );
    return newPost !== null;
  } catch (error) {
    console.log("Error posting data:", error);
    throw new Error(error);
  }
}

// export const getAllPosts = async () => {
//   try {
//     const posts = await databases.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.videoCollectionId
//     );

//     return posts.documents;
//   } catch (error) {
//     throw new Error(error);
//   }
// };
