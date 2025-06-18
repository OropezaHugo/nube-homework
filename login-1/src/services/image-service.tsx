export const imageService = {
    async postImage(file:File): Promise<string | null> {
        const image_data = new FormData();
        image_data.append("file", file);
        image_data.append("upload_preset", "posts-1");
        try {
            const res = await fetch("https://api.cloudinary.com/v1_1/dd6ahs5p4/image/upload", {
                method: "POST",
                body: image_data
            });
            const json_res = await res.json();
            return json_res.secure_url;
        } catch(e:any) {
            return null;    
        }
    }
}