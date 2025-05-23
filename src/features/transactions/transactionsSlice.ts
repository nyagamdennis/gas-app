/* eslint-disable prettier/prettier */
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../../utils/api"




interface transactions {
    id: string;
    transaction_code: string,
    amount: string,
    name: string,
    phone: string,
    date: string
}

interface transactionsState {
    transactions: transactions[];
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}


const initialState: transactionsState = {
    transactions: [],
    status: "idle",
    error: null,
};

export const fetchTransactions = createAsyncThunk<transactions[], void, {}>(
    "transactions/fetchTransactions",
    async () => {
        // const response = await axios.get<transactions[]>(TRANSACTIONS_URLS, {
        //     headers: {
        //         Authorization: `Bearer ${Cookies.get("accessToken")}`,
        //     },
        // });
        const response = await api.get<transactions[]>("/mpesa/transactions/");
        return response.data;
    }
);



const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers(builder) {
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.transactions = action.payload;
            })
            .addCase(fetchTransactions.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message || "Failed to fetch products";
            })
    },
});

export const selectAllTransactions = (state: { transactions: transactionsState }) =>
    state.transactions.transactions;
export const getTransactionstatus = (state: { transactions: transactionsState }) =>
    state.transactions.status;
export const getTransactionsError = (state: { transactions: transactionsState }) =>
    state.transactions.error;

export default transactionsSlice.reducer;
