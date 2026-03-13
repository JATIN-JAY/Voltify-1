import React, { createContext, useState, useCallback } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [openModals, setOpenModals] = useState({
    login: false,
    signup: false,
  });

  const openModal = useCallback((modalName) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: true,
    }));
  }, []);

  const closeModal = useCallback((modalName) => {
    setOpenModals(prev => ({
      ...prev,
      [modalName]: false,
    }));
  }, []);

  const closeAllModals = useCallback(() => {
    setOpenModals({
      login: false,
      signup: false,
    });
  }, []);

  const switchModal = useCallback((fromModal, toModal) => {
    setOpenModals(prev => ({
      ...prev,
      [fromModal]: false,
      [toModal]: true,
    }));
  }, []);

  return (
    <ModalContext.Provider
      value={{
        openModals,
        openModal,
        closeModal,
        closeAllModals,
        switchModal,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};
