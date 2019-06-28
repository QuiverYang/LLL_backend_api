const nilChecker = function (postData,num,optional){
    let keyCount = Object.keys(postData).length;
    let opCount = 0;
    for(let key in postData){
        if(optional.includes(key)){
            opCount++
        }
    }
    if(num>keyCount-opCount){
        return false;
    }
    for(let key in postData){
        let isSkippable = false;
        for(let i = 0; i < optional.length; i++){
            if(optional[i] == key){
                isSkippable = true;
                break;
            }
        }
        //判斷post中的value是否為null或者可跳過
        if(!isSkippable&&!isNaN(postData[key])&&
        (postData[key].length == 0 || postData[key] == null)){
            return false;
        }
    }
    return true;
}
const isfilled = (input)=>{
    if(input === "" || input == undefined){
        return true;
    }
    return false;
}


module.exports = {
    nilChecker,
    isfilled

}