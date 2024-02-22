import React from 'react';
import { Nav } from './Nav';
import { Modal, useModal } from './modal';
import { LoginForm } from '@/modules/auth/LoginForm';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const {
    isOpen: isLoginModalOpen,
    openModal: openLoginModal,
    closeModal: closeLoginModal,
  } = useModal();

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <Nav onLoginButtonClick={openLoginModal} />

        <main className="gap-x-14 items-center max-w-screen-xl mx-auto px-4 md:flex md:px-8 py-10">
          {children}
        </main>
      </div>

      <Modal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
        title="Sign In"
      >
        <LoginForm onSuccessfulLogin={closeLoginModal} />
      </Modal>
    </>
  );
};
