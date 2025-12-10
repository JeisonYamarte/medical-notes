


export default function cloudinaryLoader({ src, width, quality } : { src: string; width: number; quality?: number }) {
    const params = [
        'f_auto',         
        'c_limit',        
        `w_${width || 'auto'}`,     
        `q_${quality || 'auto'}` 
    ]

    return `https://res.cloudinary.com/dy8f3lczs/image/upload/${params.join(",")}${src}`
}
