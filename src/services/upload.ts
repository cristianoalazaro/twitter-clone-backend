import { prisma } from "../utils/prisma"

export const saveUserFile = async(slug: string, file: string, routPath: string) => {
    await prisma.user.update({ 
        where: { slug },
        data: {
            [routPath.includes('avatar') ? 'avatar' : 'cover']: file,
        }
    });
}