import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, database } from "../firebaseinit";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

export default function Register() {
   
    const [email, setemail] = useState("");
    const [phone, setphone] = useState("");
    const [birthdate, setbirthdate] = useState("");
    const [password, setpassword] = useState("");
    const [error, seterror] = useState(""); 
    const navigator = useNavigate();

    const handleregister = async (f: React.FormEvent) => {
        f.preventDefault();
        try {
            const creds = await createUserWithEmailAndPassword(auth, email, password);
            const user = creds.user;
            await setDoc(doc(database, "Persons", user.uid), {
                BirthDate: birthdate,
                Email: email,
                Phone: phone,
            });

            navigator("/home");
        } catch (err:any) {
            seterror(err.message)
        }
    }
    return (
        <div>
            <h2>REGISTRO</h2>
            <form onSubmit={handleregister}>
                <input type="email" placeholder="email@correo.cosa" value={email} onChange={(a) => setemail(a.target.value)} required/>
                <input type="password" placeholder="******" value={password} onChange={(p) => setpassword(p.target.value)} required/>
                <input type="text" placeholder="yyyy/mm/dd" value={birthdate} onChange={(b) => setbirthdate(b.target.value)} required/>
                <input type="phone" placeholder="+591 729202484" value={phone} onChange={(l) => setphone(l.target.value)} required/>
                <button type="submit">HECHO</button>
                {error && <p>{error}</p>}
            </form>
            
        </div>
    );
}