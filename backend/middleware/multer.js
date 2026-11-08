import multer from "multer";
import { mkdirSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { fileURLToPath } from "node:url";

const uploadDirectory = fileURLToPath(
    new URL("../uploads/", import.meta.url)
);

mkdirSync(uploadDirectory, { recursive: true });

const extensionByMimeType = {
    "image/jpeg": ".jpg",
    "image/png": ".png",
    "image/gif": ".gif",
    "image/webp": ".webp",
    "image/avif": ".avif"
};

const storage = multer.diskStorage({
    destination: uploadDirectory,
    filename: (req, file, callback) => {
        const extension = extensionByMimeType[file.mimetype];

        callback(null, `${randomUUID()}${extension}`);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024
    },
    fileFilter: (req, file, callback) => {
        if (!Object.hasOwn(extensionByMimeType, file.mimetype)) {
            callback(new Error("Upload a JPEG, PNG, GIF, WebP, or AVIF image"));
            return;
        }

        callback(null, true);
    }
});

export default upload;