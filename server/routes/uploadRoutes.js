const path = require('path');
const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/authMiddleware');
const fs = require('fs');

const router = express.Router();

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    },
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    },
});

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) {
            console.log('No file received');
            return res.status(400).send({ message: 'No file uploaded' });
        }

        console.log('File uploaded to local:', req.file.path);

        // Configure Cloudinary
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        });

        console.log('Cloudinary Config:', {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY ? '*****' : 'Missing',
            api_secret: process.env.CLOUDINARY_API_SECRET ? '*****' : 'Missing',
        });

        // Upload to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'productkart',
        });

        console.log('Cloudinary Upload Result:', result);

        // Remove file from local storage
        fs.unlinkSync(req.file.path);

        res.send(result.secure_url);
    } catch (error) {
        console.error('Upload Error:', error);
        res.status(500).send({ message: 'Upload failed', error: error.message });
    }
});

module.exports = router;
