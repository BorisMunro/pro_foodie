import { Document, isValidObjectId, model, Schema } from "mongoose";
import { IComment } from "./CommentSchema";
import { IUser } from "./UserSchema";

export enum EPrivacy {
    private = 'private',
    public = 'public',
    follower = 'follower'
}

export interface IPost extends Document {
    _author_id: IUser['_id'];
    privacy: EPrivacy;
    photos?: string[];
    description: string;
    likes: Array<IUser['_id']>;
    comments: Array<IComment['_id']>;
    isEdited: boolean;
    createdAt: string | number;
    updatedAt: string | number;

    author: IUser;

    isPostLiked(id: string): boolean;
}

const PostSchema = new Schema({
    _author_id: {
        // author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    privacy: {
        type: String,
        default: 'public',
        enum: ['private', 'public', 'follower']
    },
    photos: [String],
    description: {
        type: String,
        default: ''
    },
    likes: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    comments: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    isEdited: {
        type: Boolean,
        default: false
    },
    createdAt: Date,
    updatedAt: Date,
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { getters: true, virtuals: true } });

PostSchema.virtual('author', {
    ref: 'User',
    localField: '_author_id',
    foreignField: '_id',
    justOne: true
});

PostSchema.virtual('commentsCount', {
    ref: 'Comment',
    localField: 'comments',
    foreignField: '_id',
    count: true
});

PostSchema.virtual('likesCount', {
    ref: 'User',
    localField: 'likes',
    foreignField: '_id',
    count: true
});

PostSchema.methods.isPostLiked = function (this: IPost, userID) {
    if (!isValidObjectId(userID)) return;

    return this.likes.some(user => {
        return user._id.toString() === userID.toString();
    });
}

export default model<IPost>('Post', PostSchema);
