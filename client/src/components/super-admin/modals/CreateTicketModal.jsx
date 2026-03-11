import React from 'react';
import { useSuperAdmin } from '../../../context/SuperAdminContext';
import CreateTicketForm from '../../Forms/CreateTicketForm';

const CreateTicketModal = () => {

  const {
    toggleModal,
    companies,
    departments,
    createTicket,
    loading
  } = useSuperAdmin();

  return (

    <CreateTicketForm
      companies={companies}
      departments={departments}
      loading={loading}
      onSubmit={createTicket}
      onCancel={() => toggleModal('createToken', false)}
    />

  );

};

export default CreateTicketModal;