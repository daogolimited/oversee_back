const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {

        //console.log(file)
        if (file.fieldname === 'main_img')
            cb(null, __dirname + '/../image/main/')
        else if (file.fieldname === 'sub_img1')
            cb(null, __dirname + '/../image/sub1/')
        else if (file.fieldname === 'sub_img2')
            cb(null, __dirname + '/../image/sub2/')
        else if (file.fieldname === 'sub_img3')
            cb(null, __dirname + '/../image/sub3/')
        else if (file.fieldname === 'sub_img4')
            cb(null, __dirname + '/../image/sub4/')
        else if (file.fieldname === 'sub_img5')
            cb(null, __dirname + '/../image/sub5/')
    },
    filename: function (req, file, cb) {
        if (file.fieldname === 'main_img')
            cb(null, Date.now() + '-main.' + file.mimetype.split('/')[1])
        else if (file.fieldname === 'sub_img1')
            cb(null, Date.now() + '-sub1.' + file.mimetype.split('/')[1])
        else if (file.fieldname === 'sub_img2')
            cb(null, Date.now() + '-sub2.' + file.mimetype.split('/')[1])
        else if (file.fieldname === 'sub_img3')
            cb(null, Date.now() + '-sub3.' + file.mimetype.split('/')[1])
        else if (file.fieldname === 'sub_img4')
            cb(null, Date.now() + '-sub4.' + file.mimetype.split('/')[1])
        else if (file.fieldname === 'sub_img5')
            cb(null, Date.now() + '-sub5.' + file.mimetype.split('/')[1])
    }
})
const fileFilter = (req, file, cb) => {
    let typeArray = file.mimetype.split('/')
    let filetype = typeArray[1]
    if (file.fieldname === 'image') {
        if (filetype == 'jpg' || filetype == 'png' || filetype == 'gif' || filetype == 'jpeg' || filetype == 'bmp' || filetype == 'mp4' || filetype == 'avi' || filetype == 'webp')
            return cb(null, true)
    }
    else {
        if (filetype == 'jpg' || filetype == 'png' || filetype == 'jpeg' || filetype == 'bmp' || filetype == 'webp')
            return cb(null, true)
    }
    console.log((file.fieldname === 'image') ? '광고 ' : '상품 ' + '파일 확장자 제한: ', filetype)
    req.fileValidationError = "파일 형식이 올바르지 않습니다(.jpg, .png, .gif 만 가능)"
    cb(null, false, new Error("파일 형식이 올바르지 않습니다(.jpg, .png, .gif 만 가능)"))
}
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limit: { fileSize: 100 * 1024 * 1024 }
})

module.exports = { upload }