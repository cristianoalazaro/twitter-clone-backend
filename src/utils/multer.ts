import multer, { FileFilterCallback } from "multer";
import path from "path";
import fs from 'node:fs';
import { unlink } from "fs";
import { ExtendedRequest } from "../types/extended-request";

//configurando a pasta
const uploadDir = path.resolve(__dirname, '../../public/images');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

//Função para apagar o arquivo antigo
const deleteOldFile = (fileName: string) => {
    if (fileName) {
        const fullPath = path.join(uploadDir, path.basename(fileName));

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
        }
    }
}

//Filtra somente arquivo de imagem
const fileFilter = (req: ExtendedRequest, file: Express.Multer.File, callback: FileFilterCallback) => {
    if (file.mimetype.startsWith('image/')) {
        callback(null, true);
    } else {
        callback(null, false);
        req.fileValidationError = 'Somente imagens são permitidas';
    }
}

//Configurando o multer
const storage = (multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, uploadDir);
    },
    filename: (req: ExtendedRequest, file, callback) => {
        const { userSlug } = req;

        //Pegar a rota para identificar se é avatar ou cover
        const routPath = req.originalUrl;

        //Pegar a extensão do arquivo
        const extFile = path.extname(file.originalname);

        //Define o arquivo com base na rota
        let fileType = 'avatar';

        if (routPath.includes('cover')) {
            fileType = 'cover';
        }

        //Gera o nome do arquivo
        const newFileName = `${userSlug}_${fileType}${extFile}`;

        //Exclui o arquivo antigo se houver
        deleteOldFile(newFileName);

        callback(null, newFileName);
    }
}))

export const upload = multer({ storage, fileFilter });