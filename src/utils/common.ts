import { TreeDataType } from '@/interface/StateType';
import { groupBy } from 'lodash-es';
import dayjs from 'dayjs';
import cookies from 'cookies-js';
import xss from 'xss';
import { Ref } from 'vue';
import { message } from 'ant-design-vue';
import { timeStampToDate } from '@/filters/dateFormat';
import { SIX_NUMBER } from './constant';
import useTimezoneStore from '@/store/timezone';

type FormattedData = {
    id: string;
    children: string[];
};

export const formatDataArr = (arr: string[][]): FormattedData[] =>
    arr.reduce<FormattedData[]>((acc, [parentId, childId]) => {
        let item = acc.find((entry) => entry.id === parentId);

        if (!item) {
            item = { id: parentId, children: [] };
            acc.push(item);
        }

        if (childId) item.children.push(childId);

        return acc;
    }, []);

export function dataURLtoBlob(dataurl: string): Blob {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bStr = atob(arr[1]);
    let n = bStr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bStr.charCodeAt(n);
    }

    return new Blob([u8arr], { type: mime });
}

export const buildArrTree = (items: TreeDataType[], parentId: string): TreeDataType[] => {
    const groupedItems = groupBy(items, 'parentId');
    const children = groupedItems[parentId] || [];
    return children.map((child: TreeDataType) => {
        const grandchildren = buildArrTree(items, child.menuId);
        if (grandchildren && grandchildren.length) {
            child.children = grandchildren;
        }
        return child;
    });
};

export function hideMiddleText(input: string): string {
    if (!input) return '';
    const len = input.length;
    if (len <= 12) return input; // 如果字符串长度小于等于12，则不需要隐藏中间部分

    const leftPart = input.substring(0, 6);
    const rightPart = input.substring(len - 6);
    const hiddenText = '...';

    return leftPart + hiddenText + rightPart;
}

export function handleDownFile(val: Blob, name: string) {
    const a = document.createElement('a');
    a.href = window.URL.createObjectURL(val);
    a.download = `${String(name)}.zip`; // 设置下载时的文件名
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// 定义一个方法来转换图片为 Base64
export async function convertImageToBase64(imageSrc: string): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = imageSrc;
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.drawImage(img, 0, 0);
                const base64String = canvas.toDataURL('image/png');
                resolve(base64String);
            } else {
                reject(new Error('Failed to get canvas context'));
            }
        };
        img.onerror = (error) => {
            reject(error);
        };
    });
}

export function deepCopy<T = object>(obj: any, cache: { original: T; copy: T }[] = []): T {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj;
    }

    // if obj is hit, it is in circular structure
    type HitType = { original: T; copy: T };
    const hit: HitType | undefined = cache.find((value: any) => value?.original === obj);
    if (hit) {
        return hit?.copy;
    }

    const copy: T | any = Array.isArray(obj) ? [] : {};
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy,
    });

    Object.keys(obj).forEach((key: any) => {
        copy[key] = deepCopy<T>(obj[key], cache);
    });

    return copy;
}

export function addEventListener( // 原生事件监听
    el: Element | Window,
    event: keyof HTMLElementEventMap | string, // string
    handler: EventListenerOrEventListenerObject, // EventListener
    options?: EventListenerOptions
): void {
    if ('addEventListener' in Element.prototype) {
        // 所有主流浏览器，除了 IE 8 及更早 IE版本
        el.addEventListener(event, handler, options);
        return;
    }

    if ('attachEvent' in Element.prototype) {
        // IE 8 及更早 IE 版本
        // @ts-ignore
        el.attachEvent(`on${type}`, method, options?.capture);
    }
}

export function removeEventListener( // 原生事件移除监听
    el: Element | Window,
    event: keyof HTMLElementEventMap | string, // string
    handler: EventListenerOrEventListenerObject, // EventListener
    options?: EventListenerOptions
): void {
    if ('removeEventListener' in Element.prototype) {
        // 所有浏览器，除了 IE 8 及更早IE版本
        el.removeEventListener(event, handler, options);
        return;
    }

    if ('detachEvent' in Element.prototype) {
        // IE 8 及更早IE版本
        // @ts-ignore
        el.detachEvent(`on${type}`, method, options?.capture);
    }
}

export const isPromise = (val: Promise<any>): boolean => val && typeof val.then === 'function';

export function randomString(len: number = 32): string {
    // 随机字符串32
    const $chars: string = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos: number = $chars.length;
    /** **默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1*** */
    return new Array(len).fill(undefined).reduce<string>((acc, cur) => acc + $chars.charAt(Math.floor(Math.random() * maxPos)), '');
}

export function urlEncode(clearString: string): string {
    // url编码
    const regex: RegExp = /(^[a-zA-Z0-9-_.]*)/;
    const newClearString: string = String(clearString);
    let output: string = '',
        x: number = 0;
    while (x < newClearString.length) {
        const match: RegExpExecArray | null = regex.exec(newClearString.substr(x));
        if (match !== null && match.length > 1 && !!match[1].length) {
            output += match[1];
            x += match[1].length;
        } else {
            if (!newClearString.substr(x, 1).length) output += '+'; // ie不支持把字符串当作数组来访问
            else {
                const charCode: number = newClearString.charCodeAt(x);
                const hexVal: string = charCode.toString(16);
                output += `%${hexVal.length < 2 ? '0' : ''}${hexVal.toUpperCase()}`;
            }
            x += 1;
        }
    }
    return output;
}

export function typeOf(obj: any): string {
    // 精准判断数据类型
    const _obj: {
        [typeName: string]: string;
    } = {
        '[object Boolean]': 'boolean',
        '[object Number]': 'number',
        '[object String]': 'string',
        '[object Function]': 'function',
        '[object Array]': 'array',
        '[object Date]': 'date',
        '[object RegExp]': 'regExp',
        '[object Undefined]': 'undefined',
        '[object Null]': 'null',
        '[object Object]': 'object',
        '[object Document]': 'document',
        '[object HTMLDivElement]': 'div',
        '[object HTMLBodyElement]': 'body',
        '[object HTMLDocument]': 'document',
        '[object HTMLHtmlElement]': 'html',
        '[object Blob]': 'blob',
        '[object FormData]': 'formData',
    };
    return _obj[Object.prototype.toString.call(obj)];
}

export function toCapital(n: number | string): string {
    // 将数字转为大写
    const cNum: string[] = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十'];
    const s: string = cNum.reduce((acc, cur, index, arr) => acc + arr[window.parseInt(n.toString().charAt(Number(cur)), 10)], '');

    if (s.length !== 2) return s; // 非两位数的时候

    if (s.charAt(1) === cNum[0]) {
        // 如果个位数是0的时候，令改成十
        return s === cNum[1] + cNum[10] /* 如果是一十改成十 */ ? cNum[10] : s.charAt(0) + cNum[10];
    }

    if (s.charAt(0) === cNum[1]) return cNum[10] + s.charAt(1);

    return '';
}

export function hyphenate(str: string): string {
    // 驼峰转短横线命名
    const hyphenateRE: RegExp = /([^-])([A-Z])/g;
    return str.replace(hyphenateRE, '$1-$2').replace(hyphenateRE, '$1-$2').toLowerCase();
}

export function sliceLength(arr: any[], startIndex: number, length: number): any[] {
    // 切割数组，根据长度切割
    return arr.slice(startIndex, startIndex + length);
}

export function buildFlat<T extends object>( // 树状数据转扁平数据（类似Array.flat, 但支持子集），递归汇总提取key最底层相关的数据，支持上层直接忽略
    array: { [name in string]: any }[], // 需要处理的数组
    key = 'children', // 包含子数据的key
    isOnlyBottom = false, // 是否只获取最底层的数据
    callback?: (cur: T, next: T[]) => T[] // 自定义处理数据回调函数，如果需要在每层的筛选时向下传递某些字段会非常有用，返回一个新的数据结构
): { [name in string]: any }[] | T[] {
    const hasCallback: boolean = typeof callback === 'function';

    return (
        array
            // .filter((item: {[key in (typeof key | string)]: any}): boolean => !!item[key]) // 筛选数组
            .map((item: { [key in typeof key | string]: any }): T => {
                if (typeof item?.[key] !== 'undefined') {
                    const newItem = JSON.parse(JSON.stringify(item)) as { [key in typeof key | string]: any } & T;
                    delete newItem[key];

                    const nextValues = buildFlat(
                        hasCallback
                            ? (callback as Function)(newItem, <T[]>item[key]) // 返回的数据结会成为新的item[key]移交给地下一次递归处理
                            : <T[]>item[key],
                        key,
                        isOnlyBottom,
                        callback
                    );
                    return <T>(isOnlyBottom ? nextValues : nextValues.concat(newItem));
                }

                return <T>item;
            }) // 返回key下面的树
            .flat()
    );
}

function buildTree<T extends object>( // 扁平数组转树状结构
    array: T[],
    childrenKey: string = 'children', // 数据项的子集属性名称
    key: string = 'id', // 数据项的主键属性名称
    parentKey: string = 'parentId' // 数据项的父级主键属性名称
): T[] {
    type ArrayItem = {
        [name in typeof key | typeof parentKey | typeof childrenKey]: string | any[];
    };

    type ArrayItemExtend = T & ArrayItem;

    const newArray: T[] = [];
    const tree = array.reduce((acc: { [name in keyof ArrayItemExtend]: any }, cur: T) => {
        // 数组转换后的对象
        const currentValue = cur as T & ArrayItemExtend;
        return {
            ...acc,
            [currentValue[key as keyof ArrayItem] as string]: cur,
        };
    }, Object.create(null)) as { [name in typeof key | typeof parentKey]: ArrayItemExtend };

    (Object.values(tree) as T[]).forEach((item) => {
        const _parentValue = (item as ArrayItemExtend)[parentKey as keyof ArrayItem]; // 父级对象的值
        if (_parentValue) {
            // 插入children数组
            if (typeof tree[_parentValue as keyof ArrayItemExtend as string][childrenKey] === 'undefined')
                (tree[_parentValue as keyof ArrayItemExtend as string][childrenKey] as T[]) = [];
            (tree[_parentValue as keyof ArrayItemExtend as string][childrenKey] as T[]).push(item);
            return;
        }

        newArray.push(item); // 放进新的数组中
    });

    return newArray;
}

export function makeFilterItemKey<T extends object>( // 筛选key，剔除不必要的数组项其它属性（同时支持数据映射）
    array: { [name in string]: any }[], // 需要处理的数组
    key: string = 'children', // 包含子数据的key
    filters: { [key in string]?: string }, // 需要筛选的数组项key映射, 该对象的key为当前数组的属性, value为要变更的属性名(为undefined仅筛选不变更，映射生成多个key可以使用逗号分隔)
    callback?: (key: string, value: any, item?: (typeof array)[number]) => any // 自定义处理数据回调函数，可以修正原始数据的value
): { [name in keyof typeof filters | typeof key]: any }[] | T[] {
    return array.map((item) => {
        const newItem = Object.entries(filters).reduce(
            (acc, [_key, _value]) => ({
                ...acc,
                ...(_value ?? _key) // 映射或过滤的key
                    .split(',') // 支持映射多个key
                    .reduce(
                        (shines, __key: string) => ({
                            ...shines,
                            [__key]: typeof callback === 'undefined' ? item[_key] : callback(__key, item[_key], item),
                        }),
                        Object.create(null)
                    ),
            }),
            Object.create(null)
        ) as { [name in keyof typeof filters]: any };

        if (typeOf(item[key]) !== 'array') return newItem;
        return {
            ...newItem,
            [key]: makeFilterItemKey(item[key], key, filters, callback),
        };
    });
}

export function recursionFind<T extends object>( // 同Array.find方法，支持递归回调查询
    array: T[], // 需要处理的数组
    key: string = 'children', // 包含子数据的key
    callback: (value: T, index: number, obj: T[]) => boolean, // Array.find回调函数
    hasChildren: boolean = false // 找到的数据是否包含子集
): T | undefined {
    // 数组递归查找
    if (!hasChildren) return (buildFlat<T>(array, key, false) as T[]).find(callback);

    // eslint-disable-next-line no-restricted-syntax
    for (const [
        index,

        item,
        // @ts-ignore
    ] of array.entries()) {
        if (callback(item as T, index as number, array as T[])) return item; // 已查找到

        const children = (item as { [name: string]: T[] })?.[key] as T[];

        if (typeOf(children) === 'array') {
            // 确保可循环
            const targetData = recursionFind(children, key, callback, hasChildren); // 找到子集内包含就返回
            if (targetData) return targetData; // 子集未包含继续循环查找
        }
    }
}

export function makeFilterUnique<T extends { [key: string]: any }>( // 数组去重,支持递归去重
    array: T[], // 需要处理的数组
    filterKey: string, // 筛选的key
    key: string = 'children' // 包含子数据的key
): T[] {
    return Object.values(
        (buildFlat<T>(array, key, false) as T[]).reduce((acc, cur) => Object.assign(acc, { [cur[filterKey]]: cur }), Object.create(null))
    );
}

export function numberSeparation(num: number, separator = ','): string {
    // 数字千位分隔符
    const strNumber: string = String(num);

    return typeof num !== 'undefined' ? strNumber.replace(/\d+/, (s: string) => s.replace(/(\d)(?=(\d{3})+$)/gim, `$1${separator}`)) : strNumber;
}

export function debounceFunc(fn: (...arg: any[]) => any, time: number = 500): ReturnType<any> {
    // 防抖
    let timeout: ReturnType<typeof setTimeout>; // 创建一个标记用来存放定时器的返回值
    return (...arg: any[]): void => {
        clearTimeout(timeout); // 每当用户输入的时候把前一个 setTimeout clear 掉
        timeout = setTimeout(() => {
            // 然后又创建一个新的 setTimeout, 这样就能保证输入字符后的 interval 间隔内如果还有字符输入的话，就不会执行 fn 函数
            // @ts-ignore
            fn(...arg);
        }, time /* 防抖间隔时间 */);
    };
}

export function throttleFunc(fn: (...arg: any[]) => any, time: number = 500): ReturnType<any> {
    // 截流
    let canRun: boolean = true; // 通过闭包保存一个标记
    return (...arg: any[]): void => {
        if (!canRun) return; // 在函数开头判断标记是否为true，不为true则return
        canRun = false; // 立即设置为false
        setTimeout(() => {
            // 将外部传入的函数的执行放在setTimeout中
            // @ts-ignore
            fn(...arg); // 最后在setTimeout执行完毕后再把标记设置为true(关键)表示可以执行下一次循环了。当定时器没有执行的时候标记永远是false，在开头被return掉
            canRun = true;
        }, time /* 截流间距时间 */);
    };
}

export function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
}

export function downloadExcel(data: Blob, name: string) {
    // 导出数据
    const toDayCom = dayjs().format('YYYY-MM-DD HH:mm:ss');
    const url = window.URL.createObjectURL(new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.style.display = 'none';
    link.href = url;
    link.setAttribute('download', `${name}${toDayCom}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export function getToken() {
    const timeStore = useTimezoneStore();
    const timezone = cookies.get('timezone');
    if (!timezone) {
        cookies.set('timezone', '+UTC+0');
        timeStore.setTimezone('+UTC+0');
    } else {
        const item = timeStore.selectTimeOptions.find((item) => item.code === timezone);
        cookies.set('timezone', item?.code || '+UTC+0');
        timeStore.setTimezone(item?.value || 'UTC');
    }
    return {
        Token: cookies.get('walletToken') || '',
        'Time-Zone': cookies.get('timezone'),
    };
}

export function filterXss(val: string) {
    const firstVal = String(val).split('<head>').shift();
    const lastVal = String(val).split('<head>').pop();
    const currVal = val?.includes('name="viewport"')
        ? val
        : `${firstVal} <meta name="viewport" content="width=device-width,initial-scale=1.0"> <style>html{max-width: 100%;overflow-x: hidden;overflow-y: auto}img{max-width: 100%; height: auto}</style> ${lastVal}`;

    const options = {
        css: false,
        whiteList: {
            // @ts-ignore
            ...xss.whiteList,
            a: ['style', 'href', 'title', 'target'],
            img: ['src', 'style'],
            body: ['style', 'class'],
            div: ['style', 'class'],
            head: [],
            html: ['!DOCTYPE'],
            meta: ['name', 'content'],
            style: [],
            '!doctype': ['html'],
        },
    };
    // @ts-ignore
    const currXss = new xss.FilterXSS(options);
    return currXss.process(currVal);
}

export const filterInventoryList = (types: Ref<any[]>) => {
    const typeList = new Set<any>();
    const typeArray: Array<number | string> = [];
    const typesArray: Array<number | string> = [];
    const filterTypes = (data: number[] | string[]) => {
        data.forEach((item) => {
            if (Array.isArray(item)) {
                filterTypes(item);
            } else {
                typeList.add(item);
            }
        });
    };
    filterTypes(types.value);
    let fitster = '';
    typeList.forEach((item) => typeArray.push(item));
    typeArray.forEach((item, index) => {
        if (typeof item === 'string') {
            fitster = item;
        }
        if (typeof item === 'number' && fitster.includes(item + '')) {
            typesArray.push(item);
        } else {
            if (!fitster.includes(typeArray[index + 1] as string)) {
                typesArray.push(item);
            }
        }
    });
    return typesArray.join(',') as any;
};

export const copyText = (text: string, isTips: boolean = false) => {
    const input = document.createElement('input');
    input.value = text;
    document.body.appendChild(input);
    input.select();
    const res = document.execCommand('copy');
    document.body.removeChild(input);
    if (isTips) {
        message.success({ content: '复制成功' });
    }
    return res;
};
export const isNumber = (value: any) => {
    return !isNaN(value);
};

export const formatDateRange = (range: string[], formatTime = true) =>
    range
        ? [timeStampToDate(range[0]), timeStampToDate(range[1] ? (!formatTime ? range[1] : dayjs(range[1]).endOf('day').toString()) : '')]
        : ['', ''];

export const formatDateRangeByNum = (range: string[], formatTime = true) =>
    range
        ? [
              range[0] ? dayjs(range[0]).valueOf() : '',
              range[1] ? (!formatTime ? dayjs(range[1]).valueOf() : dayjs(range[1]).endOf('day').valueOf()) : '',
          ]
        : ['', ''];
export const handlePaste = async (): Promise<string[] | []> => {
    // 读取浏览器粘贴板数据
    if (!window.navigator.clipboard) {
        message.warn('该浏览器不支持粘贴功能或需要进行授权操作'); //
        throw new Error('该浏览器不支持粘贴功能]'); //
    }

    try {
        const text = await window.navigator.clipboard.readText();
        if (!SIX_NUMBER.test(text)) return message.warn('请粘贴6位数字'); // 请粘贴6位数字
        if (text.length === 6) return text.split('');
    } catch (error) {
        console.log(error);
    }
    return [];
};

export const downloadUrl = (url: string, name: string) => {
    const link = document.createElement('a');
    const toDayCom = dayjs().format('YYYY-MM-DD HH:mm:ss');
    link.href = url;
    link.setAttribute('download', `${name}${toDayCom}.xlsx`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};
