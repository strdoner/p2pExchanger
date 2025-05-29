import React, {useCallback, useContext, useEffect, useState} from "react";
import {Context} from "../index";
import {useSearchParams} from "react-router-dom";
import P2pOrderHistoryItem from "./P2pOrderHistoryItem";
import Pagination from "./Pagination";
import {observer} from "mobx-react-lite";
import DisputeTableItem from "./DisputeTableItem";

const DisputesTable = () => {
    const {store} = useContext(Context)
    const [isLoading, setIsLoading] = useState(false);
    const [searchParams, setSearchParams] = useSearchParams();
    const [disputes, setDisputes] = useState(null);

    const fetchDisputes = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await store.getDisputes(
                searchParams.get("status"),
                searchParams.get("page") === null ? 0 : Number(searchParams.get("page")) - 1
            );
            setDisputes(response.content);
            console.log("disputes", response.content);
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setDisputes({empty: true}); // Устанавливаем empty при ошибке
        } finally {
            setIsLoading(false);
        }
    }, [store, searchParams]);

    useEffect(() => {
        const page = searchParams.get("page");
        const status = searchParams.get("status");

        fetchDisputes();
    }, [fetchDisputes, searchParams]);

    if (isLoading || disputes === null) {
        return (
            <table className='order__list'>
                <thead>
                <tr>
                    <th>Спор №</th>
                    <th>Сделка №</th>
                    <th>Покупатель</th>
                    <th>Продавец</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td colSpan="8" className="text-center py-4">
                        <div className="spinner-border" role="status">
                            <span className="sr-only"></span>
                        </div>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }
    return (
        <>
            <table className='order__list'>
                <thead>
                <tr>
                    <th>Спор №</th>
                    <th>Сделка №</th>
                    <th>Покупатель</th>
                    <th>Продавец</th>
                    <th>Сумма</th>
                    <th>Статус</th>
                    <th>Дата</th>
                    <th>Действие</th>
                </tr>
                </thead>
                <tbody>
                {!disputes?.empty ? disputes?.content?.map(dispute =>
                        <DisputeTableItem dispute={dispute} key={dispute.id}/>
                    )
                    : (
                        <tr>
                            <td colSpan="8" className="text-center py-4">
                                Нет споров
                            </td>
                        </tr>
                    )
                }
                </tbody>
            </table>
            {disputes?.totalPages > 1 && (
                <Pagination
                    isFirst={disputes.first}
                    isLast={disputes.last}
                    totalPages={disputes.totalPages}
                />
            )}
        </>
    )
}

export default observer(DisputesTable);