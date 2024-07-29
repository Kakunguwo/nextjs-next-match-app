import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/uploads')
    },
    filename: function (req, file, cb) {
        const originalName = path.parse(file.originalname).name;
        const extension = path.parse(file.originalname).ext;
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, originalName + '-' + uniqueSuffix + extension);
    }
})

export const upload = multer({ storage: storage });