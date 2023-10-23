import api from './api';

export async function processPayment(paymentData, token) {
    const response = await api.post('/payments/process', paymentData, {
        headers: {
            Authorization: `Bearer ${token}`,
        }
    })

    return response.data
}