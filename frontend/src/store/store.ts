import {makeAutoObservable} from "mobx"
import axios from "axios";
// @ts-ignore
import UserService from "../services/UserService.ts";
// @ts-ignore
import AuthService from "../services/AuthService.ts";
import { AuthResponse } from "../models/response/AuthResponse";

export default class Store {
    username = ""; 
    isAuth = false;
    isLoading = false;
    isAuthLoading = false;
    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setUser(username: string) {
        this.username = username;
    }

    setLoading(bool: boolean) {
        this.isLoading = bool;
    }

    setAuthLoading(bool: boolean) {
        this.isAuthLoading = bool;
    }

    async loginUser(username: string, password: string): Promise<{ success: boolean; error?: string }> {
        this.setAuthLoading(true)
        try {
            const response = await AuthService.loginUser(username, password)
            this.setAuth(true)
            this.setUser(username)
            this.setAuthLoading(false)
            return { success: true };
        } catch (e) {
            this.setAuthLoading(false)
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            // Для неизвестных ошибок
            console.error('Login error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async registerUser(
        username: string,
        email:string,
        password: string,
        password2: string): Promise<{ success: boolean; error?: string }>

    {
        try {
            const response = await AuthService.registerUser(username, email, password, password2)
            return { success: true };
        }
        catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            // Для неизвестных ошибок
            console.error('Registration error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async logoutUser() {
        try {
            const response = await AuthService.logoutUser()
            this.setAuth(false)
            this.setUser("")
        } catch (e) {
            console.log(e)
        }
    }

    async checkAuth() {
        try {
            this.setAuthLoading(true)
            const response = await AuthService.checkAuth()
            this.setAuth(true)
            this.setUser(response.data)
            this.setAuthLoading(false)
        } catch (e) {
            this.setAuthLoading(false)
        }
    }

    async getOrders(coin: string, method: string, page:number) {
        this.setLoading(true);
        try {
            
            const response = await UserService.getOrders(coin, method, page)
            console.log(response.data)
            return response.data
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false);
        }
    }
}