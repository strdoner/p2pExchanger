import {AxiosResponse} from "axios";
// @ts-ignore
import $api from "../api/index.ts"
// @ts-ignore
import {OrdersResponse} from "../models/response/OrdersResponse.ts";

export default class UserService {
    static async getOrders(coin: string, method: string, type: string, page: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`orders?coin=${coin}${method === null ? "" : "&method=" + method}${page === 0 ? "" : "&page=" + page}&type=${type}`)
    }

    static async getUserOrders(userId: number, status: string, currency: string, type: string, page: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`users/${userId}/orders?status=${status === null ? "" : status}${currency === null ? "" : "&currency=" + currency}${page === 0 ? "" : "&page=" + page}${type === null ? "" : "&type=" + type}`)
    }

    static async getUserMinInfo(userId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`users/${userId}`)
    }

    static async createOrder(order: object): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`/orders`, order)
    }

    static async getUserNotifications(): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`/notifications`)
    }

    static async markNotificationAsRead(notificationId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.patch(`/notifications/${notificationId}/read`)
    }

    static async sendMessage(message: object): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`/messages`, message)
    }

    static async getResponseMessages(responseId: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`/messages/response/${responseId}`)
    }

    static async getUserBalances(): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`users/balances`)
    }

    static async deposit(balance: object): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`/users/balances`, balance)
    }
}