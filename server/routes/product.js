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

// 모든 상품 정보를 가져오기
router.post("/products", (req, res) => {    

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;
    let skip = req.body.skip ?  parseInt(req.body.skip) : 0;

    // skip(시작점)과 limit(출력량)을 통해 제한된 숫자만 보여지게끔 
    Product.find()
        .populate('writer')
        .skip(skip)
        .limit(limit)
        .exec((err, productInfo) =>{
            if(err) return res.status(400).json({success: false, err})
            return res.status(200).json({success: true, productInfo, postSize: productInfo.length})
        })
    
})




module.exports = router;
