import { lazy, Suspense, type ComponentType } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import SmoothScroll from './components/SmoothScroll';
import { OrderProvider } from './context/OrderContext';
import Header from './components/Header';
import Footer from './components/Footer';
import OrderListPanel from './components/OrderListPanel';
import { TableProvider } from './context/TableContext';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import TablePage from './pages/TablePage';
import NotFoundPage from './pages/NotFoundPage';
import { routes } from './config/routes';

/**
 * Componente de cada caminho do registro (src/config/routes.ts).
 * Páginas novas entram aqui e lá; só as rotas com feature ligada são montadas.
 */
const pages: Record<string, ComponentType> = {
  '/': HomePage,
  '/cardapio': MenuPage,
  '/monte-sua-mesa': TablePage,
  '/pacotes': lazy(() => import('./pages/PackagesPage')),
  '/orcamento': lazy(() => import('./pages/QuotePage')),
  '/eventos-realizados': lazy(() => import('./pages/GalleryPage')),
};

function PageFallback() {
  return <main className="min-h-screen bg-ivory pt-[var(--header-h)]" aria-busy="true" />;
}

function AnimatedRoutes() {
  const location = useLocation();
  const reduce = useReducedMotion();

  return (
    <div className="grid">
      <AnimatePresence initial={false}>
        <motion.div
          key={location.pathname}
          className="col-start-1 row-start-1 min-w-0"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          <Suspense fallback={<PageFallback />}>
            <Routes location={location}>
              {routes.map((route) => {
                const Page = pages[route.path];
                return Page ? <Route key={route.path} path={route.path} element={<Page />} /> : null;
              })}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Suspense>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <SmoothScroll>
      <BrowserRouter>
        <OrderProvider>
          <TableProvider>
          <div className="min-h-screen bg-ivory font-sans text-text">
            <Header />
            <AnimatedRoutes />
            <Footer />
            <OrderListPanel />
          </div>
          </TableProvider>
        </OrderProvider>
      </BrowserRouter>
    </SmoothScroll>
  );
}
