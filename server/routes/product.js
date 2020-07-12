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
    let term = req.body.searchTerm

    let findArgs = {};

    for(let key in req.body.filters){

        // key는 category인 continents or price
        if(req.body.filters[key].length > 0){

            if(key === "price"){
                findArgs[key] = {
                    // greater than equal, 몽고 DB에서 크거나 같은
                    $gte: req.body.filters[key][0],
                    // less than equeal, 몽고 DB에서 작거나 같은
                    $lte: req.body.filters[key][1]
                }
            }else{
                findArgs[key] = req.body.filters[key];
            }           
        }

    }    

    console.log(findArgs)

    // 검색 조건이 있을시
    if(term){
        Product.find(findArgs)
            // 많은양의 데이터중 검색시 $text 사용
            //.find({$text: {$search: term}})
            // 일반적인 Like 같은 효과를 위해선 아래 사용, 위보다 느림
            .find({"title":{'$regex': term}})
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) =>{
                if(err) return res.status(400).json({success: false, err})
                return res.status(200).json({success: true, productInfo, postSize: productInfo.length})
            })    
    }else{
    // skip(시작점)과 limit(출력량)을 통해 제한된 숫자만 보여지게끔 
        Product.find(findArgs)
            .populate('writer')
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) =>{
                if(err) return res.status(400).json({success: false, err})
                return res.status(200).json({success: true, productInfo, postSize: productInfo.length})
            })
    }    
})


// 상세정보 가져오기
router.get("/products_by_id", (req, res) => {    

    let type = req.query.type
    let productIds = req.query.id

    
    if(type === "array"){
        // id = 123123123, 324324324, 456456456 이렇게오면
        // productIds = ['123123123', '324324324', '456456456']으로 바꿔 넣어주려고함 
        let ids = req.query.id.split(',')
        productIds = ids.map(item=>{
            return item
        })
    }

    // productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.
    // 여러값 받을땐 $in
    Product.find({_id: {$in: productIds}})
        .populate('writer')
        .exec((err, product) =>{
            if(err) return res.status(400).send(err)
            return res.status(200).json({success: true, product})
        })


})




module.exports = router;
