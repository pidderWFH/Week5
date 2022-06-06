const handle = require("../service/handleSucess");
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
        handle.handleSucess(res, allPost);
    },
    async createdPosts(req, res, next){
        
        // const data = JSON.parse(body); express已經有做了
        const { body } = req;
        
        if(!body.content){
            const newPost = await Post.create(
                {
                    user: body.user,
                    content: body.content,
                    image: body.image,
                    tags: body.tags,
                    type: body.type
                }
            );
            handle.handleSucess(res, newPost);
            
        }else{
            // serviceHandle.handleError(res, errCode=401, "欄位不能空白");
            return next(appError(401, "欄位不能為空白", next));
        }
    },
    async deleteAllPosts(req, res, next){
        const posts = await Post.deleteMany({});
        handle.handleSucess(res, posts);
    },
    async deleteOnePosts(req, res, next){
        
        const id = req.url.split('/').pop();
        deleteOne = await Post.findByIdAndDelete(id);

        if (deleteOne){
            const post = await Post.find();
            handle.handleSucess(res, post);
        }else{
            return next(appError(402, "查無此ID", next));
        }
        
    },
    async patchPosts(req, res, next){
        
        const id = req.url.split("/").pop();
        const { body } = req;
        let { name, content, tags, type, likes } = body;
        const patchPost = await Post.findByIdAndUpdate(id, { $set: {name, content, tags, type, likes} });


        if (body.content == undefined || body.content == "" || body.name == "" || body.content == " " || body.name == " "){
            return next(appError(401, "欄位不能為空白", next));
        }


        if (patchPost === null){
            return next(appError(402, "查無此ID", next));
        }else {
            const post = await Post.findOne({ _id: id });
            handle.handleSucess(res, post);
        } 
       
    },
}

module.exports = posts;