import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { findUserBySlug, getUserFollowersCount, getUserFollowingCount, getUserTweetsCount } from "../services/user";

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