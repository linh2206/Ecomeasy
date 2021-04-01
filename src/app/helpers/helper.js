import XLSX from "xlsx"
import { ORDER_STATUS } from "../constant/orderStatus"
import _ from "lodash"
import { ROLES } from "../constant/role"

export function parseLocaleString(num, isPrice) {
    return Number(num) ? `${isPrice ? 'đ' : ''} ${Number(num).toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 0
}

export function isValidEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

export function popupWindow(url, title, win, w, h) {
    const y = win.top.outerHeight / 2 + win.top.screenY - (h / 2);
    const x = win.top.outerWidth / 2 + win.top.screenX - (w / 2);
    return win.open(url, title, `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${w}, height=${h}, top=${y}, left=${x}`);
}

export function getCroppedImg(image, crop, fileName) {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(blob => {
            if (!blob) {
                //reject(new Error('Canvas is empty'));
                console.error('Canvas is empty');
                return;
            }
            blob.name = fileName;
            resolve({
                file: blob,
                url: window.URL.createObjectURL(blob)
            });
        }, 'image/jpeg');
    });
}

export function readExcelFile(file, sheet) {
    var reader = new FileReader();
    var result = {};
    return new Promise((resolve, reject) => {
        try {
            reader.onload = function (e) {
                var data = e.target.result;
                data = new Uint8Array(data);
                var workbook = XLSX.read(data, { type: 'array' });
                var result = {};
                workbook.SheetNames.forEach(function (sheetName) {
                    var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {
                        header: 1,
                        raw: false
                    });
                    if (roa.length) result[sheetName] = roa;
                });
                resolve(result[sheet])
            };

            if (file) {
                reader.readAsArrayBuffer(file);
            }
            else {
                resolve([])
            }
        }
        catch (err) {
            reject(err)
        }

    })

}

export function getFileExtension(file) {
    return file && file.split('.')[1];
}

export const randomColor = () => '#' + (Math.random() * 0xFFFFFF << 0).toString(16).padStart(6, '0');

export const groupOrderStatus = (status, filter) => {

    const baseConfig = {
        Canceled: {
            code: 'CANCELLED'
        },
        Done: {
            code: 'COMPLETED'
        },
        Shipping: {
            code: 'SHIPPING'
        }
    }

    let data = {
        COMPLETED: 0,
        SHIPPING: 0,
        CANCELLED: 0,
    }

    let amount = {
        COMPLETED: 0,
        SHIPPING: 0,
        CANCELLED: 0,
    }

    let orderCount = 0

    if (Object.keys(status).length > 0) {
        Object.keys(status).forEach(function (key) {
            if (!ORDER_STATUS[key]) {
                ORDER_STATUS[key] = baseConfig
            }
            if (status[key] && status[key].length > 0) {
                status[key].forEach(item => {
                    if (filter === key || filter === 'all') {
                        orderCount += item.count
                    }
                    const id = typeof (item._id) === 'object' ? item._id[0] : item._id
                    if (ORDER_STATUS[key] &&
                        ORDER_STATUS[key][id]
                        && (filter === key || filter === 'all')) {
                        data[ORDER_STATUS[key][id].code] += item.count
                        if (Number(item.totalAmount)) {
                            amount[ORDER_STATUS[key][id].code] += item.totalAmount
                        }
                    }
                })
            }
        });
    }
    else {
        data = {
            COMPLETED: '-',
            SHIPPING: '-',
            CANCELLED: '-',
        }
    }
    return { data, amount, orderCount }
}

export function calucateGrowthRate(oldRevenue, revenue) {
    revenue = Number(revenue)
    oldRevenue = Number(oldRevenue)
    const percentageChange = (Math.abs(revenue - oldRevenue) / oldRevenue) * 100
    const isInvariant = revenue === oldRevenue || oldRevenue === 0
    const isIncrease = revenue > oldRevenue
    return { percentageChange, isInvariant, isIncrease }
}

export const isAuthenticated = (userPermission, targetPermission) => {
    const mergedPermissions = [...userPermission || [], ...targetPermission || []]
    return (userPermission && userPermission.length === 0) || (targetPermission && targetPermission.length === 0)
        || new Set(mergedPermissions).size < mergedPermissions.length
}

export const getSendoOrderLabel = code => {
    switch (code) {
        case 2:
            return "Mới"
            break;
        case 3:
            return "Đang xử lý"
            break;
        case 6:
            return "Đang vận chuyển"
            break;
        case 7:
            return "Đã giao hàng"
            break;
        case 8:
            return "Đã hoàn tất"
            break;
        case 10:
            return "Đóng"
            break;
        case 11:
            return "Yêu cầu hoãn"
            break;
        case 12:
            return "Đang hoãn"
            break;
        case 13:
            return "Hủy"
            break;
        case 14:
            return "Yêu cầu tách"
            break;
        case 15:
            return "Chờ tách"
            break;
        case 19:
            return "Chờ gộp"
            break;
        case 23:
            return "Chờ sendo xử lý"
            break;
        case 21:
            return "Đang đổi trả"
            break;
        case 22:
            return "Đổi trả thành công"
        default:
            return code
    }
}
