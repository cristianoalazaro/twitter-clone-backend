import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as tweetController from '../controllers/tweet';
import * as userController from '../controllers/user';
import { verifyJWT } from "../utils/jwt";
import { getFeed } from "../controllers/feed";
import { searchTweets } from "../controllers/searchTweets";
import { getTrends } from "../controllers/trend";
export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);
mainRouter.get('/privateping', verifyJWT, pingController.privatePing);
mainRouter.post('/auth/signup', authController.signup);
mainRouter.post('/auth/signin', authController.signIn);

mainRouter.post('/tweet', verifyJWT, tweetController.addTweet);
mainRouter.get('/tweet/:id', verifyJWT, tweetController.getTweet);
mainRouter.get('/tweet/:id/answers', verifyJWT, tweetController.getAnswers);
mainRouter.post('/tweet/:id/like', verifyJWT, tweetController.likeToggle);

mainRouter.get('/user/:slug', verifyJWT, userController.getUser);
mainRouter.get('/user/:slug/tweets', verifyJWT, userController.getUserTweets);
mainRouter.post('/user/:slug/follow', verifyJWT, userController.followToggle);
mainRouter.put('/user', verifyJWT, userController.updateUser);
//mainRouter.put('/user/avatar');
//mainRouter.put('/user/cover');

mainRouter.get('/feed', verifyJWT, getFeed);
mainRouter.get('/search', verifyJWT, searchTweets);
mainRouter.get('/trending', verifyJWT, getTrends);
//mainRouter.get('/suggestions');