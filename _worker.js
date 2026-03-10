// _worker.js
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        // 将 /api/ 开头的请求转发到目标服务器
        if (url.pathname.startsWith('/api/')) {
            // 替换为你的真实 API 地址
            const targetUrl = 'http://8.218.199.96:10002/' + url.pathname + url.search;
            // 创建新请求，保留原方法、头部和 body
            const newRequest = new Request(targetUrl, {
                method: request.method,
                headers: request.headers,
                body: request.body,
            });
            // 发送请求并返回响应
            return fetch(newRequest);
        }
        // 非 API 请求，正常返回静态文件（由 Pages 处理）
        return env.ASSETS.fetch(request);
    },
};
