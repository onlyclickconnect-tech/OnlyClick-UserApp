import { createContext, useContext, useMemo, useState } from "react";

const ModalContext = createContext();

export default function ModalProvider({ children }) {
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [isAutoPayoutModalOpen, setIsAutoPayoutModalOpen] = useState(false);
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isEnterAmountModalOpen, setIsEnterAmountModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const value = useMemo(
    () => ({
      isCustomModalOpen,
      setIsCustomModalOpen,
      isAutoPayoutModalOpen,
      setIsAutoPayoutModalOpen,
      isWithdrawModalOpen,
      setIsWithdrawModalOpen,
      isEnterAmountModalOpen,
      setIsEnterAmountModalOpen,
      isSuccessModalOpen,
      setIsSuccessModalOpen,
    }),
    [
      isCustomModalOpen,
      isAutoPayoutModalOpen,
      isWithdrawModalOpen,
      isEnterAmountModalOpen,
      isSuccessModalOpen,
    ]
  );

  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
}

export const useModal = () => useContext(ModalContext);
