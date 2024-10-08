import nextra from "nextra";

/** @type {import('next').NextConfig} */
const NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "cdn.sanity.io",
				port: "",
			},
		],
	},
	eslint: {
		ignoreDuringBuilds: true,
	},
	cacheMaxMemorySize: 0,
	poweredByHeader: false
};

const withNextra = nextra({
	theme: "nextra-theme-docs",
	themeConfig: "./theme.config.tsx",
});

export default withNextra(NextConfig);
