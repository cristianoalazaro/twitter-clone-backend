import { Response } from "express";
import { ExtendedRequest } from "../types/extended-request";
import { addTweetSchema } from "../schemas/add-tweet";
import { checkIfTweetIsLikedByUser, createTweet, findAnswersFromTweet, findTweet, likeTweet, unlikeTweet } from "../services/tweet";
import { addHashtag } from "../services/trend";

export const addTweet = async (req: ExtendedRequest, res: Response) => {
    const safeData = addTweetSchema.safeParse(req.body);
    if(!safeData.success) {
        res.json({ error: safeData.error.flatten().fieldErrors });
        return;
    } 

    if(safeData.data.answer){
        const hasAnswerTweet = await findTweet(parseInt(safeData.data.answer));
        if(!hasAnswerTweet){
            res.json({ error: 'Tweet original inexistente' });
            return;
        }
    }

    const newTweet = await createTweet(
        req.userSlug as string,
        safeData.data.body,
        safeData.data.answer ? parseInt(safeData.data.answer) : 0,
    );

    const hashtags = safeData.data.body.match(/#[a-zA-Z0-9]+/g);
    if(hashtags) {
        for(let hashtag of hashtags) {
            if(hashtag.length >= 2){
                await addHashtag(hashtag);
            }
        }
    }
    res.json({ tweet: newTweet });
}

export const getTweet = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;
    
    const tweet = await findTweet(parseInt(id));
    if(!tweet) {
        res.status(404).json({error: 'Tweet não encontrado'});
        return;
    } 
    
    res.json(tweet);
}

export const getAnswers = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const answers = await findAnswersFromTweet(parseInt(id));
    res.json({ answers });
}

export const likeToggle = async (req: ExtendedRequest, res: Response) => {
    const { id } = req.params;

    const liked = await checkIfTweetIsLikedByUser(req.userSlug as string, parseInt(id));

    if (liked) {
        unlikeTweet(req.userSlug as string, parseInt(id));
    } else {
        likeTweet(req.userSlug as string, parseInt(id));
    }
    res.json({});
}
