import React, { useEffect, useState } from 'react';
import getAllInvoices from '../services/getInvoices';

function InvoiceTable() {
  const [data, setData] = useState(null);
  const [selectedInvoice, setselectedInvoice] = useState(null);

  useEffect(() => {
    const getInvoices = async () => {
      try {
        const apiInvoice = await getAllInvoices();
        setData(apiInvoice);
      } catch (error) {
        console.error(error);
      }
    };

    getInvoices();
  }, []);

  const handleRadioChange = (itemId) => {
    setselectedInvoice(itemId);
  };

  if (!data) {
    return <div>Cargando...</div>;
  }

  return (
    <div>
      <h2>Tabla de Datos</h2>
      <table>
        <thead>
          <tr>
            <th></th>
            <th>ID</th>
            <th>Amount</th>
            <th>Type</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={item.id}>
              <td>
                <input
                  type="radio"
                  name="item"
                  value={item.id}
                  checked={selectedInvoice === item.id}
                  onChange={() => handleRadioChange(item.id)}
                />
              </td>
              <td>{`inv${index + 1} (${item.organization_id})`}</td>
              <td>{item.amount}</td>
              <td>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceTable;
