import { Sequelize } from "sequelize";
import db from "../config/Database.js"

const {DataTypes} = Sequelize;

const Article = db.define('article',{
    judul: DataTypes.STRING,
    deskripsi: DataTypes.STRING,
    tanggal: DataTypes.DATE,
    image: DataTypes.STRING,
    url: DataTypes.STRING,
},{
    freezeTableName: true
});

export default Article;

(async()=>{
    await db.sync();
})();