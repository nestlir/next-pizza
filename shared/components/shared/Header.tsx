import { Container } from './Container';
import { CartButton } from './CartButton';

export const Header = () => {
  return (
    <header className="border-b">
      <Container>
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-8">
            <div className="font-bold text-xl">Логотип</div>
            <nav className="flex gap-4">
              <span>Категории</span>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <input placeholder="Поиск..." className="border px-2 py-1" />
            <span>Профиль</span>
            <CartButton />
          </div>
        </div>
      </Container>
    </header>
  );
};
