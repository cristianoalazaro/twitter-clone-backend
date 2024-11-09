import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { saveUserFile } from "../services/upload";

export const saveFile = async (req: ExtendedRequest, res: Response) => {
    try {
        if (req.fileValidationError) {
            res.status(400).json({ error: req.fileValidationError })
            return;
        }

        if (!req.file) {
            res.status(400).json({ error: 'Nenhuma imagem enviada!' });
            return;
        }

        //Pegar a rota para definir se o upload vai ser avatar ou cover
        const routPath = req.originalUrl;

        await saveUserFile(req.userSlug as string, req.file.filename, routPath);
        res.status(201).json({})
    }catch(e) {
        res.status(400).json({ error: 'Erro ao salvar o nome do arquivo' });
    }
}