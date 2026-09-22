import React from 'react';
import Navbar from '../components/customer/Navbar';
import Hero from '../components/customer/Hero';
import CategoryShowcase from '../components/customer/CategoryShowcase';
import FeaturedProducts from '../components/customer/FeaturedProducts';
import SmartCommerce from '../components/customer/SmartCommerce';
import HowItWorks from '../components/customer/HowItWorks';
import IntelligentFulfillment from '../components/customer/IntelligentFulfillment';
import InventoryIntelligence from '../components/customer/InventoryIntelligence';
import Product3DSection from '../components/customer/Product3DSection';
import TrustSection from '../components/customer/TrustSection';
import FinalCTA from '../components/customer/FinalCTA';
import Footer from '../components/customer/Footer';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF' }}>
      <Navbar />
      <main style={{ flexGrow: 1 }}>
        <Hero />
        <CategoryShowcase />
        <FeaturedProducts />
        <SmartCommerce />
        <HowItWorks />
        <IntelligentFulfillment />
        <InventoryIntelligence />
        <Product3DSection />
        <TrustSection />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
