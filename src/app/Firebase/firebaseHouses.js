'use client';

import {
  collection,
  addDoc,
  updateDoc,
  doc,
  arrayUnion,
  Timestamp,
  query,
  where,
  getDocs,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseConfig";

// Helper function to generate invite codes
const generateInviteCode = () =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

// Create a new house
export const createHouse = async (houseName, description, userId) => {
  try {
    const inviteCode = generateInviteCode();

    const houseRef = await addDoc(collection(db, "houses"), {
      name: houseName,
      description,
      createdBy: userId,
      inviteCode,
      members: [userId],
      createdAt: Timestamp.now(),
    });

    await updateDoc(doc(db, "users", userId), {
      houses: arrayUnion(houseRef.id),
    });

    return { houseId: houseRef.id, inviteCode };
  } catch (error) {
    console.error("Error creating house:", error);
    throw error;
  }
};

// Join a house by invite code
export const joinHouse = async (inviteCode, userId) => {
  try {
    const housesRef = collection(db, "houses");
    const houseQuery = query(housesRef, where("inviteCode", "==", inviteCode));
    const houseSnapshot = await getDocs(houseQuery);

    if (houseSnapshot.empty) {
      throw new Error("Invalid invite code.");
    }

    const houseDoc = houseSnapshot.docs[0];
    const houseId = houseDoc.id;

    await updateDoc(houseDoc.ref, {
      members: arrayUnion(userId),
    });

    await updateDoc(doc(db, "users", userId), {
      houses: arrayUnion(houseId),
    });

    return houseId;
  } catch (error) {
    console.error("Error joining house:", error);
    throw error;
  }
};

// Send a message in a house chat
export const sendMessage = async (houseId, userId, message) => {
  try {
    const messagesRef = collection(db, "houses", houseId, "messages");
    await addDoc(messagesRef, {
      userId,
      message,
      timestamp: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

// Subscribe to real-time messages in a house chat
export const subscribeToMessages = (houseId, callback) => {
  const messagesRef = collection(db, "houses", houseId, "messages");

  return onSnapshot(messagesRef, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(messages);
  });
};

// Fetch user details for each member ID
export const fetchHouseMembers = async (memberIds) => {
  try {
    const memberDetails = await Promise.all(
      memberIds.map(async (userId) => {
        const userRef = doc(db, "users", userId);
        const userSnap = await getDoc(userRef);
        return userSnap.exists()
          ? { id: userId, ...userSnap.data() }
          : { id: userId, name: "Unknown User", profilePicture: "/default-avatar.jpg" };
      })
    );

    return memberDetails;
  } catch (error) {
    console.error("Error fetching house members:", error);
    throw error;
  }
};