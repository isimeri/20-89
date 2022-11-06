function getProp(elem, prop){
    return parseFloat(getComputedStyle(elem).getPropertyValue(prop))
}

function setProp(elem, prop, value){
    elem.style.setProperty(prop, value);
}

function incrementProp(elem, prop, inc){
    setProp(elem, prop, getProp(elem, prop) + inc);
}

function detectBrowser() {
    if (navigator.userAgent.includes("Chrome")) {
    //   return "chrome"
        document.body.className = "chrome";
        return
    }
    if (navigator.userAgent.includes("Firefox")) {
    //   return "firefox"
        document.body.className = "firefox";
        return
    }
    if (navigator.userAgent.includes("Opera")) {
        document.body.className = "opera";
        return
    }
}


const stripesMedium = document.querySelectorAll('.stripes-layer.medium .ver-text');
const stripesBig = document.querySelectorAll('.stripes-layer.big .ver-text');
const stripesSmall = document.querySelectorAll('.stripes-layer.small .ver-text');

const stripesConBig = document.querySelectorAll(".stripes-layer.big > .ver-container");
const stripesConSmall = document.querySelectorAll(".stripes-layer.small > .ver-container");
const stripesConMedium = document.querySelectorAll(".stripes-layer.medium > .ver-container");

const stripes1 = document.querySelectorAll('.ver-text.one');

const stripesMedium2 = document.querySelectorAll('.stripes-layer.medium .ver-text.two');
const stripesBig2 = document.querySelectorAll('.stripes-layer.big .ver-text.two');
const stripesSmall2 = document.querySelectorAll('.stripes-layer.small .ver-text.two');

const speedMedium = 1;
const speedBig = 1.5;



const arrB = Array.from(stripesConBig)
let stripesB = [];
for(let i = 0; i < arrB.length; i++){
    const speed = Math.random() * 0.2 + 1.4;
    const h1 = {stripe: arrB[i].firstElementChild, speed}
    const h2 = {stripe: arrB[i].lastElementChild, speed}
    stripesB.push(h1, h2);
}
const arrM = Array.from(stripesConMedium)
let stripesM = [];
for(let i = 0; i < arrM.length; i++){
    const speed = Math.random() * 0.2 + 0.9;
    const h1 = {stripe: arrM[i].firstElementChild, speed}
    const h2 = {stripe: arrM[i].lastElementChild, speed}
    stripesM.push(h1, h2);
}
const arrS = Array.from(stripesConSmall)
let stripesS = [];
for(let i = 0; i < arrS.length; i++){
    const speed = Math.random() * 0.1 + 0.5;
    const h1 = {stripe: arrS[i].firstElementChild, speed}
    const h2 = {stripe: arrS[i].lastElementChild, speed}
    stripesS.push(h1, h2);
}

function setupStripes(){
    stripes1.forEach(s => {
        setProp(s, '--y', 0);
    });
    stripesMedium2.forEach(s => {
        setProp(s, '--y', -2312);
    });
    stripesBig2.forEach(s => {
        setProp(s, '--y', -4284);
    });
    stripesSmall2.forEach(s => {
        setProp(s, '--y', -1440);
    });
    //nr de litere * (font-size + letter-spacing) = inaltimea unui stripe
}

function updateStripes(){
    stripesM.forEach(str => {
        incrementProp(str.stripe, '--y', str.speed);
        if(getProp(str.stripe, "--y") > 1400){
            setProp(str.stripe, "--y", getProp(str.stripe, "--y") - 2312 * 2);
        }
    });
    stripesB.forEach(str => {
        incrementProp(str.stripe, '--y', str.speed);
        if(getProp(str.stripe, "--y") > 1400){
            setProp(str.stripe, "--y", getProp(str.stripe, "--y") - 4284 * 2);
        }
    });
    stripesS.forEach(str => {
        incrementProp(str.stripe, '--y', str.speed);
        if(getProp(str.stripe, "--y") > 1400){
            setProp(str.stripe, "--y", getProp(str.stripe, "--y") - 1440* 2);
        }
    });
    window.requestAnimationFrame(updateStripes);
}
detectBrowser();
setupStripes();
window.requestAnimationFrame(updateStripes);