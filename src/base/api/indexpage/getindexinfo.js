import axios from 'axios';
import { host } from '../config';

export function getIndexInfo() {
    const url = host + '/appIndex';
    return new Promise((resolve, reject) => {
        axios.get(url).then((res) => {
            const flag = true;
            res.flag = flag;
            return resolve(res.data);
        }).catch((error) => {
            reject(error);
        });
    });
}
export function getCommonInfo(address) {
    const url = host + address;
    return axios.get(url).then((res) => {
        const flag = true;
        res.flag = flag;
        return Promise.resolve(res.data);
    });
}
export function getCommonInfoHasData(address, data) {
    const url = host + address;
    return axios.get(url, {
        params: data,
    }).then((res) => {
        const flag = true;
        res.flag = flag;
        return Promise.resolve(res.data);
    });
}
export function postInfo(address, data) {
    const url = host + address;
    return axios.post(url, data).then((res) => {
        const flag = true;
        res.flag = flag;
        return Promise.resolve(res.data);
    });
}
export function putInfo(address, data) {
    const url = host + address;
    return axios.put(url, data).then((res) => {
        const flag = true;
        res.flag = flag;
        return Promise.resolve(res.data);
    });
}

