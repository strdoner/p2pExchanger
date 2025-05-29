import {AxiosResponse} from "axios";
import {OrdersResponse} from "../models/response/OrdersResponse";
import $api from "../api/index.ts";

export default class DisputeService {
    static async getDisputes(status: string, page: number, pageSize): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`admin/disputes?pageSize=${pageSize}${status === null ? "" : "&status=" + status}${page === null ? "" : "&page=" + page}`);
    }

    static async getDisputeById(disputeID: number): Promise<AxiosResponse<OrdersResponse>> {
        return $api.get(`/disputes/${disputeID}`);
    }

    static async completeDispute(disputeID: number, comment: string): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`admin/disputes/${disputeID}/complete`, {comment: comment});
    }

    static async cancelDispute(disputeID: number, comment: string): Promise<AxiosResponse<OrdersResponse>> {
        return $api.post(`admin/disputes/${disputeID}/cancel`, {comment: comment});
    }
}