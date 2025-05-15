import {makeAutoObservable} from "mobx"
import axios from "axios";
// @ts-ignore
import UserService from "../services/UserService.ts";
import PaymentMethodsService from "../services/PaymentMethodsService.ts";
// @ts-ignore
import AuthService from "../services/AuthService.ts";
import OrderResponseService from "../services/OrderResponseService.ts";

export default class Store {
    username = "";
    id = -2;
    isAuth = false;
    isLoading = false;
    isAuthLoading = false;
    isWebSocketConnected = false;

    constructor() {
        makeAutoObservable(this, {}, {autoBind: true});
    }

    setAuth(bool: boolean) {
        this.isAuth = bool;
    }

    setId(id: number) {
        this.id = id;
    }

    setIsWebSocketConnected(bool: boolean) {
        this.isWebSocketConnected = bool
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
            this.setId(response.data)
            this.setAuthLoading(false)
            return {success: true};
        } catch (e) {
            this.setAuthLoading(false)
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('Login error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async registerUser(
        username: string,
        email: string,
        password: string,
        password2: string): Promise<{ success: boolean; error?: string }> {
        try {
            const response = await AuthService.registerUser(username, email, password, password2)
            return {success: true};
        } catch (e) {
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
            this.setId(-1)
        } catch (e) {
            console.log(e)
        }
    }

    async checkAuth() {
        try {
            this.setAuthLoading(true)
            const response = await AuthService.checkAuth()
            this.setAuth(true)
            // @ts-ignore
            this.setUser(response.data?.username)
            // @ts-ignore
            this.setId(response.data?.userId)
            this.setAuthLoading(false)
            return {success: true};
        } catch (e) {
            this.setAuthLoading(false)
            this.setId(-1)
            return {success: false};
        }
    }

    async getOrders(coin: string, method: string, type: string, page: number) {
        this.setLoading(true);
        try {
            const response = await UserService.getOrders(coin, method, type, page)
            console.log(response.data)
            return response.data
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false);
        }
    }

    async getUserOrders(userId: number, status: string, currency: string, type: string, page: number) {
        this.setLoading(true);
        try {
            const response = await UserService.getUserOrders(userId, status, currency, type, page)
            console.log(response.data)
            return response.data
        } catch (e) {
            console.log(e)
        } finally {
            this.setLoading(false)
        }
    }

    async createOrder(order: object) {
        try {
            const response = await UserService.createOrder(order)
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async getUserMinInfo(userId: number) {
        try {
            const response = await UserService.getUserMinInfo(userId)
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async getFullUserInfo(userId: number) {
        try {
            const response = await UserService.getFullUserInfo(userId)
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async createResponse(orderId: number, paymentMethodId: number) {
        try {
            const response = await OrderResponseService.createResponse(orderId, paymentMethodId)
            console.log(response.data)
            // @ts-ignore
            return {success: true, responseId: response.data.responseId};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async getResponse(responseId: number) {
        this.setLoading(true)
        try {
            const response = await OrderResponseService.getResponse(responseId)
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    status: e.response.status,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async cancelResponse(responseId: number) {
        try {
            const response = await OrderResponseService.cancelResponse(responseId)
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async confirmResponse(responseId: number) {
        try {
            const response = await OrderResponseService.confirmResponse(responseId)
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async completeResponse(responseId: number) {
        try {
            const response = await OrderResponseService.completeResponse(responseId)
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async getUserNotifications() {
        try {
            const response = await UserService.getUserNotifications()
            console.log(response.data)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async markNotificationAsRead(notificationId: number) {
        try {
            const response = await UserService.markNotificationAsRead(notificationId)
            // @ts-ignore
            return {success: true};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async sendMessage(message: object) {
        try {
            const response = await UserService.sendMessage(message)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async getResponseMessages(responseId: number) {
        try {
            const response = await UserService.getResponseMessages(responseId)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async getUserBalances() {
        try {
            const response = await UserService.getUserBalances()
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async createDeposit(balance: object) {
        try {
            const response = await UserService.deposit(balance)
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async createPaymentMethod(method: object) {
        try {
            const response = await PaymentMethodsService.createPaymentMethod(method);
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async getPaymentMethods(bankId: number) {
        try {
            const response = await PaymentMethodsService.getPaymentMethods(bankId);
            // @ts-ignore
            return {success: true, content: response.data};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }

    async deletePaymentMethod(methodId: number) {
        try {
            const response = await PaymentMethodsService.deletePaymentMethod(methodId);
            // @ts-ignore
            return {success: true};
        } catch (e) {
            if (axios.isAxiosError(e)) {
                return {
                    success: false,
                    error: e.response.data
                }
            }

            console.error('error:', e);
            return {
                success: false,
                error: 'Произошла непредвиденная ошибка!'
            };
        }
    }
}