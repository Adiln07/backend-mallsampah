import express from "express"
import{
    getArticle,
    getArticleById,
    saveArticle,
    updateArticle,
    deleteArticle
} from "../controllers/ArticleController.js"
const router = express.Router();

router.get('/articles', getArticle);
router.get('/articles/:id', getArticleById);
router.post('/articles', saveArticle);
router.patch('/articles/:id', updateArticle);
router.delete('/articles/:id', deleteArticle);

export default router;