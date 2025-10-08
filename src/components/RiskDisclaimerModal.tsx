import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Checkbox } from "@/components/ui/checkbox";

interface RiskDisclaimerModalProps {
  isOpen: boolean;
  onAcknowledge: (doNotShowAgain: boolean) => void;
}

const RiskDisclaimerModal = ({ isOpen, onAcknowledge }: RiskDisclaimerModalProps) => {
  const [doNotShowAgain, setDoNotShowAgain] = useState(true);

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent className="max-w-2xl border-amber-500/20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-2xl text-amber-500 mb-2">
            ⚠️ Important Notice
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-300 space-y-4 text-base leading-relaxed">
            <p>
              DorkFi is a decentralized lending protocol. By interacting with these markets, 
              you acknowledge that you are using the platform at your own risk.
            </p>
            <p>
              Borrowing and lending digital assets involve significant financial risks, 
              including loss of funds through liquidation, smart contract vulnerabilities, 
              and market volatility. DorkFi is non-custodial and operates without guarantees 
              or insurance.
            </p>
            <p className="font-semibold text-amber-400">
              By proceeding, you agree that you understand these risks and assume full 
              responsibility for your actions.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="flex items-center gap-3 px-6 pb-4">
          <Checkbox
            id="do-not-show"
            checked={doNotShowAgain}
            onCheckedChange={(checked) => setDoNotShowAgain(checked as boolean)}
          />
          <label
            htmlFor="do-not-show"
            className="text-sm text-slate-400 cursor-pointer select-none"
          >
            Do not show this message again
          </label>
        </div>

        <AlertDialogFooter>
          <AlertDialogAction
            onClick={() => onAcknowledge(doNotShowAgain)}
            className="w-full bg-gradient-to-r from-ocean-teal to-ocean-teal/80 hover:from-ocean-teal/90 hover:to-ocean-teal/70 text-white font-semibold py-3 shadow-lg shadow-ocean-teal/20"
          >
            I Acknowledge the Risks – Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default RiskDisclaimerModal;
