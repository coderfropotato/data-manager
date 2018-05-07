import bus from "@/utils/bus";
let request;
let getRemoteData = function (URL, API, params) {
    if (API === '') {
        console.error('请求API为空')
        return
    }
    request = new XMLHttpRequest();
    request.responseType = "text";
    params = params || {}
    let Param = {
        API,
        params
    }
    request.open('POST', URL + '/' + Param.API, true);
    request.send(JSON.stringify(Param.params));
    return new Promise((resolve, reject) => {
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status >= 200 && request.status < 300 || request.status == 304) {
                    resolve(JSON.parse(request.responseText));
                } else {
                    bus.$emit('Error');
                    reject(request.responseText)
                }
            }
        }
    })
}

export default getRemoteData;