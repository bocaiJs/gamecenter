import { storageAvatar } from './storage';

/*
** url :后台获取的android地址;
 * icon:游戏的图标
 * packgaeName：打开游戏时的包名 例如 com.yxorange
*/
export function addDownLoadTask(url, icon, packgaeName) {
    let address = url.split('/');
    let filename = address[address.length - 1];
    storageAvatar(icon, packgaeName, filename);
    plus.io.resolveLocalFileSystemURL(
        `_downloads/${filename}`,
        (entry) => {
            if (entry.isFile) {
                plus.nativeUI.alert('任务已在列表中，请勿重复下载!', () => {
                    console.log('User pressed!');
                }, '友情提示', '确定');
            }
        },
        (e) => {
            console.log(e);
            console.log('添加下载任务');
            let downTask = plus.downloader.createDownload(
                url,
                { method: 'GET' },
                //  下载完成执行的回调函数
                (d, status) => {
                    console.log('下载完成了 小伙子');
                    console.log(localStorage.getItem('autoInstall'));
                    console.log(d);
                    console.log(status);
                    if (localStorage.getItem('autoInstall')) {
                        plus.runtime.install(d.filename, {}, () => {
                            d.isinstall = true;
                            console.log('设置完成了 小伙子');
                            console.log(d.isinstall);
                        }, () => {
                            d.isinstall = false;
                        });
                    }
                },
            );
            console.log(downTask);
            downTask.start();
        },
    );
}
export function getLocalStorage(key) {
    let result = localStorage.getItem(key) === null ? '' : localStorage.getItem(key);
    return result;
}
export function getFileName(url) {
    let address = url.split('/');
    let filename = address[address.length - 1];
    return filename;
}
export function checkTaskIsExist(filename, successCB, errorCB) {
    plus.io.resolveLocalFileSystemURL(
        `_downloads/${filename}`,
        (entry) => {
            if (entry.isFile) {
                successCB();
            }
        },
        () => {
            errorCB();
        },
    );
}
export function openGame(url, name) {
    // name:包名  判断该应用是否安装
    if (plus.runtime.isApplicationExist({ pname: name })) {
        //  安装=>启动应用
        if (plus.os.name === 'Android') {
            plus.runtime.launchApplication({
                pname: name,
            }, () => {
                console.log('打开失败');
            });
        }
    } else {
        let pName = getFileName(url);
        let fName = `_downloads/${pName}`;
        //  未安装=>安装应用
        plus.runtime.install(fName, {}, () => {
            console.log('安装成功');
        }, () => {
            console.log('安装失败');
        });
    }
}
export function checkApp(name) {
    if (plus.runtime.isApplicationExist({ pname: name })) {
        console.log('应用已经安装');
        return true;
    } else {
        console.log('没有安装');
        return false;
    }
}

