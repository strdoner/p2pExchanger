import { AxiosResponse } from "axios";
import $api from "../api/index.ts"
import { OrdersResponse } from "../models/response/OrdersResponse.ts";

export default class UserService {
    static async getOrders(coin:string, method:string, page:number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get('orders', {
            params: {
                coin:coin,
                method:method,
                page:page
            }
        })
        .then(response => response)
    }
}