import "./styles/home.css"
import React, { use, useContext, useEffect, useState } from "react";
import { User } from "firebase/auth";
import { createContext } from "vm";
import {useAuth} from "../AuthContext"
import {postService} from "../services/post-service"
interface IPost {
    id: string,
    text: string,
    createdDate: any
}
export default function Home(){
    
      
    const { user, logout } = useAuth();
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [post, setpost] = useState<IPost[]>([]);
    const [text, settext] = useState("");
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
        if(!text || !user) return;
        await postService.postPost(user.uid, text);
        settext("");
        fetchPost();
    };

    const deletePost = async (id:string) => {
        
        await postService.deletePost(id);
        fetchPost();
    };

    return(
        <div className="home-div">
            <h1>Wellcome {user?.email}</h1>
            <h2>Posts</h2>
            <div>
                <input type="text" placeholder="text" value={text} onChange={(a) => settext(a.target.value)}/>
                <button onClick={createPost}>Create Post</button>
            </div>
            <div>
                {post.length === 0 && <p>No posts</p>} 
                {post.map((x) => (
                    <div key={x.id}>
                        <p>{x.text}</p>
                        <small>{new Date(x.createdDate.seconds * 1000).toLocaleString()}</small>
                        <button onClick={() => deletePost(x.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
        
    );
}