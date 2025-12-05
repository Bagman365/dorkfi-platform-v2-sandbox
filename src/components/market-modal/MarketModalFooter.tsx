
import { ExternalLink, FileText, Shield } from 'lucide-react';

export const MarketModalFooter = () => {
  return (
    <div className="px-6 py-4 border-t border-border/30 bg-muted/20">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <a 
            href="#"
            className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Full Market Page</span>
          </a>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Shield className="w-3.5 h-3.5" />
          <span>All actions execute on-chain via smart contract</span>
        </div>
      </div>
    </div>
  );
};
