import { database } from "../firebaseinit";
import {
  collection,
  addDoc,
  deleteDoc,
  doc,
  Timestamp,
  query,
  where,
  getDocs,
  updateDoc,
  getDoc
} from "firebase/firestore";
interface IPost {
    id: string,
    text: string,
    image: string,
    likes: number,
    dislikes: number,
    createdDate: any
}
export const postService = {

    async postPost(userId: string, text: string, image: string, likes: number = 0, dislikes: number = 0){
        const newPost = {
            userId,
            text,
            image,
            likes,
            dislikes,
            createdDate: Timestamp.now(),
        };
        const postRef = await addDoc(collection(database, "Posts"), newPost);
        return postRef.id;
    },

    async likePost(id: string){
        const post = await this.getPostById(id);
        if (!post) return;

        const postDoc = doc(database, "Posts", id);
        const currentCount = post["likes"] ?? 0;

        await updateDoc(postDoc, {
            "likes": currentCount + 1,
        });
    },

    async dislikePost(id: string){
        const post = await this.getPostById(id);
        if (!post) return;

        const postDoc = doc(database, "Posts", id);
        const currentCount = post["dislikes"] ?? 0;

        await updateDoc(postDoc, {
            "dislikes": currentCount + 1,
        });
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
    },

    async getPostById(id: string){
        try {
            const docRef = doc(database, "Posts", id);
            const docSnap = await getDoc(docRef);
        
            if (docSnap.exists()) {
              return {
                id: docSnap.id,
                ...(docSnap.data() as Omit<IPost, "id">),
              };
            } else {
              console.warn(`No post found with id ${id}`);
              return null;
            }
          } catch (error) {
            console.error("Error fetching post:", error);
            return null;
          }
    }
}