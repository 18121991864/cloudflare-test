import http from '@/servers/index';
import {
    AddOrUpdateCategory,
    CategoryData,
    OrderFlowData,
    OrderFlowParams,
    OrderListData,
    ProductList,
    ProductListData,
    ShopOrderParams,
} from '@/api/shopSort/types.d';
import { Pagination } from '../fetchTest';

abstract class Api {
    protected api: http;

    constructor() {
        const url = String(import.meta.env.VITE_APP_BASE_URL);
        const baseUrl: string = `${url}/shopSort`;
        this.api = new http({
            baseURL: baseUrl,
        });
    }

    // protected abstract verifyParamsSchema<T>(params: object, schema: object): T | null;  // 如果需要中间件拦截(参数验证等服务)，可以使用Joi集成服务
}

class ShopSort extends Api {
    //获取分类列表
    featchGetCategoryList() {
        return this.api.post('/getCategoryList').then((result: any) => result as Required<AddOrUpdateCategory[]>);
    }

    // 新增/修改分类
    featchAddOrUpdateCategory(params: AddOrUpdateCategory) {
        return this.api.post('/addOrUpdateCategory', params);
    }

    // 获取商品分类排序
    featchGetSortCategory(params: { type: boolean }) {
        return this.api.get('/sortCategory', { params }).then((result: any) => result);
    }

    // 删除分类
    featchDeleteCategory(params: { id: number | string }) {
        return this.api.get('/deleteCategory', { params });
    }

    // 获取商品分类列表
    featchGetProductCategoryList(params: ProductList) {
        interface _Response extends Pagination {
            list: CategoryData[];
        }

        return this.api.post('/getShoppingCategoryList', params).then((result: any) => result as _Response);
    }

    // 修改商品排序
    featchupdateProductSort(params: { id: string; sort: number | undefined }) {
        return this.api.get('/updateProductSort', { params }).then((result: any) => result);
    }

    // 删除商品与分类的关联
    featchdeleteProRelationCategory(params: { categoryId: string; productId: string }) {
        return this.api.get('/deleteProRelationCategory', { params }).then((result: any) => result);
    }

    // 获取订单列表
    featchGetShopOrderList(params: ShopOrderParams) {
        interface _Response extends Pagination {
            list: OrderListData[];
        }

        return this.api.post('/getShopOrderList', params).then((result: any) => result as _Response);
    }

    // 获取商品列表
    featchGetShopProductList(params: ProductList) {
        interface _Response extends Pagination {
            list: ProductListData[];
        }

        return this.api.post('/getShopProductList', params).then((result: any) => result as _Response);
    }

    // 上/下架商品
    featchUnmountProduct(params: { id: string }) {
        return this.api.get('/unmountProduct', { params }).then((result: any) => result);
    }

    // 设置产品上浮比例
    featchSetProductFloat(params: { id: string; floatingRate: string; url: string }) {
        return this.api.get('/setProductFloat', { params }).then((result: any) => result);
    }

    // 产品新增分类
    featchAddProductCategory(params: { categoryId: string; productId: string }) {
        return this.api.get('/addProductCategory', { params }).then((result: any) => result);
    }

    // 更新商品
    featchPullProduct() {
        return this.api.post('/pullProduct').then((result: any) => result);
    }

    // 获取商城消费流水列表
    featchGetShopOrderFlow(params: OrderFlowParams) {
        interface _Response extends Pagination {
            list: OrderFlowData[];
        }

        return this.api.get('/getShopOrderFlow', { params }).then((result: any) => result as _Response);
    }
}

export default new ShopSort();
