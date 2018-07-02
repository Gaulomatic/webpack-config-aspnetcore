const path = require("path");
const webpack = require("webpack");
const merge = require("webpack-merge");
const AngularCompilerPlugin = require("@ngtools/webpack").AngularCompilerPlugin;
const CheckerPlugin = require("awesome-typescript-loader").CheckerPlugin;
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer").BundleAnalyzerPlugin;
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

const Shared = require("./webpack.config.shared");

/*****************************
 * Start | SHARED
 ****************************/
const GetSharedConfig = (dirname, isDevelopment) =>
{
	return {
		mode: isDevelopment ? "development" : "production",
		stats: { modules: false },
		context: dirname,

		resolve:
		{
			extensions: [ ".js", ".ts", ".scss", "svg", "jpg" ],
			alias: Shared.ApplicationAlias(dirname),
			modules:
			[
				// Make ~ availible to root of application as well as "node_modules".
				// Defaults to "node_modules" alone.
				path.resolve(dirname),
				"node_modules"
			],
		},

		output:
		{
			filename: "[name].js",
			publicPath: "dist/application/" // Webpack dev middleware, if enabled, handles requests for this URL prefix
		},

		module:
		{
			rules: Shared.ApplicationRules(isDevelopment),
		},

		plugins:
		[
			new CheckerPlugin(),
		]
	};
};
/*****************************
 * End | SHARED
 ****************************/

/*****************************
 * Start | BROWSER
 ****************************/
const GetBrowserConfig = (dirname, isDevelopment) =>
{
	return {
		devtool: isDevelopment ? "cheap-eval-source-map" : false,
		node: { fs: "empty" },

		entry:
		{
			"main-client": path.join(dirname, "Client/boot.browser.ts")
		},

		output:
		{
			path: path.join(dirname, "wwwroot/dist/application")
		},

		plugins: Shared.ApplicationBrowserPlugins(dirname)

			.concat
			([
				new webpack.DllReferencePlugin
				({
					context: dirname,
					manifest: require(path.join(dirname, "wwwroot/dist/vendor/vendor-manifest.json"))
				})
			])

			.concat(isDevelopment ?
			[
				// new webpack.SourceMapDevToolPlugin
				// ({
				// 	filename: "[file].map", // Remove this line if you prefer inline source maps
				// 	moduleFilenameTemplate: path.relative(clientBundleOutputDir, "[resourcePath]") // Point sourcemap entries to the original file locations on disk
				// })
			] :
			[
				// Plugins that apply in production builds only

				// new BundleAnalyzerPlugin(),

				new AngularCompilerPlugin
				({
					mainPath: path.join(dirname, "Client/boot.browser.ts"),
					tsConfigPath: path.join(dirname, "tsconfig.json"),
					entryModule: path.join(dirname, "Application/Root.module.browser#RootModule"),
					exclude: [ dirname + "/**/*.server.ts"],
					sourceMap: true
				})
			]),

		optimization:
		{
			minimizer:
			[
			].concat(isDevelopment ?
			[
			] :
			[
				// we specify a custom UglifyJsPlugin here to get source maps in production
				new UglifyJsPlugin
				({
					cache: true,
					parallel: true,
					uglifyOptions:
					{
						compress: false,
						ecma: 6,
						mangle: true,
						keep_classnames: true,
						keep_fnames: true
					},
					sourceMap: true
				})
			])
		}
	};
};
/*****************************
 * End | BROWSER
 ****************************/

const GetServerConfig = (dirname, isDevelopment) =>
{
	return {
		target: "node",

		// switch to "inline-source-map" if you want to debug the TS during SSR
		devtool: isDevelopment ? "cheap-eval-source-map" : false,

		// resolve: { mainFields: ["main"] },

		entry:
		{
			"main-server": isDevelopment ? path.join(dirname, "Client/boot.server.ts") : path.join(dirname, "Client/boot.server.PRODUCTION.ts")
		},

		plugins: Shared.ApplicationServerPlugins(dirname)

			.concat
			([
				new webpack.DllReferencePlugin
				({
					context: dirname,
					manifest: require(path.join(dirname, "Client/dist/vendor/vendor-manifest.json")),
					sourceType: "commonjs2",
					name: "./../vendor/vendor"
				})
			])

			.concat(isDevelopment ?
			[
				new webpack.ContextReplacementPlugin
				(
					// fixes WARNING Critical dependency: the request of a dependency is an expression
					/(.+)?angular(\\|\/)core(.+)?/,
					path.join(dirname, "src"), // location of your src
					{} // a map of your routes
				),

				new webpack.ContextReplacementPlugin
				(
					// fixes WARNING Critical dependency: the request of a dependency is an expression
					/(.+)?express(\\|\/)(.+)?/,
					path.join(dirname, "src"), {}
				)
			] :
			[
				// Plugins that apply in production builds only

				// new BundleAnalyzerPlugin(),

				new AngularCompilerPlugin
				({
					mainPath: path.join(dirname, "Client/boot.server.PRODUCTION.ts"),
					tsConfigPath: path.join(dirname, "tsconfig.json"),
					entryModule: path.join(dirname, "Application/Root.module.server#RootModule"),
					exclude: [ dirname + "/**/*.browser.ts" ],
					platform: 1
				})
			]),

		output:
		{
			libraryTarget: "commonjs",
			path: path.join(dirname, "Client/dist/application")
		},

		optimization:
		{
			minimizer:
			[
			].concat(isDevelopment ?
			[
			] :
			[
				// we specify a custom UglifyJsPlugin here to get source maps in production
				new UglifyJsPlugin
				({
					cache: true,
					parallel: true,
					uglifyOptions:
					{
						compress: false,
						ecma: 6,
						mangle: true,
						keep_classnames: true,
						keep_fnames: true
					},
					sourceMap: true
				})
			])
		}
	};
};

module.exports = (env) =>
{
	const dirname = __dirname;
	const isDevelopment = !(env && env.prod);

	console.log(`env = ${JSON.stringify(env)}`);

	const SHARED_CONFIG = GetSharedConfig(dirname, isDevelopment);
	const BROWSER_CONFIG = merge(SHARED_CONFIG, GetBrowserConfig(dirname, isDevelopment));
	const SERVER_CONFIG = merge(SHARED_CONFIG, GetServerConfig(dirname, isDevelopment));

	return [ BROWSER_CONFIG, SERVER_CONFIG ];
};
