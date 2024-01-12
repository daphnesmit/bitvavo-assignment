import MarketIcons from '../../assets/market-icons.svg';

interface MarketIconProps {
  market: string;
  size?: number;
}
const MarketIcon = ({ market, size = 24 }: MarketIconProps) => (
  <svg viewBox="0 0 24 24" width={size} height={size}>
    <use xlinkHref={`${MarketIcons}#${market}`} href={`${MarketIcons}#${market}`} />
  </svg>
);

export default MarketIcon;
