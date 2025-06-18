import { database } from "../firebaseinit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  getDocs
} from "firebase/firestore";

export const postService = {

    async postPost(userId: string, text: string, image: string){
        const newPost = {
            userId,
            text,
            image,
            createdDate: Timestamp.now(),
        };
        const postRef = await addDoc(collection(database, "Posts"), newPost);
        return postRef.id;
    },


    async deletePost(id: string){
        await deleteDoc(doc(database, "Posts", id));
    },

    async getPost(userId: string){
        const postRef = collection(database, "Posts");
        const queryByUserId = query(postRef, where("userId", "==", userId));
        const data = await getDocs(queryByUserId);
        return data.docs.map((x) => ({
            id: x.id,
            ...x.data()
        }));
    
    }
}