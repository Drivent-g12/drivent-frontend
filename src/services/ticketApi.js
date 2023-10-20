import api from './api';

export async function createTicket(ticketTypeId, token){
    const response = await api.post('/tickets',{ticketTypeId:ticketTypeId}, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })
    
    return response.data
}

export async function getTicket(token){
    const response = await api.get('/tickets',{
        headers: {
          Authorization: `Bearer ${token}`,
        }
      })

    return response.data  
}