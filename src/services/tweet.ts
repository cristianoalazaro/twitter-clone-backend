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

export const findAnswersFromTweet = async(id: number) => {
    const tweets = await prisma.tweet.findMany({
        include: {
            user: {
                select: {
                    name: true,
                    avatar: true,
                    slug: true
                }
            },
            likes: {
                select:{
                    userSlug: true
                }
            }
        },
        where: { answerOf: id }
    });

    if(tweets) {
        for (const tweetIndex in tweets) {
            tweets[tweetIndex].user.avatar = getPublicUrl(tweets[tweetIndex].user.avatar);
        }
    }

    return tweets;
}

export const checkIfTweetIsLikedByUser = async (userSlug: string, tweetId: number) => {
    const isLiked = await prisma.tweetLike.findFirst({
        where: {
            tweetId,
            userSlug,
        }
    });
    return isLiked ? true : false;    
}

export const unlikeTweet = async(userSlug: string, tweetId: number) => {
    await prisma.tweetLike.deleteMany({
        where: {
            tweetId,
            userSlug
        }
    });
}

export const likeTweet = async(userSlug: string, tweetId: number) => {
    await prisma.tweetLike.create({
        data: {
            tweetId,
            userSlug
        }
    });
}