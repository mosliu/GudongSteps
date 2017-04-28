/**
 * Created by Moses on 2017/4/26.
 * 参考https://github.com/hello-earth/CodoonSport/blob/master/CodoonSport.php
 */
'use strict';
var request = require('request');
var jar = request.jar();
const cheerio = require('cheerio');
const FormData = require('form-data');
const crypto = require('crypto');
//const md5 = crypto.createHash('md5');
const moment = require('moment');

request = request.defaults({jar: jar});

const LOGINAUTH = "Basic MDk5Y2NlMjhjMDVmNmMzOWFkNWUwNGU1MWVkNjA3MDQ6YzM5ZDNmYmVhMWU4NWJlY2VlNDFjMTk5N2FjZjBlMzY=";
// const LOGIN_URL = "https://api.codoon.com/token?email=%s&password=%s&grant_type=password&client_id=099cce28c05f6c39ad5e04e51ed60704&scope=user";
const LOGIN_URL = "https://openapi.codoon.com/token";
// const CARIFY_URL = "https://openapi.codoon.com/api/verify_credentials";
const CARIFY_URL = "https://api.codoon.com/api/verify_credentials";
const UPLOAD_STEPS = "https://api.codoon.com/api/mobile_steps_upload_detail";
const BINDURL = "https://api.codoon.com/check_external_bind";


let headers = {
    "User-Agent": "CodoonSport(7.13.0 680;Android 4.4.2;samsung GT-I9500)",
    "Accept-Encoding": "deflate",
    "Authorization": "",
    "Timestamp": "0",
    "Gaea": "cb71db89628d768d185950b4afe6bf76",
    "Uranus": "A1gr5gDL1TFfN4CTu0XQ2EYpzQG9jU+Qh3Qd3FW0K+2mF6WIiJR28Wev5iIuvsLe",
    "did": "24-864895024806919",
    "Davinci": "350139028703096",
    "Connection": "Keep-Alive"
};
var url = "https://openapi.codoon.com/token";


// let username = '18615206565';
let username = '15269116672';
let password = 'Moses0319';
let timestamp = 0;
let refresh_token = "0";
let user_id = "0";
let token = LOGINAUTH;

let form = {
    email: username,
    password: password,
    grant_type: "password",
    //client_id from http://blog.csdn.net/qq_21051503/article/details/49582557
    client_id: "099cce28c05f6c39ad5e04e51ed60704",
    scope: "user"
};

async function main() {
    // await Login();
    // await GetMyInfomation();
    // await uploadSteps(20000);
    await getWxPic();
}
async function Login() {
    console.log("====Login Method");
    //参考http://open.codoon.com/page/index

    // AddHeaderPorperty(url, 0);
    try {
        //获取token
        let response = await post({
            url: url,
            // headers: headers,
            headers: {
                Authorization: LOGINAUTH
            },
            form: form
        });

        // console.dir(response);
        let usertoken = JSON.parse(response.body);
        console.log(usertoken);
        processToken(usertoken);
    } catch (err) {
        console.log(err);
    }

}
async function GetMyInfomation() {
    console.log("===GetMyInfomation Method");
    //console.log("getinfo"+new Date().getTime());
    AddHeaderPorperty(CARIFY_URL, 0);
    try {
        let response = await get({
            url: CARIFY_URL,
            headers: headers
            // headers: {
            //     Authorization: token
            // }
        });
        // console.log(response);
        let userinfo = JSON.parse(response.body);
        console.log(userinfo);
        processToken(userinfo);
    } catch (err) {
        console.log(err);
    }
}

async function uploadSteps(steps) {
    console.log("===uploadSteps Method");
    let now = new Date();
    //最近一个整10分钟整数
    now = Math.floor(now.getTime() / 600000) * 600000;
    let nowtime = moment(now).format("HH:mm");
    // let fromtime = moment(now).subtract(10, 'minute').format("HH:mm");
    let today = moment().format("YYYY-MM-DD");


    let startstep = Math.floor(steps / 2 + Math.random() * steps / 5);
    let stopstep = Math.floor(steps / 2 + Math.random() * steps / 5);
    // moment().subtract(10,'minute').format("m0:s0")

    //发送的数据
    let contents = {content: [], date: today}

    let onetime_step = Math.floor(steps / 3 + (Math.random()-0.5) * steps / 5);
    let rest_steps= steps-onetime_step;
    contents.content.push([nowtime,onetime_step,(onetime_step*0.66*0.067),Math.floor(onetime_step*0.66),600]);
    onetime_step = Math.floor(steps / 3 + (Math.random()-0.5) * steps / 5);
    rest_steps= rest_steps-onetime_step;
    contents.content.push([moment(now).subtract(10, 'minute').format("HH:mm"),onetime_step,(onetime_step*0.66*0.067),Math.floor(onetime_step*0.66),600]);
    contents.content.push([moment(now).subtract(20, 'minute').format("HH:mm"),rest_steps,(rest_steps*0.66*0.067).toFixed(6),Math.floor(rest_steps*0.66),600]);

    contents.content.reverse();
    console.log(contents);
    console.log("====================");
    console.log(JSON.stringify(contents));
    console.log("====================");

    AddHeaderPorperty(UPLOAD_STEPS, JSON.stringify(contents));
    try {
        //获取token
        let response = await post({
            url: UPLOAD_STEPS,
            headers: headers,
            form: {
                content:JSON.stringify(contents.content),
                date:contents.date,
                user_id:user_id
            }
        });

        // console.dir(response);
        let usertoken = JSON.parse(response.body);
        console.log(usertoken);
        // processToken(usertoken);
    } catch (err) {
        console.log(err);
    }

}

async function getWxPic(){
    console.log("===getWxPic Method");
    try {
        let response = await post({
            // url: BINDURL,
            url: BINDURL,
            // headers: headers,
            headers: headers,
            form: {
                source:"addressbook",
                external_id:username
            }
        });

        console.dir(response.body);
        // console.log("---------get qr----------");
        // response = await get({
        //     url: "http://api.codoon.com/api/get_device_qrcode",
        //     // headers: headers,
        //     headers: headers,
        // });
        // console.dir(response.body);

        //“http://qr.liantu.com/api.php?bg=f3f3f3&fg=ff0000&gc=222222&el=l&w=200&m=10&text=” ＋ user_url



            console.log("---------web reg----------");
        response = await post({
            url: "http://www.codoon.com/user/mobile_web_regist",
            // headers: headers,
            headers: headers,
            form:{
                email:"15269116672",
                nick:"nihaoaaaa",
                password:"Moses0319",
                code:"312393"
            }
        });
        console.dir(response.body);


    } catch (err) {
        console.log(err);
    }
}

/**
 * 处理提交的headers
 * @param url
 * @param data
 * @constructor
 */
function AddHeaderPorperty(url, data) {
    headers.Authorization = token;
    headers.Timestamp = timestamp;
    let url2 = url + '^' + data + '^' + refresh_token + '^' + timestamp;
    let gaea = crypto.createHash('md5').update(url2).digest('hex');
    headers.Gaea = gaea;

    let uranus = gaea + '^' + timestamp + '^350139028703096';
    // console.log(uranus)
    uranus = crypto.createHash('md5').update(uranus).digest('hex');
    // console.log(desEncrypt(uranus,"codoon20"));
    uranus = desEncrypt(uranus, "codoon20");
    headers.Uranus = uranus;
}

function processToken(result) {
    if (result.access_token !== undefined) {
        token = "bearer " + result.access_token;
    }
    if (result.timestamp !== undefined) {
        timestamp = result.timestamp;
    }
    if (result.refresh_token !== undefined) {
        refresh_token = result.refresh_token;
    }
    if (result.user_id !== undefined) {
        user_id = result.user_id;
    }


}

// DES 加密
function desEncrypt(message, key) {
    key = key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
    const keyHex = new Buffer(key);
    const cipher = crypto.createCipheriv('des-cbc', keyHex, keyHex);
    let c = cipher.update(message, 'utf8', 'hex');
    c += cipher.final('hex');
    return c
}

// DES 解密
function desDecrypt(text, key) {
    key = key.length >= 8 ? key.slice(0, 8) : key.concat('0'.repeat(8 - key.length));
    const keyHex = new Buffer(key);
    const cipher = crypto.createDecipheriv('des-cbc', keyHex, keyHex);
    let c = cipher.update(text, 'hex', 'utf8');
    c += cipher.final('utf8');
    return c
}

/**
 * 包装Post 成为Promise
 * @param options
 * @returns {Promise}
 */
function post(options) {
    return new Promise(
        (resolve, reject) => {
            request.post(options, function (error, response, body) {
                if (error) return reject(error);
                resolve(response);
            })
        }
    )
}
function get(options) {
    return new Promise(
        (resolve, reject) => {
            request.get(options, function (error, response, body) {
                if (error) return reject(error);
                resolve(response);
            })
        }
    )
}

main();
// var result = md5.update('https://api.codoon.com/token?email=%s&password=%s&grant_type=password&client_id=099cce28c05f6c39ad5e04e51ed60704&scope=user^0^0^0').digest('hex');
// console.log(result);
