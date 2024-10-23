import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { createTweet, findTweet } from "../services/tweet";
import { addHashtag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
    const safeData = addTweetSchema.safeParse(req.body);
    if(!safeData.success) return res.json({ error: safeData.error.flatten().fieldErrors });

    if(safeData.data.answer){
        const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
        if(!hasAnswerTweet){
            return res.json({ error: 'Tweet original inexistente' });
        }
    }

    const newTweet = await createTweet(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0,
    );

    res.json({ tweet: newTweet });

    const hashtags = safeData.data.body.match(/#[a-zA-Z0-9]+/g);
    if(hashtags) {
        for(let hashtag of hashtags) {
            if(hashtag.length >= 2){
                await addHashtag(hashtag);
            }
        }
    }
}

export const getTweet = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    
    const tweet = await findTweet(parseInt(id));
    if(!tweet) return res.status(404).json({error: 'Tweet não encontrado'});
    
    res.json(tweet);
}