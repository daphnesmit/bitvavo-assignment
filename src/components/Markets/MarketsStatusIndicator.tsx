import { READY_STATE } from '../../hooks/subscriptions/UseSocket/UseSocket';

enum ERROR_STATE {
  Error = 4,
}
interface MarketsStatusIndicatorProps {
  statusCode: READY_STATE | ERROR_STATE;
}
const MarketsStatusIndicator = ({ statusCode }: MarketsStatusIndicatorProps) => {
  const statusToDesc = {
    0: 'Connecting',
    1: 'Connected',
    2: 'Disconnecting',
    3: 'Disconnected',
    4: 'Error',
  };
  const statusToColor = {
    0: 'bg-green-200',
    1: 'bg-green-500',
    2: 'bg-gray-400',
    3: 'bg-gray-600',
    4: 'bg-red-500',
  };
  return (
    <span
      aria-live="assertive"
      className={`fixed right-2 top-5 me-5 flex items-center text-sm font-medium`}
    >
      <span
        className={`${statusToColor[statusCode]} me-1.5 flex h-2.5  w-2.5 flex-shrink-0 rounded-full`}
      ></span>
      {statusToDesc[statusCode]}
    </span>
  );
};
export { MarketsStatusIndicator };
