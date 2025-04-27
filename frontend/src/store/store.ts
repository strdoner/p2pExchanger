import {makeAutoObservable} from "mobx"
import axios from "axios";
import UserService from "../services/UserService.ts";
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

    async loginUser(username: string, password: string) {
        
    }

    async logoutUser() {
        try {
            const response = await AuthService.logoutUser()
            localStorage.removeItem('access_token')
            this.setAuth(false)
            this.setUser("")
        } catch (e) {
            console.log(e)
        }
    }

    async checkAuth() {
        
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