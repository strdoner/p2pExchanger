import { AxiosResponse } from "axios";
// @ts-ignore
import $api from "../api/index.ts"
// @ts-ignore
import { OrdersResponse } from "../models/response/OrdersResponse.ts";

export default class UserService {
    static async getOrders(coin:string, method:string, type:string, page:number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`orders?coin=${coin}${method === null ? "" : "&method="+method}${page === 0 ? "" : "&page="+page}&type=${type}`)
    }

    static async getUserOrders(userId:number, status:string, currency:string, type:string, page:number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`users/${userId}/orders?status=${status === null ? "": status}${currency === null ? "": "&currency="+currency}${page === 0 ? "" : "&page="+page}${type === null ? "" : "&type="+type}`)
    }

    static async getUserMinInfo(userId:number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`users/${userId}`)
    }
}