import { MmaiMark } from "./icons/Logo";

export const LogoSpinner = ({ className }: { className: string }) => {
	return (
		<svg
			className={className}
			xmlns="http://www.w3.org/2000/svg"
			fill="none"
			viewBox="0 0 512 512"
			aria-label="Mover Marketing AI loading"
			role="img"
		>
			<MmaiMark />
		</svg>
	);
};
