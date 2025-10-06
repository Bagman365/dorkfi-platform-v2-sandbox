
import DorkFiButton from "@/components/ui/DorkFiButton";

interface MarketsTableActionsProps {
  asset: string;
  hasDeposit: boolean;
  onDepositClick: (asset: string) => void;
  onWithdrawClick: (asset: string) => void;
  onBorrowClick: (asset: string) => void;
}

const MarketsTableActions = ({ asset, hasDeposit, onDepositClick, onWithdrawClick, onBorrowClick }: MarketsTableActionsProps) => {
  return (
    <div className="flex space-x-2">
      <DorkFiButton
        variant="secondary"
        onClick={(e) => {
          e.stopPropagation();
          onDepositClick(asset);
        }}
      >
        Deposit
      </DorkFiButton>
      {hasDeposit && (
        <DorkFiButton
          variant="danger-outline"
          onClick={(e) => {
            e.stopPropagation();
            onWithdrawClick(asset);
          }}
        >
          Withdraw
        </DorkFiButton>
      )}
      <DorkFiButton
        variant="borrow-outline"
        onClick={(e) => {
          e.stopPropagation();
          onBorrowClick(asset);
        }}
      >
        Borrow
      </DorkFiButton>
    </div>
  );
};

export default MarketsTableActions;
