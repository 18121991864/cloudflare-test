// functions/api/[[path]].ts

export async function onRequest(context) {
    // 1. 从上下文中获取请求对象
    const { request } = context;

    // 2. 获取请求的路径和查询参数
    const url = new URL(request.url);
    const apiPath = url.pathname.replace(/^\/api/, ''); // 移除开头的 /api
    const queryString = url.search; // 保留查询参数，如 ?name=value

    // 3. 构建目标后端服务器的完整 URL
    // 注意：请将下方的 IP 和端口替换为你自己的
    const targetUrl = `http://8.218.199.96:10002/api${apiPath}${queryString}`;

    // 4. 创建一个新的请求对象，转发到目标服务器
    //    需要转发原始请求的方法、请求头和 body（如果有的话）
    const proxyRequest = new Request(targetUrl, {
        method: request.method,
        headers: request.headers,
        // 如果是 POST/PUT 等方法，需要转发 body
        body: request.body,
        // 为了安全，可以删除一些不希望转发的 headers，比如 'host'，浏览器会自动处理
    });

    try {
        // 5. 发送代理请求到后端服务器
        const response = await fetch(proxyRequest);
        const newHeaders = new Headers(response.headers);
        newHeaders.set('Access-Control-Allow-Origin', '*'); // 或者你的前端域名

        // 6. 将后端的响应返回给前端
        //    可以在这里修改响应头，例如添加 CORS 头
        return new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: newHeaders,
        });
    } catch (error) {
        // 7. 错误处理：如果后端服务器无法访问
        return new Response(`Proxy Error: ${error.message}`, { status: 502 });
    }
}