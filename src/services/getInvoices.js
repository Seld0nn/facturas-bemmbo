import axios from 'axios';

const URL_INVOICES = 'https://recruiting.api.bemmbo.com/invoices/pending';

const getAllInvoices = async () => {
  try {
    const response = await axios.get(URL_INVOICES);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export default getAllInvoices;
