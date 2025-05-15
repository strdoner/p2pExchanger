import {AxiosResponse} from "axios";
// @ts-ignore
import $api from "../api/index.ts"
// @ts-ignore
import {OrdersResponse} from "../models/response/OrdersResponse.ts";

export default class UserService {
    static async createPaymentMethod(method: object): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`cards`, method);
    }

    static async getPaymentMethods(bankId): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`cards?bankId=${bankId}`);
    }

    static async deletePaymentMethod(methodId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.delete(`cards/delete/${methodId}`)
    }


}