import { Prisma } from "@prisma/client";
import { prisma } from "../utils/prisma"
import { getPublicUrl } from "../utils/url";

export const findUserByEmail = async(email: string) => {
    const user = await prisma.user.findFirst({
        where: { email }
    });

    if(user) {
        return {
            ...user,
            avatar: getPublicUrl(user.avatar),
            cover: getPublicUrl(user.cover),
        }
    }    
    return null;
}

export const findUserBySlug = async(slug: string) => {
    const user = await prisma.user.findFirst({
        select: {
            avatar: true,
            cover: true,
            slug: true,
            name: true,
            bio: true,
            link: true,
        },
        where: { slug }
    });

    if(user) {
        return {
            ...user,
            avatar: getPublicUrl(user.avatar),
            cover: getPublicUrl(user.cover),
        }
    }    
    return null;
}

export const createUser = async (data: Prisma.UserCreateInput) => {
    const newUser = await prisma.user.create({
        data,
    });

    return {
        ...newUser,
        avatar: getPublicUrl(newUser.avatar),
        cover: getPublicUrl(newUser.cover),
    }
}

export const getUserFollowingCount = async(slug: string) => {
    const count = await prisma.follow.count({
        where: {
            user1Slug: slug,
        }
    });
    return count;
}

export const getUserFollowersCount = async(slug: string) => {
    const count = await prisma.follow.count({
        where: {
            user2Slug: slug,
        }
    });
    return count;
}

export const getUserTweetsCount = async(slug: string) => {
    const count = await prisma.tweet.count({
        where: {
            userSlug: slug,
        }
    });
    return count;
}