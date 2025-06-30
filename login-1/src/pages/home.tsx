import "./styles/home.css"
import React, { use, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { createContext } from "vm";
import {useAuth} from "../AuthContext"
import {postService} from "../services/post-service"
import {imageService} from "../services/image-service"
import { useNotification } from "../services/notification";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { CallTracker } from "assert";
import { database } from "../firebaseinit";
import { NotificationService } from "../services/notification-service";
interface IPost {
    id: string,
    text: string,
    image: string,
    likes: number,
    dislikes: number,
    createdDate: any,
    userId: string
}
export default function Home(){
    const { user, logout } = useAuth();
    const [post, setpost] = useState<IPost[]>([]);
    const [text, settext] = useState("");
    const [image, setimage] = useState("");
    useNotification(user?.uid || "");
    const fetchPost = async () => {
        if (user){
            const data = await postService.getPost(user.uid);
            setpost(data as IPost[]);
        }
    };

    
    useEffect(() => {
        fetchPost();
    }, [user]);

    const createPost = async () => {
        
        if(!image || !text || !user) return;
        try {
            await postService.postPost(user.uid, text, image);
            const userlist = await getDocs(collection(database, "Persons"));
            const prom: Promise<void>[] = [];
            userlist.forEach((x) => {
                const destinyId = x.id;
                if (destinyId !== user.uid ) {
                    prom.push(
                        NotificationService.Sender(destinyId)
                    );
                }
            });
            await Promise.all(prom)
            settext("");
            fetchPost();
            
        } catch (err:any) {
           console.log("error on notifications")
        }
        
    };

    const deletePost = async (id:string) => {
        await postService.deletePost(id);
        fetchPost();
    };

    const likePost = async (id:string) => {
        try {
            const actualPost = await postService.getPostById(id)
            if (!actualPost) return;
            await postService.likePost(id);
            fetchPost();
            const prom: Promise<void>[] = [];
            prom.push(NotificationService.SendLike(actualPost.userId))
            await Promise.all(prom)
            settext("");
            fetchPost();
            
        } catch (err:any) {
           console.log("error on notifications")
        }
        
    };

    const dislikePost = async (id:string) => {
        try {
            const actualPost = await postService.getPostById(id)
            if (!actualPost) return;
            await postService.dislikePost(id);
            fetchPost();
            const prom: Promise<void>[] = [];
            prom.push(NotificationService.SendDislike(actualPost.userId))
            await Promise.all(prom)
            settext("");
            fetchPost();
            
        } catch (err:any) {
           console.log("error on notifications")
        }
    };

    const uploadImage = async (k: React.ChangeEvent<HTMLInputElement>) => {
        const image = k.target.files?.[0];
        if (!image) return;
        const url = await imageService.postImage(image);
        if (url) {
            setimage(url);
        } else {
            console.error("ni modos, no se pudo subir la imagen")
        }
    };

    return(
        <div className="home-div">
            <h1>Wellcome {user?.email}</h1>
            <h2>Posts</h2>
            <div>
                <input type="text" placeholder="text" value={text} onChange={(a) => settext(a.target.value)}/>
                <input type="file" accept="image/*" onChange={uploadImage} />
                {image && (
                    <img
                    src={image}
                    alt="Imagen del post"
                    width={200}
                    />
                )}
                <button onClick={createPost}>Create Post</button>
            </div>
            
            <div>
                {post.length === 0 && <p>No posts</p>} 
                {post.map((x) => (
                    <div key={x.id}>
                        <p>{x.text}</p>
                        {x.image && (
                            <img src={x.image} alt="Imagen del post" width={200} style={{ marginTop: "10px" }} />
                        )}
                        <small>{new Date(x.createdDate.seconds * 1000).toLocaleString()}</small>
                        <button onClick={() => deletePost(x.id)}>Delete</button>
                        <small>{x.likes}</small>
                        <button onClick={() => likePost(x.id)}>Like</button>
                        <small>{x.dislikes}</small>
                        <button onClick={() => dislikePost(x.id)}>Dislike</button>
                    </div>
                ))}
            </div>
        </div>
        
    );
}