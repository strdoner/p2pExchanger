import {makeAutoObservable} from "mobx"
import axios from "axios";

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
        this.setLoading(true);
        try {
            const response = await AuthService.loginUser(username, password)
            //TODO
        } catch (e) {
            return e?.response?.data;
        } finally {
            this.setLoading(false);
        }
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
        this.setAuthLoading(true)
        try {
            axios.defaults.withCredentials = true
            const response = await axios.post<AuthResponse>('http://127.0.0.1:8000/api/auth/token/refresh/', {withCredentials: true})
            
            localStorage.setItem('access_token', response.data.access)
            this.setAuth(true)
            const decoded = jwtDecode<JwtResponse>(response.data.access).username
            this.setUser(decoded)
        } catch (e) {
            console.log(e)

        } finally {
            this.setAuthLoading(false);
            
        }
    }
}