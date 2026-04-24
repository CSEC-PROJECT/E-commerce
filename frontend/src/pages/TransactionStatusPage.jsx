import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../lib/apiClient';
import { useAuthStore } from '../store/authStore';
import useCartStore from '../store/cartStore';

const SuccessIcon = () => (
    <div className="relative mx-auto mb-8" style={{ width: 96, height: 96 }}>
        <div className="absolute inset-0 rounded-full bg-emerald-500/10 animate-ping" style={{ animationDuration: '2s' }} />
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
        </div>
    </div>
);

// Failed X icon
const FailedIcon = () => (
    <div className="relative mx-auto mb-8" style={{ width: 96, height: 96 }}>
        <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shadow-lg shadow-red-500/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
            </svg>
        </div>
    </div>
);

// Spinner while loading
const Spinner = () => (
    <div className="relative mx-auto mb-8" style={{ width: 96, height: 96 }}>
        <div className="w-24 h-24 rounded-full border-4 border-border border-t-primary animate-spin" />
    </div>
);

const TransactionStatusPage = () => {
        // Modal state for receipt
        const [showReceiptModal, setShowReceiptModal] = useState(false);
    const [searchParams] = useSearchParams();
    const { accessToken } = useAuthStore();
    const clearCart = useCartStore((s) => s.clearCart);

    const [status, setStatus] = useState('loading');
    const [txRef, setTxRef] = useState('');
    const [details, setDetails] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        const tx = searchParams.get('tx_ref') || searchParams.get('trx_ref');
        const chapaStatus = searchParams.get('status');

        if (!tx) {
            // No tx_ref at all — show generic error
            setStatus('error');
            setErrorMsg('Transaction reference not found. Please contact support.');
            return;
        }

        setTxRef(tx);

        if (chapaStatus && chapaStatus !== 'success') {
            setStatus('failed');
            return;
        }

        const verify = async () => {
            try {
                const data = await apiRequest(`/api/pay/verify/${tx}`, {
                    method: 'GET',
                    token: accessToken,
                });

                if (data?.status === 'success' || data?.message === 'Payment verified successfully' || data?.message === 'Payment already verified') {
                    setDetails(data?.data);
                    setStatus('success');
                    clearCart();
                } else {
                    setStatus('failed');
                }
            } catch (err) {
                console.error('Verification error:', err);
                if (err.message?.toLowerCase().includes('not successful')) {
                    setStatus('failed');
                } else {
                    setStatus('error');
                    setErrorMsg(err.message || 'Verification failed. Please contact support.');
                }
            }
        };

        verify();
    }, [searchParams, accessToken]);

    // Receipt modal component
    const ReceiptModal = () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl p-8 w-full max-w-md relative">
                <button
                    className="absolute top-3 right-3 text-lg font-bold text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                    onClick={() => setShowReceiptModal(false)}
                    aria-label="Close receipt"
                >
                    &times;
                </button>
                <h2 className="text-xl font-bold mb-4 text-center text-emerald-600">Payment Receipt</h2>
                {txRef && (
                    <div className="bg-muted/60 rounded-xl p-4 mb-4 text-left border border-border/50">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                            Transaction Reference
                        </p>
                        <p className="font-mono text-sm text-foreground break-all">{txRef}</p>
                    </div>
                )}
                {details?.amount && (
                    <div className="flex items-center justify-center gap-2 bg-emerald-500/10 rounded-xl p-4 mb-4 border border-emerald-500/20">
                        <span className="text-muted-foreground text-sm font-medium">Amount Paid</span>
                        <span className="text-xl font-black text-emerald-500">
                            {details.currency || 'ETB'} {Number(details.amount).toLocaleString()}
                        </span>
                    </div>
                )}
                {details?.email && (
                    <div className="mb-2 text-sm text-muted-foreground">Email: <span className="font-mono text-foreground">{details.email}</span></div>
                )}
                {details?.customer_name && (
                    <div className="mb-2 text-sm text-muted-foreground">Customer: <span className="font-mono text-foreground">{details.customer_name}</span></div>
                )}
                {details?.createdAt && (
                    <div className="mb-2 text-sm text-muted-foreground">Date: <span className="font-mono text-foreground">{new Date(details.createdAt).toLocaleString()}</span></div>
                )}
                <div className="mt-6 flex justify-center">
                    <button onClick={() => window.print()} className="flex-1 px-4 py-2 bg-foreground text-background rounded-lg font-bold hover:bg-foreground/90 transition-all flex items-center justify-center gap-2 shadow-lg hover:shadow-xl">
                        <Download className="w-5 h-5" />
                        Save / Print
                    </button>
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (status) {
            case 'loading':
                return (
                    <>
                        <Spinner />
                        <h1 className="text-2xl md:text-3xl font-black text-foreground mb-3 tracking-tight">
                            Verifying Payment...
                        </h1>
                        <p className="text-muted-foreground text-base mb-8 max-w-xs mx-auto">
                            Please wait while we confirm your transaction with Chapa.
                        </p>
                    </>
                );

            case 'success':
                return (
                    <>
                        <SuccessIcon />
                        <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Payment Confirmed
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight">
                            Thank You! 🎉
                        </h1>
                        <p className="text-muted-foreground text-base mb-6 max-w-xs mx-auto leading-relaxed">
                            Your payment was successful. Your order is now being processed and you'll receive a confirmation email shortly.
                        </p>

                        <div className="flex flex-col items-center gap-3 mb-6">
                            <button
                                className="bg-emerald-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-emerald-600 transition-all shadow"
                                onClick={() => setShowReceiptModal(true)}
                            >
                                View Payment Receipt
                            </button>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/products"
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
                            >
                                Continue Shopping
                            </Link>
                            <Link
                                to="/"
                                className="bg-muted text-foreground px-8 py-3 rounded-xl font-bold hover:bg-muted/80 transition-all"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                        {showReceiptModal && <ReceiptModal />}
                    </>
                );

            case 'failed':
                return (
                    <>
                        <FailedIcon />
                        <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Payment Failed
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight">
                            Transaction Failed
                        </h1>
                        <p className="text-muted-foreground text-base mb-6 max-w-xs mx-auto leading-relaxed">
                            Unfortunately we couldn't process your payment. Please try again or use a different payment method.
                        </p>

                        {txRef && (
                            <div className="bg-muted/60 rounded-xl p-4 mb-8 text-left border border-border/50">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">
                                    Transaction Reference
                                </p>
                                <p className="font-mono text-sm text-foreground break-all">{txRef}</p>
                            </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/cart"
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-card"
                            >
                                Return to Cart
                            </Link>
                            <Link
                                to="/"
                                className="bg-muted text-foreground px-8 py-3 rounded-xl font-bold hover:bg-muted/80 transition-all"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    </>
                );

            case 'error':
            default:
                return (
                    <>
                        <div className="relative mx-auto mb-8 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/30">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3 tracking-tight">
                            Something Went Wrong
                        </h1>
                        <p className="text-muted-foreground text-base mb-6 max-w-xs mx-auto leading-relaxed">
                            {errorMsg || 'We could not verify your payment. If money was deducted, please contact our support team.'}
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <Link
                                to="/cart"
                                className="bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-primary/90 hover:shadow-lg hover:-translate-y-0.5 transition-all"
                            >
                                Return to Cart
                            </Link>
                            <Link
                                to="/"
                                className="bg-muted text-foreground px-8 py-3 rounded-xl font-bold hover:bg-muted/80 transition-all"
                            >
                                Go to Homepage
                            </Link>
                        </div>
                    </>
                );
        }
    };

    return (
        <div className="font-sans antialiased bg-background text-foreground min-h-screen flex items-center justify-center px-4">
            {/* Subtle background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div
                    className={`absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-3xl opacity-20 transition-colors duration-1000 ${status === 'success' ? 'bg-emerald-500' :
                            status === 'failed' ? 'bg-red-500' :
                                status === 'loading' ? 'bg-primary' : 'bg-amber-500'
                        }`}
                />
            </div>

            <div className="relative z-10 w-full max-w-md py-10">
                <div className="bg-card rounded-3xl shadow-2xl border border-border/50 p-8 sm:p-12 text-center">
                    {renderContent()}

                    {/* Support footer */}
                    <p className="mt-8 text-[11px] text-muted-foreground">
                        Need help?{' '}
                        <a href="mailto:support@basecode.com" className="text-primary font-semibold hover:underline">
                            Contact Support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TransactionStatusPage;
