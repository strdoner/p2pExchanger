import { AxiosResponse } from "axios";
// @ts-ignore
import $api from "../api/index.ts"
// @ts-ignore
import { OrdersResponse } from "../models/response/OrdersResponse.ts";

export default class UserService {
    static async getOrders(coin:string, method:string, page:number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`orders?coin=${coin}&${method === "Все методы" ? "" : "method="+method}&${page === 0 ? "" : "page="+page}`)
        .then(response => response)
    }
}