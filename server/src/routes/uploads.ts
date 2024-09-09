import { Router } from 'express';
import { upload } from './controllers/uploadController.js';
import { uploadAvatar } from './controllers/avatarController.js';
import { uploadPreview } from './controllers/previewController.js';
import { uploadFile } from './controllers/fileController.js';
import { updateFile } from './controllers/updateFileController.js';

const router = Router()

router.post('/avatar/:type', upload.single('avatar'), uploadAvatar)
router.post('/preview/:type', upload.single('preview'), uploadPreview)
router.post('/files/:type', upload.single('file'), uploadFile)
router.post('/updatefile/:type', upload.single('file'), updateFile)

export default router