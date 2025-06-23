import { database } from "../firebaseinit";
import { collection, addDoc, serverTimestamp, Timestamp } from "firebase/firestore";

export const NotificationService = {
    async Sender(destiny: string) {
        const message = "check a new post";
        await addDoc(collection(database, "notifications"), {
            destiny: destiny,
            message: message,
            timestamp: serverTimestamp()
        });
    }
};

