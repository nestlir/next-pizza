import { Header, CartDrawer } from '@/shared/components/shared';
import { Container } from '@/shared/components/shared/Container';

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <main>
        <Container>{children}</Container>
      </main>
      <CartDrawer />
      {modal}
    </>
  );
}
