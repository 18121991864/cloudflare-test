const matchFileName = (filePath: string) => {
    return /.*\/index(-[a-zA-Z0-9_]+)?\.js$/.test(filePath);
};

// 获取本地
const getLocalHash = () => {
    const script = document.querySelector('script') as HTMLScriptElement;
    let localVersion = '';
    if (script && script.src && matchFileName(script.src)) {
        localVersion = new URL(script.src).pathname;

        return localVersion;
    }

    return '';
};

// 获取线上的app.js版本号
const checkHash = (): Promise<string> => {
    return new Promise(async (resolve, reject) => {
        const regex = /src="([^"]+)"/;
        // 加上时间戳，防止缓存
        const data = await fetch('/?_time=' + Date.now());
        const htmls = await data.text();
        const match = htmls.match(regex);
        if (match && match.length) {
            return resolve(match[1]);
        }
        return resolve('');
    });
};

export const startCheckVesion = () => {
    // 定时执行，自动更新逻辑(每10分钟检测一次)
    const currentTime = setInterval(async () => {
        let localVersion = getLocalHash();
        let newVersion = await checkHash();
        if (!newVersion || !localVersion) {
            clearInterval(currentTime);
            startCheckVesion();
            return;
        }

        // 如果不一样，就进行刷新
        if (localVersion != newVersion) {
            clearInterval(currentTime);
            localStorage.setItem('version', Date.now().toString());
            warringTips(
                {
                    title: '提示',
                    content: '发现新版本，请刷新页面获取最新功能！',
                    okText: '立即更新',
                    cancelText: '稍后更新',
                    changeStateApi: () => {
                        return new Promise((resolve) => {
                            window.location.reload();
                            resolve(true);
                        });
                    },
                    onClose() {
                        startCheckVesion();
                    },
                    sucessTips: '更新成功',
                },
                {}
            );
        }
    }, 1000 * 60 * 10);
};
