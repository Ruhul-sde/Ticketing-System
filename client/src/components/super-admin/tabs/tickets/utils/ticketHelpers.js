// tickets/utils/ticketHelpers.js
export const validateTicketForm = (data, departmentCategories) => {
  if (!data.companyId) return 'Company is required';
  if (!data.userId) return 'User is required';
  if (!data.departmentId) return 'Department is required';
  if (!data.title) return 'Title is required';
  if (!data.description) return 'Description is required';
  if (departmentCategories.length > 0 && !data.category) return 'Category is required';
  return null;
};

export const calculateStats = (tickets) => {
  const totalTickets = tickets.length;
  const openTickets = tickets.filter(t => t.status === 'open' || t.status === 'pending').length;
  const inProgressTickets = tickets.filter(t => t.status === 'in-progress' || t.status === 'assigned').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return {
    totalTickets,
    openTickets,
    inProgressTickets,
    resolvedTickets
  };
};