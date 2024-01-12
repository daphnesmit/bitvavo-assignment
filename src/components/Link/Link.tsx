import { isExternalLink } from '../../utils/isExternalLink';

interface LinkProps {
  label: string;
  href: string;
}
export const Link = ({ href, label }: LinkProps) => {
  const rel = isExternalLink(href) ? 'noopener noreferrer' : undefined;
  const target = isExternalLink(href) ? '_blank' : undefined;

  return (
    <a rel={rel} target={target} href={href} className="block text-sky-950 hover:underline">
      <div className="flex items-center">
        <span className="text-semibold pr-2">{label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path
            d="m9 4 3.6 3.6L9 11.2M12.6 7.6H3"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
          ></path>
        </svg>
      </div>
    </a>
  );
};
