import { Request } from "express";

export type ExtendedRequest = Request & {
    userSlug?: string
    fileValidationError?: string;
}