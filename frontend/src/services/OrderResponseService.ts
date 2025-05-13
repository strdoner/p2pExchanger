import {AxiosResponse} from "axios";
// @ts-ignore
import $api from "../api/index.ts"
// @ts-ignore
import {OrdersResponse} from "../models/response/OrdersResponse.ts";

export default class OrderResponseService {
    static async acceptResponse(orderId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`responses/${orderId}/accept`)
    }

    static async getResponse(responseId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`responses/${responseId}`)
    }

    static async cancelResponse(responseId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.patch(`responses/${responseId}/cancel`)
    }

    static async confirmResponse(responseId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.patch(`responses/${responseId}/confirm`)
    }

    static async completeResponse(responseId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.patch(`responses/${responseId}/complete`)
    }
}