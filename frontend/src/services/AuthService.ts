import {AxiosResponse} from "axios";
import {AuthResponse} from "../models/response/AuthResponse";
// @ts-ignore
import $api from "../api/index.ts";

export default class AuthService {
    static async loginUser(username: string, password: string): Promise<AxiosResponse<number>> {
        return $api.post('auth/login', {username: username, password: password})
    }

    static async registerUser(username: string, email: string, password: string, password2: string): Promise<AxiosResponse<AuthResponse>> {
        return $api.post('auth/registration', {
            username: username,
            email: email,
            password: password,
            passwordConfirm: password2
        })
    }

    static async logoutUser(): Promise<void> {
        return $api.post('auth/logout')
    }

    static async checkAuth(): Promise<AxiosResponse<string>> {
        return $api.get('auth/whoami')
    }
}