import {AxiosResponse} from "axios";
// @ts-ignore
import $api from "../api/index.ts"
// @ts-ignore
import {OrdersResponse} from "../models/response/OrdersResponse.ts";

export default class UserService {
    static async createPaymentMethod(method: object): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`cards`, method);
    }
    static async getPaymentMethods(): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get('cards');
    }



}