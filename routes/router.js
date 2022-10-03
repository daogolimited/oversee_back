const express = require('express');
const router = express.Router();
const { upload } = require('../config/multerConfig')
const { onLogin, addProduct, getProduct, getProducts, deleteProduct, onSignUp, getUsers, getUser, onLogout, getUserToken, deleteUser, getCategories, getCategory, addCategory, deleteCategory, updateCategory, updateProduct, updateUser, checkId } = require('./api')

router.post('/login', onLogin);
router.post('/logout', onLogout);
router.get('/auth', getUserToken);
router.post('/adduser', onSignUp);
router.post('/checkid', checkId);
router.post('/updateuser', updateUser);
router.get('/users', getUsers)
router.get('/user/:pk', getUser)
router.post('/deleteuser', deleteUser)
router.post('/addproduct', addProduct);
router.post('/updateproduct', updateProduct);
router.get('/products', getProducts);
router.get('/product/:pk', getProduct);
router.post('/deleteproduct', deleteProduct);
router.get('/categories', getCategories);
router.get('/category/:pk', getCategory);
router.post('/addcategory', addCategory);
router.post('/deletecategory', deleteCategory);
router.post('/updatecategory', updateCategory);
module.exports = router;