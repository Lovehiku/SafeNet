import { motion } from 'framer-motion';
import { AlertItem as AlertItemType } from '../types';
import { Badge } from './Badge';

interface Props {
  alert: AlertItemType;
  onClick: () => void;
}

export function AlertItem({ alert, onClick }: Props) {
  return (
    <motion.button
      onClick={onClick}
      className="w-full text-left card-surface p-4 hover:border-primary-400/50 transition-colors"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-3">
            <h4 className="font-semibold text-white">{alert.title}</h4>
            <Badge label={alert.severity.toUpperCase()} severity={alert.severity} />
          </div>
          <p className="text-muted text-sm mt-1">{alert.summary}</p>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-muted">
            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">{alert.source}</span>
            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10">
              {new Date(alert.date).toLocaleString()}
            </span>
            <span className="px-2 py-1 rounded-full bg-white/5 border border-white/10 capitalize">{alert.status}</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
