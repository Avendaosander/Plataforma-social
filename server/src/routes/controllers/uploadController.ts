import multer from 'multer';

const foldersPath = {
   avatar: './uploads/avatar',
   preview: './uploads/preview',
   files: './uploads/files',
}

type Paths = 'avatar' | 'preview' | 'files' 
// Valida que envie un archivo y administra su nombre y destino
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const type: Paths = req.params.type as Paths;
      // console.log('type: ', type)
      const folderPath = foldersPath[type]

      if (!folderPath) {
         return cb(new Error('Tipo de archivo no válido'), '');
      }

      cb(null, folderPath);
   },
   filename: (req, file, cb) => {
      // console.log('filename: ', file.originalname);
      if (!file.originalname) {
         return cb(new Error('Debes agregar una imagen'), '');
      }
      cb(null, `${Date.now()}-${file.originalname}`);
   },
});

// El tamaño de la imagen maximo
const fileSizeRequired = 50 * 1024 * 1024; // 5MB
// Tipos de extensiones disponibles
const imageType = ["image/png", "image/jpg", "image/jpeg", "image/webp", "image/svg"];

// Valida los formatos, el peso y guarda la imagen
export const upload = multer({
   storage: storage,
   fileFilter: (req, file, cb) => {
      if (!imageType.includes(file.mimetype)) {
         return cb(new Error(`Solamente formatos ${imageType.join(' ')} son permitidos`));
      }
      cb(null, true);
   },
   limits: {
      fileSize: fileSizeRequired,
   },
});
