import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { checkIfFollows, findUserBySlug, findUserTweets, follow, getUserFollowersCount, getUserFollowingCount, getUserTweetsCount, unfollow, updateUserInfo } from "../services/user";
import { userTweetsSchema } from "../schemas/user-tweets";
import { UpdateUserSchema } from "../schemas/update-user";

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

export const followToggle = async (req: ExtendedRequest, res: Response) => {
    const { slug } = req.params;
    const me = req.userSlug as string;

    if (slug === me) {
        res.status(400).json({ error: 'Usuário não pode seguir ele mesmo!' });
        return;
    }

    const hasUserToBeFollwed = await findUserBySlug(slug);
    if(!hasUserToBeFollwed) {
        res.json({ error: 'Usuário não existe!' });
        return;
    }

    const follows = await checkIfFollows(me, slug);
    
    if (!follows) {
        await follow(me, slug);
        res.json({ following: true })
    } else {
        await unfollow(me, slug);
        res.json({ following: false })
    }
}

export const updateUser = async(req: ExtendedRequest, res: Response) => {
    const safeData = UpdateUserSchema.safeParse(req.body);

    if(!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    await updateUserInfo(req.userSlug as string, safeData.data);
    res.json({});
}