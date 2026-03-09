export default {
    async fetch(request, env, ctx) {
      const url = new URL(request.url);
  
      // 代理所有以 /api 开头的请求（包括 /api 和 /api/xxx）
      if (url.pathname.startsWith('/api') && (url.pathname === '/api' || url.pathname.startsWith('/api/'))) {
        // 构建目标 URL：去掉 /api 前缀（假设目标 API 不需要 /api 路径）
        const targetPath = url.pathname.replace(/^\/api/, '') || '/'; // 如果只剩空字符串则转为 '/'
        const targetUrl = `http://8.218.199.96:10002${targetPath}${url.search}`;
  
        // 复制请求头，并可选修改 Host
        const newHeaders = new Headers(request.headers);
        // 如果目标服务器需要特定的 Host，取消下一行注释并填写实际域名
        // newHeaders.set('Host', '8.218.199.96:10002');
  
        const newRequest = new Request(targetUrl, {
          method: request.method,
          headers: newHeaders,
          body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
        });
  
        try {
          const response = await fetch(newRequest);
  
          // 创建新响应，并添加 CORS 头
          const newResponse = new Response(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
          });
          newResponse.headers.set('Access-Control-Allow-Origin', '*');
          // 如果前端需要发送 cookies，请使用具体域名并设置 Vary: Origin
          // newResponse.headers.set('Access-Control-Allow-Origin', 'https://你的pages.dev域名');
          // newResponse.headers.set('Vary', 'Origin');
  
          return newResponse;
        } catch (error) {
          return new Response(`代理错误: ${error.message}`, {
            status: 502,
            headers: { 'Access-Control-Allow-Origin': '*' },
          });
        }
      }
  
      // 非 API 请求，正常返回静态文件
      return env.ASSETS.fetch(request);
    }
  };