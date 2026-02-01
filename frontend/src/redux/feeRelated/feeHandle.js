import axios from 'axios';
import {
    getRequest,
    getSuccess,
    getFailed,
    stuffDone
} from './feeSlice';

export const generateFee = (fields) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.post(`${process.env.REACT_APP_BASE_URL}/GenerateFee`, fields, {
            headers: { 'Content-Type': 'application/json' },
        });
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(stuffDone());
        }
    } catch (error) {
        dispatch(getFailed(error));
    }
};

export const getFeesByClass = (id) => async (dispatch) => {
    dispatch(getRequest());

    try {
        const result = await axios.get(`${process.env.REACT_APP_BASE_URL}/FeeList/${id}`);
        if (result.data.message) {
            dispatch(getFailed(result.data.message));
        } else {
            dispatch(getSuccess(result.data));
        }
    } catch (error) {
        dispatch(getFailed(error));
    }
};
