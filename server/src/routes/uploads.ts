import { Router } from 'express';
import { upload } from './controllers/uploadController.js';
import { uploadAvatar } from './controllers/avatarController.js';
import { uploadPreview } from './controllers/previewController.js';
import { uploadFile } from './controllers/fileController.js';

const router = Router()

router.post('/avatar/:type', upload.single('avatar'), uploadAvatar)
router.post('/preview/:type', upload.single('preview'), uploadPreview)
router.post('/file/:type', upload.single('preview'), uploadFile)

export default router