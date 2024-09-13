import Article from "../models/ArticleModel.js";
import path from "path"
import fs from "fs"

export const getArticle = async(req, res)=>{
    try {
        const response = await Article.findAll();
        res.json(response);
    } catch (error) {
        console.log(error.message)
    }
}

export const getArticleById = async(req, res)=>{
    try {
        const response = await Article.findOne({
            where:{
                id:req.params.id
            }
        });
        res.json(response);
    } catch (error) {
        console.log(error.message)
    }
}

export const saveArticle =(req, res)=>{
    if(req.files === null) return res.status(400).json({msg: "No File Uploaded"});
    const judul = req.body.title;
    const deskripsi = req.body.deskripsi;
    const tanggal = req.body.date;
    // const coba = new Date(tanggal);
    const file = req.files.file;
    const fileSize = file.data.length;
    const ext = path.extname(file.name);
    const fileName = file.md5 + ext;
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    const allowedType = ['.png','.jpg','.jpeg', '.webp'];

    if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
    if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

    file.mv(`./public/images/${fileName}`, async(err)=>{
        if(err) return res.status(500).json({msg: err.message});
        try {
            await Article.create({judul: judul, deskripsi: deskripsi, tanggal: tanggal, image: fileName, url: url});
            res.status(201).json({msg: "Product Created Successfuly"});
        } catch (error) {
            console.log(error.message);
        }
    }) 
}

export const updateArticle = async(req, res)=>{
    const article = await Article.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!article) return res.status(404).json({msg: "No Data Found"});    
    
    let fileName = '';
    if(req.files === null){
        fileName = article.image;
    }else{
        const file = req.files.file;
        const fileSize = file.data.length;
        const ext = path.extname(file.name);
        fileName = file.md5 + ext;
        const allowedType = ['.png','.jpg','.jpeg', '.webp'];

        if(!allowedType.includes(ext.toLowerCase())) return res.status(422).json({msg: "Invalid Images"});
        if(fileSize > 5000000) return res.status(422).json({msg: "Image must be less than 5 MB"});

        const filepath = `./public/images/${article.image}`;
        fs.unlinkSync(filepath);

        file.mv(`./public/images/${fileName}`, (err)=>{
            if(err) return res.status(500).json({msg: err.message});
            
        });
    }
    const judul = req.body.title;
    const deskripsi = req.body.deskripsi;
    const tanggal = req.body.date;
    // const coba = new Date(tanggal);
    const url = `${req.protocol}://${req.get("host")}/images/${fileName}`;
    try {
        await Article.update({judul:judul, deskripsi:deskripsi, tanggal:tanggal, image:fileName, url:url }, {
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Article Updated Successfuly"})
    } catch (error) {
        console.log(error.message)
    }
}

export const deleteArticle = async(req, res)=>{
    const article = await Article.findOne({
        where:{
            id : req.params.id
        }
    });
    if(!article) return res.status(404).json({msg: "No Data Found"});

    try {
        const filepath = `./public/images/${article.image}`;
        fs.unlinkSync(filepath);
        await Article.destroy({
            where:{
                id: req.params.id
            }
        });
        res.status(200).json({msg: "Article Deleted Successfuly"});
    } catch (error) {
        console.log(error.message)
    }
}