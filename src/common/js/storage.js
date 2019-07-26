export function setLocalStorage(key, value) {
    localStorage.setItem(key, value);
}
export function getLocalStorage(key) {
    let result = localStorage.getItem(key) === null ? '' : localStorage.getItem(key);
    return result;
}
export function storageAvatar(icon, packgaeName, filename) {
    let avatarObject = getLocalStorage('icon');
    if (avatarObject === '') {
        avatarObject = {};
        avatarObject[`_downloads/${filename}`] = {};
        avatarObject[`_downloads/${filename}`].icon = icon;
        avatarObject[`_downloads/${filename}`].pk_n = packgaeName;
        setLocalStorage('icon', JSON.stringify(avatarObject));
    } else {
        let avatar = JSON.parse(avatarObject);
        avatar[`_downloads/${filename}`] = {};
        avatar[`_downloads/${filename}`].icon = icon;
        avatar[`_downloads/${filename}`].pk_n = packgaeName;
        setLocalStorage('icon', JSON.stringify(avatar));
    }
}
export function storageId(id, filename) {
    let idObject = getLocalStorage('gameID');
    if (idObject === '') {
        idObject = {};
        idObject[`_downloads/${filename}`] = {};
        idObject[`_downloads/${filename}`].id = id;
        setLocalStorage('gameID', JSON.stringify(idObject));
    } else {
        let gameID = JSON.parse(idObject);
        gameID[`_downloads/${filename}`] = {};
        gameID[`_downloads/${filename}`].id = id;
        setLocalStorage('gameID', JSON.stringify(gameID));
    }
}
// 存储用户ID对应的包名 还有头像
export function storageDownTask(url, icon, packgaeName, name, size) {
    let avatarObject = getLocalStorage('downtask');
    if (avatarObject === '') {
        avatarObject = {};
        avatarObject[url] = {};
        avatarObject[url].icon = icon;
        avatarObject[url].pk_n = packgaeName;
        avatarObject[url].name = name;
        avatarObject[url].size = size;
        setLocalStorage('downtask', JSON.stringify(avatarObject));
    } else {
        let avatar = JSON.parse(avatarObject);
        avatar[url] = {};
        avatar[url].icon = icon;
        avatar[url].pk_n = packgaeName;
        avatar[url].name = name;
        avatar[url].size = size;
        setLocalStorage('downtask', JSON.stringify(avatar));
    }
}
