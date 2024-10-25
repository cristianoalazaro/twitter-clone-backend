import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { findUserBySlug, findUserTweets, getUserFollowersCount, getUserFollowingCount, getUserTweetsCount } from "../services/user";
import { userTweetsSchema } from "../schemas/user-tweets";

export const getUser = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;

    const user = await findUserBySlug(slug);

    if(!user) {
        res.status(404).json({ error: 'Usuário não encontrado' });
        return;
    }

    const followingCount = await getUserFollowingCount(user.slug);
    const followersCount = await getUserFollowersCount(user.slug);
    const tweetsCount = await getUserTweetsCount(user.slug);
    
    res.json({ user, followingCount, followersCount, tweetsCount });
}

export const getUserTweets = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;
    const safeData = userTweetsSchema.safeParse(req.query);
    if(!safeData.success){
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }    

    const currentPage = safeData.data.page ? safeData.data.page : 1;
    const perPage = 10;
    const tweets = await findUserTweets(slug, currentPage, perPage);

    res.json({ tweets, page: currentPage, });
}