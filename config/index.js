const config = {
    port : 3000,
    mongodb : "mongodb+srv://quiver:quiver@quiver-ncvva.mongodb.net/api_practice?retryWrites=true&w=majority",
    jwtSalt:"QUIVER",
    urlRoot:'http://34.80.102.113/',
}
// module.exports = {
//     config
// }; // 這種寫法在其他file require 時需要用 const(varable).config.port取得port值

module.exports = config; //只有一個直接回傳config 這個物件