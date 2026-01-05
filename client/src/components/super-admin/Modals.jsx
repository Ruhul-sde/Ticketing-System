// components/super-admin/Modals.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { useSuperAdmin } from '../../context/SuperAdminContext';
import DepartmentModal from './modals/DepartmentModal';
import AdminFormModal from './modals/AdminFormModal';
import TicketDetailModal from './modals/TicketDetailModal';
import CreateTicketModal from './modals/CreateTicketModal';

const Modals = () => {
  const { modals, toggleModal } = useSuperAdmin();

  const renderModalContent = (key) => {
    switch (key) {
      case 'dept':
        return <DepartmentModal />;
      case 'adminForm':
        return <AdminFormModal />;
      case 'tokenDetail':
        return <TicketDetailModal />;
      case 'createToken':
        return <CreateTicketModal />;
      default:
        return null;
    }
  };

  return (
    <>
      {Object.entries(modals).map(([key, isOpen]) => {
        if (!isOpen) return null;
        
        return (
          <div key={key} className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-[#1e293b] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <div className="bg-gradient-to-r from-[#ED1B2F] to-[#455185] p-4 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                <button onClick={() => toggleModal(key, false)} className="text-white hover:text-white/50 text-2xl">×</button>
              </div>
              <div className="p-6 max-h-[70vh] overflow-y-auto text-white">
                {renderModalContent(key)}
              </div>
            </motion.div>
          </div>
        );
      })}
    </>
  );
};

export default Modals;