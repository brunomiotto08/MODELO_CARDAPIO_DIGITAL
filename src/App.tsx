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
          <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            <Route path="/cardapio" element={<MenuPage />} />
            <Route path="/monte-sua-mesa" element={<TablePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
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
