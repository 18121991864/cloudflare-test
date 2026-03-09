import { message } from 'ant-design-vue';
import Compressor from 'compressorjs';
import { FileItem } from '@/interface/StateType';

export default function useUpload(size: number = 10) {
    const beforeUpload = async (file: FileItem): Promise<boolean | File> => {
        // Check if the file type is JPEG or PNG
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
            message.error('请上传jpg、jpeg、png格式文件');
            return false;
        }

        // Check if the file size is less than 10MB
        const isLt10M = file.size / 1024 / 1024 < size;
        if (!isLt10M) {
            message.error(`请上传${size}M以内的图片`);
            return false;
        }

        return new Promise<File>((resolve, reject) => {
            const compressor = new Compressor(file as any, {
                quality: 0.6, // Compress quality to 60%
                success(result: File) {
                    resolve(result);
                },
                error(err: Error) {
                    reject(err);
                }
            });
        });
    };

    return {
        beforeUpload
    };
}
