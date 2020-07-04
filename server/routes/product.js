const express = require('express');
const router = express.Router();
const multer = require('multer')
const { Product } = require("../models/Product");
const { auth } = require("../middleware/auth");

//=================================
//             Product
//=================================

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 파일 저장경로
        cb(null, 'uploads/') 
    },
    filename: function (req, file, cb) {
        // 파일 명
        cb(null, `${Date.now()}_${file.originalname}`)
    }
  })
   
var upload = multer({ storage: storage }).single("file")


// 이미지 저장
router.post("/image", (req, res) => {
    // 가져온 이미지를 저장 해주면 된다.

    upload(req,res, err =>{
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success: true, filePath: res.req.file.path, fileName: res.req.file.filename })
    })
    
})

// 상품정보를 데이터베이스에 저장

router.post("/", (req, res) => {    

    const product = new Product(req.body)

    product.save((err) =>{
        if(err) return res.status(400).json({success: false, err})
        return res.status(200).json({success:true})
    })
    
})

module.exports = router;
