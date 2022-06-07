const appError = require("../service/appError");
const Post = require("../model/posts");
const User = require("../model/users");

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
        const posts = await Post.deleteMany({});
        // handle.handleSucess(res, posts);
        res.status(200).send({ posts });
    },
    async deleteOnePosts(req, res, next){
        
        const id = req.params.id;
        deleteOne = await Post.findByIdAndDelete(id);

        if (deleteOne){
            const post = await Post.find();
            res.status(200).send({ post });
        }else{
            return next(appError(4003, "無此使用者貼文", next));
        }
        
    },
    async patchPosts(req, res, next){
        
        const id = req.params.id;
        const { body } = req;
        let { name, content, tags, type, likes } = body;
        if (body.user.trim() && body.content.trim()){
            return next(appError(4002, "欄位不能為空白", next));
        }

        const patchPost = await Post.findByIdAndUpdate
        (
            id,
            { $set: 
                {
                    name, content, tags, type, likes
                }
            },
            { 
                runValidators: true, returnDocument: 'after' 
            } 
        );


       

        if (patchPost === null){
            return next(appError(4001, "無此使用者", next));
        }else {
            // handle.handleSucess(res, post);
            res.status(200).send({ post });
        } 
    },
}

module.exports = posts;