import { Outlet } from 'react-router-dom';
import Header from '../components/navigation/Header';

function AppLayout() {
  return (
    <div className="min-h-screen bg-hero">
      <Header />
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10">
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
