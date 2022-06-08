const appError = require("../service/appError");
const Post = require("../model/posts");
const User = require("../model/users");
const mongoose = require("mongoose");

const posts = {
    // async getAllPosts(req, res){
    //     const allPost = await Post.find();
    //     serviceHandle.handleSucess(res, allPost);
    // },
    async getAllPosts(req, res, next){
        const timeSort = req.query.timeSort === "asc" ? "createdAt":"-createdAt"
        const q = req.query.q !== undefined ? {"content": new RegExp(req.query.q)} : {};
        const allPost = await Post.find(q).populate({
            path: 'user',
            select: 'name photo '
        }).sort(timeSort);
        // asc 遞增(由小到大，由舊到新) createdAt ; 
        // desc 遞減(由大到小、由新到舊) "-createdAt"
        // handle.handleSucess(res, allPost);
        res.status(200).send({ allPost });
    },
    async createdPosts(req, res, next){
        
        // const data = JSON.parse(body); express已經有做了
        const { body } = req;
        
        if( !body.user || !body.content){
            return appError(400, "未填必填欄位", next);
        }

        if( !body.content.trim() || !body.user.trim()){
  
            // serviceHandle.handleError(res, errCode=401, "欄位不能空白");
            return appError(400, "欄位不能為空白", next);
        }
        const newPost = await Post.create(
            {
                user: body.user,
                content: body.content,
                image: body.image,
                tags: body.tags,
                type: body.type
            }
        );
        // handle.handleSucess(res, newPost);
        res.status(200).send({ newPost });
        
    },
    async deleteAllPosts(req, res, next){
        
        if(req.originalUrl === "/posts/") return appError(404, "無此路由", next);
        const posts = await Post.deleteMany({});
        // handle.handleSucess(res, posts);
        res.status(200).send({ posts });
    },
    async deleteOnePosts(req, res, next){
        
        const id = req.params.id;
        //判斷id是否有正確格式  
        if( ! mongoose.isObjectIdOrHexString(id)) {
            return appError(400, "刪除貼文id格式錯誤", next);
        }
        
        deleteOne = await Post.findByIdAndDelete(id);
        if (deleteOne){
            const post = await Post.find();
            res.status(200).send({ post });
        }else{
            return next(appError(400, "無此貼文", next));
        }
        
    },
    async patchPosts(req, res, next){
        
        const id = req.params.id;
        const { body } = req;

        //判斷id是否有正確格式  
        if( ! mongoose.isObjectIdOrHexString(id)) {
            return appError(400, "修改貼文id格式錯誤", next);
        }
        // let { name, content, tags, type, likes } = body;
        if( !body.content ){
            return appError(400, "未填必填欄位", next);
        }

        if( !body.content.trim() ){
  
            // serviceHandle.handleError(res, errCode=401, "欄位不能空白");
            return appError(400, "欄位不能為空白", next);
        }

        const patchPost = await Post.findByIdAndUpdate
        (
            id,
            { $set: 
                {
                    content: body.content,
                    tags: body.tags,
                    type: body.type,
                }
            },
            { 
                runValidators: true, returnDocument: 'after' 
            } 
        );


        if (patchPost){
            // handle.handleSucess(res, post);
            res.status(200).send({ patchPost });
        }else {
            return next(appError(400, "修改貼文失敗，無此貼文", next));
        } 
    },
}

module.exports = posts;