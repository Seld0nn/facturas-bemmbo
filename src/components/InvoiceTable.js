import React, { useEffect, useState } from 'react';
import getAllInvoices from '../services/getInvoices';
import Modal from 'react-modal';

function InvoiceTable() {
  const [data, setData] = useState(null);
  const [selectedInvoice, setselectedInvoice] = useState(null);
  const [creditNotes, setCreditNotes] = useState(null);
  const [selectedCreditNote, setSelectedCreditNote] = useState(null);
  const [showAssignButton, setShowAssignButton] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  useEffect(() => {
    if (selectedInvoice) {
      const getCreditNotes = async () => {
        try {
          const apiInvoice = await getAllInvoices();
          const apiCreditNotes = apiInvoice.filter(
            (item) => item.type === 'credit_note'
          );
          setCreditNotes(apiCreditNotes);
        } catch (error) {
          console.error(error);
        }
      };

      getCreditNotes();
    }
  }, [selectedInvoice]);

  const handleRadioChange = (itemId) => {
    setselectedInvoice(itemId);
    setSelectedCreditNote(null);
    setShowAssignButton(false);
  };

  const handleCreditNoteChange = (creditNoteId) => {
    setSelectedCreditNote(creditNoteId);
    setShowAssignButton(true);
  };

  const handleAssignButtonClick = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  if (!data) {
    return <div>Cargando...</div>;
  }

  const filteredData = data.filter((item) => item.type === 'received');

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
          {filteredData.map((item, index) => (
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

      {selectedInvoice && (
        <>
          <h2>Tabla de Credit Notes</h2>
          {creditNotes?.length > 0 ? (
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
                {creditNotes.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="radio"
                        name="creditNote"
                        value={item.id}
                        checked={selectedCreditNote === item.id}
                        onChange={() => handleCreditNoteChange(item.id)}
                      />
                    </td>
                    <td>{item.id}</td>
                    <td>{item.amount}</td>
                    <td>{item.type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No hay Credit Notes disponibles.</div>
          )}

          {showAssignButton && (
            <button onClick={handleAssignButtonClick}>Asignar</button>
          )}

          <Modal
            isOpen={isModalOpen}
            onRequestClose={handleModalClose}
            contentLabel="Modal de Éxito"
          >
            <h2>Nota de crédito asignada correctamente</h2>
            <button onClick={handleModalClose}>Seguir asignando</button>
          </Modal>
        </>
      )}
    </div>
  );
}

export default InvoiceTable;
