export interface CustomRequestType {
  onProgress: (event: { percent: number }) => void;
  onError: (event: Error, body?: Object) => void;
  onSuccess: (body: Object) => void;
  data: Object;
  filename: String;
  file: File;
  withCredentials: Boolean;
  action: String;
  headers: Object;
}

export interface FileList {
  uid: string; // 文件唯一标识，建议设置为负数，防止和内部产生的 id 冲突
  name: string; // 文件名
  status: 'uploading' | 'done' | 'error' | 'removed'; // 状态有：
  response: any; // 服务端响应内容
  linkProps: any; // 下载链接额外的 HTML 属性
  xhr: any; // XMLHttpRequest Header
}
