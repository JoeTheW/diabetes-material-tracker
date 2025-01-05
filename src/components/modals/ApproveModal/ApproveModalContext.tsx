'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import DOMPurify from 'dompurify';

type ModalOptions = {
  title?: string;
  message?: string;
  cancelText?: string;
  approveText?: string;
  onApprove?: () => void;
  onCancel?: () => void;
};

type ModalContextType = {
  showApprovalModal: (options: ModalOptions) => void;
  hideApprovalModal: () => void;
};

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ApproveModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modalOptions, setModalOptions] = useState<ModalOptions | null>(null);

  const showModal = (options: ModalOptions) => setModalOptions(options);
  const hideModal = () => setModalOptions(null);

  return (
    <ModalContext.Provider value={{ showApprovalModal: showModal, hideApprovalModal: hideModal }}>
      {children}
      {modalOptions && (
        <div className="modal modal-open">
          <div className="modal-box">
            {modalOptions.title && <h3 className="font-bold text-lg">{modalOptions.title}</h3>}
            {modalOptions.message && ( 
              <div
              className="py-4"
              dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(modalOptions.message) }}
              ></div>
            )}
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => {
                  modalOptions.onCancel?.();
                  hideModal();
                }}
              >
                {modalOptions.cancelText || 'Cancel'}
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  modalOptions.onApprove?.();
                  hideModal();
                }}
              >
                {modalOptions.approveText || 'Approve'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useApprovalModal = (): ModalContextType => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider');
  }
  return context;
};
