const express = require('express');
const router = express.Router();
const { User } = require("../models/User");
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment')
const { auth } = require("../middleware/auth");
const { now } = require('moment');
const async = require('async')


//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
        cart: req.user.cart,
        history: req.user.history
    });
});

router.post("/register", (req, res) => {

    const user = new User(req.body);

    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).json({
            success: true
        });
    });
});

router.post("/login", (req, res) => {
    User.findOne({ email: req.body.email }, (err, user) => {
        if (!user)
            return res.json({
                loginSuccess: false,
                message: "Auth failed, email not found"
            });

        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch)
                return res.json({ loginSuccess: false, message: "Wrong password" });

            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res
                    .cookie("w_auth", user.token)
                    .status(200)
                    .json({
                        loginSuccess: true, userId: user._id
                    });
            });
        });
    });
});

router.get("/logout", auth, (req, res) => {
    User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
        if (err) return res.json({ success: false, err });
        return res.status(200).send({
            success: true
        });
    });
});

router.post("/addToCart", auth, (req, res) => {
    // 먼저 User Collection에 해당 유저의 모든 정보를 가져오기
    User.findOne({_id: req.user._id}, (err, userInfo) =>{

        let duplicate = false;
        // 가져온 정보에서 카트에다 넣으려하는 상품이 이미 들어있는지 확인
        userInfo.cart.forEach((item) =>{
            if(item.id === req.body.productId){
                duplicate = true;
            }
        })

        // 상품이 이미 있을때 _id로 유저중에 한명을 찾고, cart.id를 통해 상품번호를 찾음
        // $inc increment의 약자, cart의 quantitiy를 1증가 시켜준다.
        // new: true 업데이트된 정보를 받기위해 사용
        if(duplicate){
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id" : req.body.productId},
                { $inc: {"cart.$.quantity": 1}},
                { new: true},
                ( err, userInfo) =>{
                    if(err) return res.status(400).json({success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )
        // 상품이 있지 않을때
        // $push로 cart필드를 추가
        }else{
            User.findOneAndUpdate(
                {_id : req.user._id},
                {
                    $push: {
                        cart: {
                            id: req.body.productId,
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                {new: true},
                (err, userInfo) =>{
                    if(err) return res.status(400).json({success: false, err})
                    res.status(200).send(userInfo.cart)
                }
            )

        }
        
    })    
});

router.get('/removeFromCart', auth, (req,res) =>{

    // 먼저 cart안에 내가 지우려고 한 상품을 지워주기
    User.findOneAndUpdate(
        {_id: req.user._id},
        {
            "$pull":
                {"cart":{"id": req.query.id}}
        },
        {new: true},
        (err, userInfo) =>{
            let cart = userInfo.cart;
            let array = cart.map(item =>{
                return item.id
            })

            // 상품정보와 변경된 카트정보를 다시 보냄
            Product.find({_id: {$in: array}})
                .populate('writer')
                .exec((err, productInfo) =>{
                    return res.status(200).json({
                        productInfo,
                        cart
                    })
                })
        }
    )
})


// 결제 성공시 
router.post('/successBuy', auth, (req,res) =>{

    // 1. User Collection 의 History 필드안에 결제정보 넣어주기 
    let history = [];
    let transactionData = {};

    req.body.cartDetail.forEach((item)=>{
        history.push({
            dateOfPurchase: Date.now(),
            name: item.title,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    // 2. Payment Collection 안에 자세한 결제 정보들 넣어주기
    // auth 미들웨어 거쳐서 들어오는 정보
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email
    }

    // paymentData = paypal에서 보내주는 정보
    transactionData.data = req.body.paymentData

    transactionData.product = history

    User.findOneAndUpdate(
        {_id: req.user._id},
        { $push: {history: history }, $set: {cart: []}},
        { new: true },
        (err, user) =>{
            if(err) return res.json({success: false, err})

            // payment에다가 transactionData 정보 저장
            const payment = new Payment(transactionData)
            payment.save((err, doc) =>{
                if(err) return res.json({success: false, err})

                // 3. Product Collection의 sold 필드 값 업데이트

                // 상품 당 몇 개를 샀는지 

                let products = [];

                doc.product.forEach(item =>{
                    products.push({id: item.id, quantity: item.quantity})
                })

                // async
                async.eachSeries(products, (item, callback) =>{
                    Product.updateOne(
                        {_id: item.id},
                        {
                            $inc: {
                                "sold" : item.quantity
                            }
                        },
                        {new: false},
                        callback
                    )
                }, (err) =>{
                    if(err) return res.status(400).json({success: false, err})
                    res.status(200).json({
                        success: true,
                        cart: user.cart,
                        cartDetail: []
                    })
                })
            })
        }
    )


    

})

module.exports = router;
