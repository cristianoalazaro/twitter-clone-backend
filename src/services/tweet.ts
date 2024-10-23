import { prisma } from "../utils/prisma"
import { getPublicUrl } from "../utils/url";

export const findTweet = async(id: number) => {
    const tweet = await prisma.tweet.findFirst({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true,
                }
            },
            likes: {
                select: {
                    userSlug: true,
                }
            }
        },
        where: { id }
    });
    
    if(tweet) {
        tweet.user.avatar = getPublicUrl(tweet.user.avatar);
        return tweet;
    }
    return null;
}

export const createTweet = async (userSlug: string, body: string, answerOf?: number) => {
    return await prisma.tweet.create({ data: { userSlug, body, answerOf }});
}
