import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, ArrowRight, Truck, Building2, User, MapPin, AlertCircle, ShoppingCart } from 'lucide-react';
import confetti from 'canvas-confetti';
import Navbar from '../components/customer/Navbar';
import Footer from '../components/customer/Footer';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import ProductImage from '../components/common/ProductImage';
import { PRODUCTS } from '../data/products';

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  const [deliveryInfo, setDeliveryInfo] = useState({
    hospitalName: 'Memorial Regional Health Center',
    contactPerson: 'Dr. Sarah Mitchell (Chief of Surgery)',
    address: '400 Medical Parkway, Suite 300, Dallas, TX 75201',
    priority: 'STANDARD', // STANDARD, URGENT, EMERGENCY
    notes: 'Deliver to Sterile Receiving Dock B'
  });

  const handleDeliverySubmit = (e) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. Map cart items to backend format
      const orderPayload = {
        customerId: `HOSP-${deliveryInfo.hospitalName.replace(/[^A-Za-z0-9]/g, '').substring(0, 8).toUpperCase() || 'METRO'}`,
        customerTier: deliveryInfo.priority === 'EMERGENCY' ? 'VIP' : deliveryInfo.priority === 'URGENT' ? 'PRIORITY' : 'STANDARD',
        items: items.map(item => ({
          sku: item.sku,
          quantity: item.quantity
        }))
      };

      // 2. Create internal order in backend
      const res = await api.createOrder(orderPayload);
      const orderData = res.data;
      const orderNumber = orderData?.orderNumber;

      if (!orderNumber) {
        throw new Error('Could not retrieve order reference from server.');
      }

      // 3. Create Razorpay Payment Order
      const paymentOrderRes = await api.createPaymentOrder(orderNumber);
      const paymentOrder = paymentOrderRes.data;

      // 4. Verify Razorpay SDK is loaded
      if (typeof window.Razorpay === 'undefined') {
        throw new Error('Razorpay SDK could not be loaded. Please ensure you have internet access.');
      }

      const razorpayKey = paymentOrder?.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_SlPoCiiwiPBArC';

      // 5. Open Razorpay Checkout Modal
      const options = {
        key: razorpayKey,
        amount: paymentOrder.amountInPaise,
        currency: paymentOrder.currency || 'INR',
        name: 'Shakthi-Acentra Health',
        description: `Clinical Order ${orderNumber}`,
        image: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23167733"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>',
        ...(paymentOrder.razorpayOrderId ? { order_id: paymentOrder.razorpayOrderId } : {}),
        handler: async function (response) {
          try {
            setLoading(true);
            await api.verifyPayment({
              orderNumber: orderNumber,
              razorpayOrderId: response.razorpay_order_id || null,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature || null
            });

            setConfirmedOrder({
              orderId: orderNumber,
              id: orderData?.id || orderNumber,
              total: total,
              hospital: deliveryInfo.hospitalName,
              itemCount: items.reduce((acc, it) => acc + it.quantity, 0),
              paymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id || null
            });

            // Clear the shopping cart
            clearCart();

            // Trigger Confetti Celebration
            confetti({
              particleCount: 90,
              spread: 75,
              origin: { y: 0.6 },
              colors: ['#167733', '#22C55E', '#0284C7', '#0D9488']
            });

            setStep(3);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } catch (verifyErr) {
            console.error('Payment verification failed:', verifyErr);
            setError(verifyErr.message || 'Payment signature verification failed. Please contact support.');
          } finally {
            setLoading(false);
          }
        },
        prefill: {
          name: deliveryInfo.contactPerson,
          email: `procurement@${deliveryInfo.hospitalName.toLowerCase().replace(/[^a-z0-9]/g, '') || 'health'}.org`,
          contact: '+919876543210'
        },
        notes: {
          hospital: deliveryInfo.hospitalName,
          urgency: deliveryInfo.priority,
          orderNumber: orderNumber
        },
        theme: {
          color: '#167733'
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
            setError('Payment cancelled. You can retry paying when ready.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        console.error('Razorpay payment failed:', resp.error);
        setError(`Payment failed: ${resp.error?.description || resp.error?.reason || 'Transaction could not be completed'}`);
        setLoading(false);
      });
      rzp.open();

    } catch (err) {
      console.error('Order creation failed:', err);
      setError(err.message || 'Failed to submit order. Please check item quantities.');
      setLoading(false);
    }
  };

  if (items.length === 0 && step !== 3) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
        <Navbar />
        <main style={{ flexGrow: 1, padding: '4rem 1.5rem', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0F172A' }}>No items to checkout</h2>
          <p style={{ color: '#64748B', marginTop: '0.5rem', marginBottom: '1.5rem' }}>
            Your cart is currently empty. Please select products from our clinical catalog first.
          </p>
          <Link to="/products" className="btn-primary">
            <span>Browse Products</span>
            <ArrowRight size={16} />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#F8FAFC' }}>
      <Navbar />

      <main style={{ flexGrow: 1, padding: '3rem 1.5rem 6rem', maxWidth: '960px', margin: '0 auto', width: '100%' }}>
        
        {/* Stepper Header (Only shown during steps 1 & 2) */}
        {step !== 3 && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
              Secure Clinical Checkout
            </h1>

            {/* Stepper Pills */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.25rem' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: step >= 1 ? '#167733' : '#94A3B8'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: step >= 1 ? '#167733' : '#E2E8F0',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  1
                </div>
                <span>1. Delivery Destination</span>
              </div>

              <div style={{ width: '40px', height: '2px', backgroundColor: step >= 2 ? '#167733' : '#E2E8F0' }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 700,
                fontSize: '0.88rem',
                color: step >= 2 ? '#167733' : '#94A3B8'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: step >= 2 ? '#167733' : '#E2E8F0',
                  color: '#FFFFFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}>
                  2
                </div>
                <span>2. Review & Confirm</span>
              </div>
            </div>
          </div>
        )}

        {/* STEP 1: Delivery Details */}
        {step === 1 && (
          <form onSubmit={handleDeliverySubmit} style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem'
          }}>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0F172A' }}>
              Facility & Shipping Information
            </h2>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Hospital / Clinic / Practice Name
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                <Building2 size={18} color="#64748B" />
                <input
                  type="text"
                  required
                  value={deliveryInfo.hospitalName}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, hospitalName: e.target.value })}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0F172A' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Recipient / Clinician in Charge
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                <User size={18} color="#64748B" />
                <input
                  type="text"
                  required
                  value={deliveryInfo.contactPerson}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, contactPerson: e.target.value })}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0F172A' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.4rem' }}>
                Delivery Address & Receiving Dock
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '10px', padding: '0.75rem 1rem' }}>
                <MapPin size={18} color="#64748B" />
                <input
                  type="text"
                  required
                  value={deliveryInfo.address}
                  onChange={(e) => setDeliveryInfo({ ...deliveryInfo, address: e.target.value })}
                  style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0F172A' }}
                />
              </div>
            </div>

            {/* Urgency Priority Level */}
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '0.6rem' }}>
                Delivery Dispatch Urgency
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {[
                  { id: 'STANDARD', title: 'Standard Clinic', desc: 'Ground scheduled transit' },
                  { id: 'URGENT', title: 'Urgent Care', desc: 'Expedited Priority Dispatch' },
                  { id: 'EMERGENCY', title: 'ICU / Emergency', desc: 'Immediate automated fast-track' }
                ].map(p => (
                  <div
                    key={p.id}
                    onClick={() => setDeliveryInfo({ ...deliveryInfo, priority: p.id })}
                    style={{
                      border: '1px solid',
                      borderColor: deliveryInfo.priority === p.id ? '#167733' : '#E2E8F0',
                      backgroundColor: deliveryInfo.priority === p.id ? '#F0FDF4' : '#FFFFFF',
                      borderRadius: '12px',
                      padding: '1rem',
                      cursor: 'pointer',
                      transition: 'all 0.15s'
                    }}
                  >
                    <div style={{ fontSize: '0.92rem', fontWeight: 700, color: deliveryInfo.priority === p.id ? '#167733' : '#0F172A' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '2px' }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '1rem', borderTop: '1px solid #F1F5F9' }}>
              <button type="submit" className="btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}>
                <span>Continue to Review</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </form>
        )}

        {/* STEP 2: Review & Confirm */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {error && (
              <div style={{
                background: '#FFF1F2',
                border: '1px solid #FECDD3',
                color: '#BE123C',
                padding: '1rem',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.9rem'
              }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            )}

            <div style={{
              background: '#FFFFFF',
              border: '1px solid #E2E8F0',
              borderRadius: '24px',
              padding: '2.5rem',
              boxShadow: '0 4px 6px -1px rgba(0,0,0,0.04)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2rem'
            }}>
              {/* Delivery Recap */}
              <div style={{
                background: '#F8FAFC',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '1px solid #E2E8F0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', color: '#167733' }}>
                  Destination Facility
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A' }}>
                  {deliveryInfo.hospitalName}
                </div>
                <div style={{ fontSize: '0.88rem', color: '#475569' }}>
                  Attn: {deliveryInfo.contactPerson} | {deliveryInfo.address}
                </div>
                <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#167733', marginTop: '4px' }}>
                  Urgency Tier: {deliveryInfo.priority} Dispatch
                </div>
              </div>

              {/* Items Breakdown */}
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0F172A', marginBottom: '1rem' }}>
                  Itemized Supplies
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map(item => (
                    <div key={item.sku} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.75rem 0',
                      borderBottom: '1px solid #F1F5F9'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          border: '1px solid #E2E8F0',
                          backgroundColor: '#FFFFFF',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px',
                          flexShrink: 0
                        }}>
                          <ProductImage
                            src={item.image || PRODUCTS.find(p => p.sku === item.sku)?.image}
                            alt={item.name}
                            aspectRatio={null}
                            style={{ width: '100%', height: '100%' }}
                            fallbackText={item.name.slice(0, 2)}
                          />
                        </div>
                        <div>
                          <span style={{ fontWeight: 600, color: '#0F172A' }}>{item.name}</span>
                          <span style={{ color: '#64748B', fontSize: '0.85rem', marginLeft: '6px' }}>
                            x{item.quantity}
                          </span>
                        </div>
                      </div>
                      <span style={{ fontWeight: 700, color: '#0F172A', fontFamily: 'JetBrains Mono' }}>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #E2E8F0',
                fontSize: '0.92rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Medical Freight</span>
                  <span>{shipping === 0 ? 'FREE' : `₹${shipping.toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B' }}>
                  <span>Regulatory Handling (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  color: '#0F172A',
                  paddingTop: '0.75rem',
                  borderTop: '1px solid #E2E8F0'
                }}>
                  <span>Final Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem' }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#64748B',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  ← Edit Delivery Details
                </button>

                <button
                  onClick={handlePlaceOrder}
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    padding: '0.95rem 2.25rem',
                    fontSize: '1.05rem',
                    opacity: loading ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}
                >
                  {loading ? (
                    <span>Processing Payment...</span>
                  ) : (
                    <>
                      <span>Pay with Razorpay (Test Mode)</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: Order Confirmed Screen */}
        {step === 3 && confirmedOrder && (
          <div style={{
            background: '#FFFFFF',
            border: '1px solid #E2E8F0',
            borderRadius: '28px',
            padding: '4rem 2rem',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '1.5rem',
            boxShadow: '0 20px 40px -15px rgba(22, 119, 51, 0.12)'
          }}>
            
            {/* Green Checkmark Circle */}
            <div style={{
              width: '80px',
              height: '80px',
              borderRadius: '50%',
              backgroundColor: '#DCFCE7',
              color: '#167733',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 25px rgba(34, 197, 94, 0.4)'
            }}>
              <CheckCircle2 size={48} strokeWidth={2.5} />
            </div>

            <div>
              <div style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                color: '#167733',
                letterSpacing: '0.06em',
                marginBottom: '0.4rem'
              }}>
                Order Successfully Placed
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', letterSpacing: '-0.02em' }}>
                Order Confirmed
              </h2>
              <p style={{ color: '#64748B', maxWidth: '480px', margin: '0.5rem auto 0', fontSize: '1rem', lineHeight: 1.5 }}>
                Your medical supplies have been registered. Automated allocation is actively securing sterile warehouse reserves.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '16px',
              padding: '1.5rem 2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              minWidth: '320px',
              textAlign: 'left'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Order Reference:</span>
                <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 700, color: '#0F172A' }}>
                  {confirmedOrder.orderId}
                </span>
              </div>
              {confirmedOrder.paymentId && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Payment ID:</span>
                  <span style={{ fontFamily: 'JetBrains Mono', fontWeight: 600, color: '#167733', fontSize: '0.85rem' }}>
                    {confirmedOrder.paymentId}
                  </span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Destination:</span>
                <span style={{ fontWeight: 600, color: '#0F172A' }}>
                  {confirmedOrder.hospital}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Payment Status:</span>
                <span style={{ fontWeight: 700, color: '#167733', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ShieldCheck size={16} /> Verified via Razorpay
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748B' }}>Total Paid:</span>
                <span style={{ fontWeight: 800, color: '#167733' }}>
                  ₹{confirmedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>

            {/* CTAs */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
              <Link
                to={`/orders/${confirmedOrder.id || confirmedOrder.orderId}`}
                className="btn-primary"
                style={{ padding: '0.85rem 2rem', fontSize: '1rem' }}
              >
                <span>Track Order Milestones</span>
                <ArrowRight size={18} />
              </Link>

              <Link to="/products" className="btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
                <span>Continue Shopping</span>
              </Link>
            </div>

          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
