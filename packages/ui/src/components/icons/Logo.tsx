export function MmaiMark() {
	return (
		<>
			<rect width="512" height="512" fill="#0B1220" />
			<g transform="translate(256 256) scale(1.7) translate(-130.285 -75.745)">
				<g transform="translate(-585 0)" fill="#0066FF">
					<path d="M697.51,14.3c-7.57,20.26-15.24,40.5-22.96,60.72c-27.73-0.08-33.16-0.05-59.5-0.03l10.01-25.44c13.18,0.1,7.8-0.03,23.46,0.05c6.6-17.34,12.54-32.78,18.84-49.59h24.76L697.51,14.3z" />
					<path d="M762.82,92.85c-4.1-10.53-26.82-69.08-36.05-92.84h-34.66l5.38,14.29l0.03,0.08l13.65,36.12h-0.08c5.38,14.11,10.74,28.24,16.08,42.38c0,0,0,0,0,0C742.29,92.88,755.11,92.88,762.82,92.85c3.88,9.97,7.78,19.94,11.66,29.94h-35.95c0,0,0,0,0,0c3.64,9.54,7.25,19.1,10.87,28.65c12.09,0.04,24.16,0,36.25,0.04c-3.72-9.56-7.46-19.14-11.18-28.7C770.6,112.79,766.71,102.82,762.82,92.85z" />
					<path d="M727.19,92.88c-42.2,0.05-102.27,0.05-119.19,0.07c0,0-20.99,53.34-23,58.49c12.32,0.05,22.38,0,34.7,0.02c3.72-10.31,7.62-18.3,11.27-28.65c11.95-0.07,68.12-0.05,107.56-0.02h0C734.76,112.82,730.97,102.84,727.19,92.88C727.19,92.88,727.19,92.88,727.19,92.88z" />
					<path d="M814.75,72.93c-5.49-14.11-19.09-23.4-34.23-23.4h-10.09c3.89,10.25,8.38,21.46,12.27,31.71h35.52C817.26,78.79,815.7,75.38,814.75,72.93z" />
					<path d="M800.21,29.67c-3.85-9.9-7.7-19.78-11.55-29.66h-35.22c3.75,9.88,7.5,19.77,11.25,29.66H800.21z" />
					<path d="M818.21,81.24h-35.52c8.88,23.4,17.76,46.8,26.63,70.21c12.08,0.04,24.17-0.01,36.25,0.03C836.45,128.07,827.33,104.66,818.21,81.24z" />
				</g>
			</g>
		</>
	);
}

export const Logo = ({
	className,
	showVersion,
	showBeta,
	white,
	hideLogoName,
	viewBoxDimensions = "0 0 600 130",
	style,
}: {
	className?: string;
	showVersion?: boolean;
	showBeta?: boolean;
	white?: boolean;
	hideLogoName?: boolean;
	style?: React.CSSProperties;
	viewBoxDimensions?: `${string} ${string} ${string} ${string}`;
}) => {
	const dimensions = viewBoxDimensions.trim().split(/\s+/);
	const width = dimensions[2] ?? "600";
	const height = dimensions[3] ?? "130";

	return (
		<div className="flex items-center">
			<svg
				viewBox={hideLogoName ? "0 0 512 512" : viewBoxDimensions}
				xmlns="http://www.w3.org/2000/svg"
				preserveAspectRatio="xMidYMid meet"
				fill="none"
				style={style}
				aria-label="Mover Marketing AI Logo"
				className={className}
				role="img"
			>
				{hideLogoName ? (
					<MmaiMark />
				) : (
					<image
						href="/logo-email.png"
						width={width}
						height={height}
						preserveAspectRatio="xMidYMid meet"
					/>
				)}
			</svg>
			{showVersion && (
				<span
					className={`text-[10px] font-medium ${
						white ? "text-white" : "text-gray-1"
					}`}
				>
					v{process.env.appVersion}
				</span>
			)}
			{showBeta && (
				<span
					className={`text-[10px] font-medium min-w-[52px] ${
						white ? "text-white" : "text-gray-1"
					}`}
				>
					Beta v{process.env.appVersion}
				</span>
			)}
		</div>
	);
};
