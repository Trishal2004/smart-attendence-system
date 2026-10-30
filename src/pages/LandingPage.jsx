import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { QrCode, ScanFace, Wifi, Shield, Zap, BarChart3, ArrowRight, CheckCircle2, Github, ChevronRight } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const features = [
  {
    icon: QrCode,
    title: 'QR Code Scanning',
    desc: 'Generate dynamic, time-limited QR codes for each session. Students scan to verify presence instantly.',
    color: 'from-blue-500 to-indigo-600',
    bg: 'bg-blue-500/10',
  },
  {
    icon: ScanFace,
    title: 'Face Recognition',
    desc: 'DeepFace-powered biometric verification ensures the right student is marking attendance.',
    color: 'from-purple-500 to-pink-600',
    bg: 'bg-purple-500/10',
  },
  {
    icon: Wifi,
    title: 'Wi-Fi Fingerprinting',
    desc: 'Verify physical presence through Wi-Fi signal analysis. No GPS spoofing possible.',
    color: 'from-emerald-500 to-teal-600',
    bg: 'bg-emerald-500/10',
  },
  {
    icon: Shield,
    title: 'Decision Fusion',
    desc: 'AND-logic gate across all three factors. Attendance is only marked when all verifications pass.',
    color: 'from-orange-500 to-red-600',
    bg: 'bg-orange-500/10',
  },
  {
    icon: Zap,
    title: 'Real-time Processing',
    desc: 'Sub-second verification pipeline. No waiting, no delays, seamless experience.',
    color: 'from-yellow-500 to-amber-600',
    bg: 'bg-yellow-500/10',
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    desc: 'Rich dashboards, heatmaps, and exportable reports for administration and faculty.',
    color: 'from-cyan-500 to-blue-600',
    bg: 'bg-cyan-500/10',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-surface-950 overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-950/80 backdrop-blur-xl border-b border-surface-200 dark:border-surface-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-surface-900 dark:text-white">SmartAttend</span>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link
              to="/auth"
              className="px-5 py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-xl transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-400/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary-500/10 border border-primary-500/20 rounded-full mb-6">
              <span className="w-2 h-2 bg-success-500 rounded-full animate-pulse" />
              <span className="text-xs font-medium text-primary-600 dark:text-primary-400">v2.0 — Triple-Factor Verification</span>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-surface-900 dark:text-white leading-tight max-w-4xl mx-auto"
          >
            Smart Attendance,{' '}
            <span className="bg-gradient-to-r from-primary-500 to-primary-700 bg-clip-text text-transparent">
              Zero Fraud
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-lg md:text-xl text-surface-500 dark:text-surface-400 max-w-2xl mx-auto leading-relaxed"
          >
            Combining QR codes, facial recognition, and Wi-Fi fingerprinting with AND-logic decision fusion for tamper-proof attendance tracking.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/auth"
              className="group flex items-center gap-2 px-8 py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl transition-all shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40"
            >
              Get Started
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#features"
              className="flex items-center gap-2 px-8 py-3.5 border border-surface-300 dark:border-surface-700 text-surface-700 dark:text-surface-300 font-medium rounded-xl hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
            >
              Learn More
              <ChevronRight className="w-4 h-4" />
            </a>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-surface-400"
          >
            {['99.9% Uptime', 'AES-256 Encrypted', 'GDPR Compliant', 'Sub-second Latency'].map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success-500" />
                <span>{badge}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Decision Fusion Visual */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-surface-50 dark:bg-surface-900 rounded-3xl border border-surface-200 dark:border-surface-800 p-8 md:p-12"
          >
            <h3 className="text-center text-sm font-semibold text-primary-500 uppercase tracking-wider mb-2">How It Works</h3>
            <h2 className="text-center text-2xl md:text-3xl font-bold text-surface-900 dark:text-white mb-10">Triple-Factor Decision Fusion</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: QrCode, label: 'QR Code', step: '01', desc: 'Scan session QR', color: 'text-blue-500', border: 'border-blue-500/30' },
                { icon: ScanFace, label: 'Face ID', step: '02', desc: 'Biometric verify', color: 'text-purple-500', border: 'border-purple-500/30' },
                { icon: Wifi, label: 'Wi-Fi Signal', step: '03', desc: 'Location confirm', color: 'text-emerald-500', border: 'border-emerald-500/30' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className={`text-center p-6 rounded-2xl border ${item.border} bg-white dark:bg-surface-800/50`}
                >
                  <div className={`inline-flex w-14 h-14 rounded-2xl bg-surface-100 dark:bg-surface-700/50 items-center justify-center mb-4`}>
                    <item.icon className={`w-7 h-7 ${item.color}`} />
                  </div>
                  <p className="text-xs font-bold text-surface-400 mb-1">STEP {item.step}</p>
                  <h4 className="font-semibold text-surface-900 dark:text-white">{item.label}</h4>
                  <p className="text-sm text-surface-500 mt-1">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex items-center justify-center mt-8 gap-4">
              <div className="flex items-center gap-2 px-6 py-3 bg-success-500/10 border border-success-500/30 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-success-500" />
                <span className="text-sm font-semibold text-success-600 dark:text-success-400">
                  All 3 Pass → Attendance Confirmed
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-surface-900 dark:text-white">
              Enterprise-Grade Features
            </h2>
            <p className="mt-4 text-surface-500 dark:text-surface-400 max-w-xl mx-auto">
              Everything you need for a secure, scalable, and intelligent attendance management system.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className="group p-6 rounded-2xl border border-surface-200 dark:border-surface-800 bg-white dark:bg-surface-900 hover:shadow-lg transition-shadow"
              >
                <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4`}>
                  <f.icon className={`w-6 h-6 bg-gradient-to-br ${f.color} bg-clip-text`} style={{ color: undefined }} />
                </div>
                <h3 className="text-base font-semibold text-surface-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-gradient-to-br from-primary-600 to-primary-800 rounded-3xl p-12 text-center overflow-hidden"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1),transparent)] pointer-events-none" />
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Attendance?
            </h2>
            <p className="text-primary-200 text-lg max-w-lg mx-auto mb-8">
              Join institutions worldwide using Smart Attendance System for fraud-proof, effortless tracking.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-700 font-semibold rounded-xl hover:bg-primary-50 transition-colors shadow-lg"
            >
              Start Free Trial
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-surface-200 dark:border-surface-800 py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary-500" />
            <span className="text-sm font-semibold text-surface-900 dark:text-white">SmartAttend</span>
          </div>
          <p className="text-sm text-surface-500">© 2026 Smart Attendance System. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
