import { Router } from "express";
import * as pingController from "../controllers/ping";
import * as authController from "../controllers/auth";
import { verifyJWT } from "../utils/jwt";
import { addTweet } from "../controllers/tweet";

export const mainRouter = Router();

mainRouter.get('/ping', pingController.ping);
mainRouter.get('/privateping', verifyJWT, pingController.privatePing);
mainRouter.post('/auth/signup', authController.signup);
mainRouter.post('/auth/signin', authController.signIn);

mainRouter.post('/tweet', verifyJWT, addTweet);
//mainRouter.get('/tweet/:id');
//mainRouter.get('/tweet/:id/answers');
//mainRouter.post('/tweet/:id/like');

//mainRouter.get('/user/:slug');
//mainRouter.get('/user/:slug/tweets');
//mainRouter.post('/user/:slug/follow');
//mainRouter.put('/user');
//mainRouter.put('/user/avatar');
//mainRouter.put('/user/cover');

//mainRouter.get('/feed');
//mainRouter.get('/search');
//mainRouter.get('/trending');
//mainRouter.get('/suggestions');