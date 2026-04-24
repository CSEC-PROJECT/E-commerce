import React, { useEffect, useState } from 'react';
import { Download } from 'lucide-react';

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowButton(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowButton(false);
    }
  };

  if (!showButton) return null;
  return (
    <button
      onClick={handleInstall}
      className="fixed bottom-6 left-6 z-[9999] bg-foreground text-background px-6 py-3 rounded-xl font-bold shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2"
    >
      <Download className="w-5 h-5 animate-bounce" />
      Download App
    </button>
  );
}
