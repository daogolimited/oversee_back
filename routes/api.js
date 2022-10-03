const Product = require('../models/products');
const User = require('../models/users');
const Sale = require('../models/sales')
const Category = require('../models/categories');

const jwt = require('jsonwebtoken')
const crypto = require('crypto');
const { salt, saltRounds, pwBytes, jwtSecret } = require('../config/config')
const { response, isNotNullOrUndefined, checkLevel } = require('../utils/function')

const onLogin = async (req, res) => {
    try {
        let { id, pw } = req.body;
        let user = await User.findOne({ id });
        if (user) {
            await crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                let hash = decoded.toString('base64');

                if (user.pw == hash) {
                    const token = jwt.sign({
                        pk: user.pk,
                        id: user.id,
                        email: user.email,
                        nickname: user.nickname,
                        phone: user.phone,
                        address: user.address,
                        level: user.level
                    },
                        jwtSecret,
                        {
                            expiresIn: '600m',
                            issuer: 'fori',
                        });
                    res.cookie("token", token, { maxAge: 60 * 60 * 1000 * 10 });

                    return response(req, res, 200, 'Congratulation ' + user.nickname, []);

                } else {
                    return response(req, res, -100, "없는 회원입니다.", [])
                }
            })
        } else {
            return response(req, res, -100, "없는 회원입니다.", [])
        }
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const getUserToken = (req, res) => {
    try {
        const decode = checkLevel(req.cookies.token, 0)
        if (decode) {
            let id = decode.id;
            let pk = decode.pk;
            let email = decode.email;
            let nickname = decode.nickname;
            let phone = decode.phone;
            let address = decode.address;
            let level = decode.level;

            res.send({ id, pk, email, nickname, phone, address, level })
        }
        else {
            res.send({
                pk: -1,
                level: -1
            })
        }
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

const onSignUp = async (req, res) => {
    try {
        const { id, pw, name, address, email, nickname, level} = req.body;
        if (isNotNullOrUndefined([id, pw, name, email, nickname, level])) {
            var existId = await User.findOne({ id: id });
            if (existId) {
                return response(req, res, -100, "이미 존재하는 id 입니다.", [])
            } else {
                await crypto.pbkdf2(pw, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                    let hash = decoded.toString('base64');
                    if (err) {
                        console.log(err)
                        return response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                    } else {

                        let new_user = new User({
                            id: id, pw: hash, name: name, address: address, email: email, nickname: nickname, level: level
                        })
                        try {
                            let result = await new_user.save();
                            return response(req, res, 100, "유저 insert 성공", [])
                        } catch (e) {
                            return response(req, res, -200, "유저 insert 과정 에러", [])
                        }
                    }
                })
            }
        } else {
            return response(req, res, -100, "필요값이 비어있습니다.", [])
        }

    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const onLogout = (req, res) => {
    try {
        res.clearCookie('token')
        //res.clearCookie('rtoken')
        return response(req, res, 200, "로그아웃 성공", [])
    }
    catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const getUsers = async (req, res) => {
    try {
        let maxPage = 0;
        let data = [];
        if (req.query.page) {

            let count = await User.count();
            if (count % 10 == 0) {
                maxPage = count / 10;
            } else {
                maxPage = (count - count % 10) / 10 + 1;
            }
            data = await User.find().sort({ "date": -1 }).skip((req.query.page - 1) * 10).limit(10); // 전체 리스트 불러오기.
        } else {
            data = await User.find().sort({ "date": -1 })
        }

        return response(req, res, 200, "불러오기 성공", { data: data, maxPage: maxPage })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const getUser = async (req, res) => {
    try {
        let data = await User.findOne({ pk: req.params.pk });
        response(req, res, 200, "유저 하나 성공", data)
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const checkId = async (req, res) =>{
    try {
        let data = await User.findOne({ id: req.body.id });
        if(data){
            response(req, res, -50, "Id already exists", [])

        }else{
            response(req, res, 100, "Id is available", [])

        }
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const updateUser = async (req, res) => {
    try {
        const { id, pw, name, address, email, nickname, level, pk } = req.body;
        if (isNotNullOrUndefined([id, name, email, nickname, level, pk])) {
            var existId = await User.findOne({ id: id });
            if (existId && existId.pk != pk) {
                return response(req, res, -100, "이미 존재하는 id 입니다.", [])
            } else {
                let password = pw ?? "";
                await crypto.pbkdf2(password, salt, saltRounds, pwBytes, 'sha512', async (err, decoded) => {
                    let hash = decoded.toString('base64');
                    if (err) {
                        console.log(err)
                        return response(req, res, -200, "비밀번호 암호화 도중 에러 발생", [])
                    } else {
                        let whereObj = { pk: req.body.pk };
                        let obj = {id: id, name: name, address: address, email: email, nickname: nickname, level: level};
                        if(pw){
                            obj.pw = hash;
                        }
                        let setObj = { $set: obj };
                        try {
                            let result = await User.updateMany(whereObj, setObj)
                            return response(req, res, 100, "유저 update 성공", [])
                        } catch (e) {
                            return response(req, res, -200, "유저 update 과정 에러", [])
                        }
                                                
                    }
                })
            }
        } else {
            return response(req, res, -100, "필요값이 비어있습니다.", [])
        }
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const deleteUser = async (req, res) => {
    try {
        const pk = req.body.pk
        let result = await User.deleteOne({ pk: pk })
        if (result.acknowledged) {
            response(req, res, 200, "유저 삭제 성공", [])
        } else {
            response(req, res, -100, "유저 삭제 실패", [])
        }
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const getCategory = async (req, res) => {
    try {
        let data = await Category.findOne({ pk: req.params.pk });
        return response(req, res, 200, "카테고리 하나 성공", data)
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const updateCategory = async (req, res) => {
    try {
        let findName = await Category.findOne({ name: req.body.name, pk: { $ne: req.body.pk } });
        if (findName) {
            return response(req, res, -100, "카테고리명이 중복됩니다.", [])
        }
        let findEnName = await Category.findOne({ en_name: req.body.en_name, pk: { $ne: req.body.pk } });
        if (findEnName) {
            return response(req, res, -100, "uri 이름이 중복됩니다.", [])
        }
        let whereObj = { pk: req.body.pk };
        let setObj = { $set: req.body };
        //let result = new Category(req.body)
        let result = await Category.updateMany(whereObj, setObj)
        return response(req, res, 100, "성공적으로 수정되었습니다.", result)
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const getCategories = async (req, res) => {
    try {
        let maxPage = 0;
        let data = [];
        if (req.query.page) {

            let count = await Category.count();
            if (count % 10 == 0) {
                maxPage = count / 10;
            } else {
                maxPage = (count - count % 10) / 10 + 1;
            }
            data = await Category.find().sort({ "date": -1 }).skip((req.query.page - 1) * 10).limit(10); // 전체 리스트 불러오기.
        } else {
            data = await Category.find().sort({ "date": -1 })
        }

        return response(req, res, 200, "불러오기 성공", { data: data, maxPage: maxPage })
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const addCategory = async (req, res) => {
    try {
        let findName = await Category.findOne({ name: req.body.name });
        if (findName) {
            return response(req, res, -100, "카테고리명이 중복됩니다.", [])
        }
        let findEnName = await Category.findOne({ en_name: req.body.en_name });
        if (findEnName) {
            return response(req, res, -100, "uri 이름이 중복됩니다.", [])
        }
        let new_category = new Category(req.body)
        let result = new_category.save();
        return response(req, res, 100, "성공적으로 추가되었습니다.", result)
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const deleteCategory = async (req, res) => {
    try {
        const pk = req.body.pk
        let result = await Category.deleteOne({ pk: pk })
        let result2 = await Product.deleteMany({ category_pk: pk })
        if (result.acknowledged && result2.acknowledged) {
            response(req, res, 200, "카테고리 삭제 성공", [])
        } else {
            response(req, res, -100, "카테고리 삭제 실패", [])
        }
    } catch (e) {
        console.log(e)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

const addProduct = async (req, res) => {
    try {
        let obj = {
            name: req.body.name,
            price: req.body.price,
            category_pk: req.body.category_pk,
            note: req.body.note,
            main_img: req.body.main_img
        }
        for (var i = 1; i <= 3; i++) {
            if (req.body[`sub_img${i}`]) {
                obj[`sub_img${i}`] = req.body[`sub_img${i}`];
            }
        }
        let new_product = new Product(obj);
        try {
            await new_product.save();
            return response(req, res, 200, "상품 저장 성공", [])
        } catch (e) {
            console.log(e)
            return response(req, res, -200, "서버 에러 발생", [])
        }

    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const updateProduct = async (req, res) => {
    try {

        let whereObj = { pk: req.body.pk };
        let obj = {
            name: req.body.name,
            price: req.body.price,
            category_pk: req.body.category_pk,
            note: req.body.note
        }
        if (req.body.main_img) {
            obj.main_img = req.body.main_img
        }
        for (var i = 1; i <= 3; i++) {
            if (req.body[`sub_img${i}`]) {
                obj[`sub_img${i}`] = req.body[`sub_img${i}`];
            }
        }
        let setObj = { $set: obj };
        let result = await Product.updateMany(whereObj, setObj)
        return response(req, res, 100, "성공적으로 수정되었습니다.", result)

    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const getProducts = async (req, res) => {
    try {
        let maxPage = 0;
        let data = [];
        let whereObj = null;
        if (req.query.category_pk) {
            whereObj = { category_pk: req.query.category_pk };
        }
        if (req.query.page) {

            let count = await Product.count();
            if (count % 10 == 0) {
                maxPage = count / 10;
            } else {
                maxPage = (count - count % 10) / 10 + 1;
            }
            data = await Product.find(whereObj).sort({ "date": -1 }).skip((req.query.page - 1) * 10).limit(10); // 전체 리스트 불러오기.
        } else {
            data = await Product.find(whereObj).sort({ "date": -1 })
        }

        return response(req, res, 200, "불러오기 성공", { data: data, maxPage: maxPage })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}
const getProduct = async (req, res) => {
    try {
        let data = await Product.findOne({ pk: req.params.pk });
        let category = await Category.findOne({ pk: data.category_pk });
        return response(req, res, 200, "상품 하나 성공", { data: data, category: category })
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", []);
    }
}
const deleteProduct = async (req, res) => {
    try {
        const pk = req.body.pk
        let result = await Product.deleteOne({ pk: pk })
        if (result.acknowledged) {
            response(req, res, 200, "상품 삭제 성공", [])
        } else {
            response(req, res, -100, "상품 삭제 실패", [])
        }
    } catch (err) {
        console.log(err)
        return response(req, res, -200, "서버 에러 발생", [])
    }
}

module.exports = {
    onLogin, addProduct, getProduct, getProducts, deleteProduct, onSignUp, getUsers, getUser, getUserToken, onLogout, deleteUser, getCategories, getCategory, addCategory, deleteCategory, updateCategory, updateProduct, updateUser, checkId
}