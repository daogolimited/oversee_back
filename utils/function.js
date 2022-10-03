const jwt = require('jsonwebtoken')
const { salt, saltRounds, pwBytes, jwtSecret } = require('../config/config')

function response(req, res, code, message, data, asy) {
    var resDict = {
        'result': code,
        'message': message,
        'data': data,
    }
    //logRequestResponse(req, resDict, asy)
    return res.send(resDict)
}
const isNotNullOrUndefined = (paramList) => {
    for(let i in paramList)
        if(i == undefined || i == null)
            return false
    return true
}
function getNextSequence(name) {
    var ret = db.counters.findAndModify(
        {
            query: { pk: name },
            update: { $inc: { seq: 1 } },
            new: true
        }
    );
    return ret.seq;
}
let checkLevel = (token, level) => {
    try{
        if(token == undefined)
            return false

        //const decoded = jwt.decode(token)
        const decoded = jwt.verify(token, jwtSecret, (err,decoded) => {
            //console.log(decoded)
            if(err) {
                console.log("token이 변조되었습니다." + err);
                return false
            }
            else return decoded;
        })
        
        if(level > decoded.level)
            return false
        else
            return decoded
    }
    catch(err)
    {
        console.log(err)
        return false
    }
}
// api 이름 확인 후 파일 네이밍
const namingImagesPath = (api, files) => {
    if(api == "ad")
    {
        return { 
            image: (files) ? "/image/ad/" + files.filename : "/image/ad/defaultAd.png", 
            isNull: !(files) 
        }
    }
    else if(api == "product")
    {
        return {
            mainImage: (files.mainImage) ? "/image/item/" + files.mainImage[0].filename : "/image/item/defaultItem.png",
            detailImage: (files.detailImage) ? "/image/detailItem/" + files.detailImage[0].filename : "/image/detailItem/defaultDetail.png",
            qrImage: (files.qrImage) ? "/image/qr/" + files.qrImage[0].filename : "/image/qr/defaultQR.png",
            isNull: [!files.mainImage, !files.detailImage, !files.qrImage]
        }
    }
}
module.exports = {
    response, getNextSequence, isNotNullOrUndefined, checkLevel
}