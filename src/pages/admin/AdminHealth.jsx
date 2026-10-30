import Navbar from '../../components/Navbar';
import { motion } from 'framer-motion';
import { Activity, Clock, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { mockSystemHealth } from '../../data/mockData';

export default function AdminHealth() {
  const labels = {
    qrService: { name: 'QR Code Service', desc: 'Handles dynamic QR code generation and validation' },
    faceRecognition: { name: 'Face Recognition API', desc: 'DeepFace-powered biometric verification engine' },
    wifiFingerprint: { name: 'Wi-Fi Fingerprint Service', desc: 'RSSI signal analysis for location verification' },
    database: { name: 'Database Cluster', desc: 'Primary PostgreSQL cluster with read replicas' },
    apiGateway: { name: 'API Gateway', desc: 'Load balancer and request routing layer' },
  };

  const StatusIcon = ({ status }) => {
    if (status === 'operational') return <CheckCircle2 className="w-5 h-5 text-success-500" />;
    if (status === 'degraded') return <AlertTriangle className="w-5 h-5 text-warning-400" />;
    return <XCircle className="w-5 h-5 text-danger-500" />;
  };

  return (
    <div>
      <Navbar title="System Health" />
      <div className="p-6 space-y-6">
        {/* Overall status */}
        <div className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6">
          <div className="flex items-center gap-3 mb-2">
            <Activity className="w-5 h-5 text-success-500" />
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">System Status</h2>
          </div>
          <p className="text-sm text-surface-500">All core services are operational. Wi-Fi fingerprinting is experiencing elevated latency.</p>
        </div>

        {/* Services */}
        <div className="grid gap-4">
          {Object.entries(mockSystemHealth).map(([key, val], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="bg-white dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <StatusIcon status={val.status} />
                  <div>
                    <h3 className="font-semibold text-surface-900 dark:text-white">{labels[key].name}</h3>
                    <p className="text-sm text-surface-500 mt-0.5">{labels[key].desc}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="text-xs text-surface-400">Status</p>
                    <p className={`font-medium capitalize ${val.status === 'operational' ? 'text-success-500' : val.status === 'degraded' ? 'text-warning-400' : 'text-danger-500'}`}>
                      {val.status}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-surface-400">Uptime</p>
                    <p className="font-medium text-surface-900 dark:text-white">{val.uptime}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-surface-400 flex items-center gap-1"><Clock className="w-3 h-3" />Latency</p>
                    <p className="font-medium text-surface-900 dark:text-white">{val.latency}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
