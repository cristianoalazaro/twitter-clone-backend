import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { FeedSchema } from "../schemas/feed";
import { findTweetsFeed, getUsersFollowing } from "../services/user";

export const getFeed = async (req: ExtendedRequest, res: Response) => {
    const safeData = FeedSchema.safeParse(req.query);

    if(!safeData.success) {
        res.json({error: safeData.error.flatten().fieldErrors});
        return;
    }

    const currentPage = safeData.data.page ? safeData.data.page : 1;
    const perPage = 10;

    const usersFollowing = await getUsersFollowing(req.userSlug as string);
    const tweets = await findTweetsFeed(usersFollowing, currentPage, perPage);

    res.json({ tweets, currentPage });
}