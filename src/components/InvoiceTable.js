import React, { useEffect, useState } from 'react';
import getAllInvoices from '../services/getInvoices';
import Modal from 'react-modal';
import '../App.css';

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
        const apiInovce_filter = apiInvoice.filter(
          (item) => item.type === 'received'
        );
        setData(apiInovce_filter);
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

  const handleRadioChange = (id) => {
    setselectedInvoice(id);
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
      <h2>Selecciona una factura</h2>
      <table className="table-container  centered-table">
        <tbody>
          {filteredData.map((item, index) => (
            <tr
              key={item.id}
              className={item.id === selectedInvoice ? 'selected-row' : ''}
            >
              <td>
                <input
                  type="radio"
                  name="item"
                  value={item.id}
                  checked={selectedInvoice === item.id}
                  onChange={() => handleRadioChange(item.id)}
                />
              </td>
              <td>
                <span>{`inv${index + 1}`} </span>
                <span className="organization-id">
                  {`(${item.organization_id})`}
                </span>
              </td>
              <td>{item.amount}</td>
              <td>{item.type}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {selectedInvoice && (
        <>
          <h2>Selecciona una nota de crédito</h2>

          {creditNotes?.length > 0 ? (
            <table className="table-container  centered-table">
              <tbody>
                {creditNotes.map((item, index) => (
                  <tr
                    key={item.id}
                    className={
                      item.id === selectedCreditNote ? 'selected-row' : ''
                    }
                  >
                    <td>
                      <input
                        type="radio"
                        name="creditNote"
                        value={item.id}
                        checked={selectedCreditNote === item.id}
                        onChange={() => handleCreditNoteChange(item.id)}
                      />
                    </td>
                    <td>
                      <span>{`cn${index + 1}`} </span>
                      <span className="organization-id">
                        {`(${item.organization_id})`}
                      </span>
                    </td>
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
