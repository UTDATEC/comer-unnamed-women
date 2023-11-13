const importAll = (r) => {
    return r.keys().map(r);
}

let r = require.context('../images', false, /.*$/)
let keys = r.keys();
console.log("keys", keys)

const images = importAll(r);
console.log('images', images)

const imageObject = {}
for (let i = 0; i < images.length; i++) {
    imageObject[keys[i]] = images[i]
}

console.log('imageObject', imageObject);

module.exports = imageObject;