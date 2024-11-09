import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import * as tweetController from '../controllers/tweet';
import * as userController from '../controllers/user';
import * as feedControler from '../controllers/feed';
import * as searchTweetsController from '../controllers/searchTweets';
import * as trendControler from '../controllers/trend';
import * as suggestionControler from '../controllers/suggestion';
import * as uploadController from '../controllers/upload';
import { verifyJWT } from "../utils/jwt";
import { upload } from "../utils/multer";
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
mainRouter.put('/user/avatar', verifyJWT, upload.single('file'), uploadController.saveFile);
mainRouter.put('/user/cover', verifyJWT, upload.single('file'), uploadController.saveFile);

mainRouter.get('/feed', verifyJWT, feedControler.getFeed);
mainRouter.get('/search', verifyJWT, searchTweetsController.searchTweets);
mainRouter.get('/trending', verifyJWT, trendControler.getTrends);
mainRouter.get('/suggestions', verifyJWT, suggestionControler.getSuggestions);