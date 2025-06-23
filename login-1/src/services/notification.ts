import { useEffect } from "react";
import { collection, query, where, onSnapshot, doc, updateDoc, limit } from "firebase/firestore";
import { database } from "../firebaseinit";
import { toast } from "react-toastify";

export function useNotification(destiny: string, putNotReadCounter?: (x:number ) => void)  {
    useEffect(() => {
        if(!destiny) return;
        const command = query(
            collection(database, "notifications"),
            where("destiny", "==", destiny),
            
        );
        limit(1);
        const sub = onSnapshot(command, (x) => {
            if(putNotReadCounter) {
                putNotReadCounter(x.size)
            };
            x.docChanges().forEach((y) => {
                if(!y.doc.metadata.hasPendingWrites) {
                    const mydata = y.doc.data();
                    toast.info(mydata.message, {
                        autoClose: 3000,
                        position: "top-center"
                    });
                };
            });
        });
        return () => sub();
    }, [destiny, putNotReadCounter]);
};