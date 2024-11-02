import { ExtendedRequest } from "../types/extended-request";
import { SearchSchema } from "../schemas/search";
import { Response } from "express";
import { findTweetsByBody } from "../services/tweet";

export const searchTweets = async (req: ExtendedRequest, res: Response) => {
    const safeData = SearchSchema.safeParse(req.query);

    if (!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    }

    const perPage = 10;
    const currentPage = safeData.data.page ? safeData.data.page : 1;

    const tweets = await findTweetsByBody(safeData.data.q, perPage, currentPage);

    res.json({ tweets, page: currentPage });
}