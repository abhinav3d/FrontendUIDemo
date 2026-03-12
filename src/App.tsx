import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Styles from './pages/Styles';
import HowItWorks from './pages/HowItWorks';
import Gallery from './pages/Gallery';
import CreateEntry from './pages/CreateEntry';
import Configurator from './pages/Configurator';
import Workspace from './pages/Workspace';
import ProductionDashboard from './pages/ProductionDashboard';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Auth from './pages/Auth';
import Account from './pages/Account';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Legal from './pages/Legal';

export default function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/styles" element={<Styles />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/create" element={<CreateEntry />} />
          <Route path="/configurator" element={<Configurator />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/production/:id" element={<ProductionDashboard />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/account" element={<Account />} />
          <Route path="/privacy" element={<Legal />} />
          <Route path="/terms" element={<Legal />} />
          <Route path="/refund-policy" element={<Legal />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
        </Routes>
      </Layout>
    </Router>
  );
}
