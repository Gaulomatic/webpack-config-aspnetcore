const path = require("path");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const merge = require("webpack-merge");
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

		resolve:
		{
			extensions: [".js"]
		},

		module:
		{
			rules: Shared.VendorRules(isDevelopment),
		},

		output:
		{
			// publicPath: "dist/",
			filename: "[name].js",
			library: "[name]_[hash]"
		},

		plugins:
		[
			// new webpack.ProvidePlugin({ $: "jquery", jQuery: "jquery" }), // Maps these identifiers to the jQuery package (because Bootstrap expects it to be a global variable)
			new webpack.ContextReplacementPlugin(/\@angular\b.*\b(bundles|linker)/, path.join(dirname, "Client")), // Workaround for https://github.com/angular/angular/issues/11580
			new webpack.ContextReplacementPlugin(/(.+)?angular(\\|\/)core(.+)?/, path.join(dirname, "Client")), // Workaround for https://github.com/angular/angular/issues/14898
			new webpack.IgnorePlugin(/^vertx$/) // Workaround for https://github.com/stefanpenner/es6-promise/issues/100
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
		entry:
		{
			// To keep development builds fast, include all vendor dependencies in the vendor bundle.
			// But for production builds, leave the tree-shakable ones out so the AOT compiler can produce a smaller bundle.
			vendor: isDevelopment ? Shared.AllModules : Shared.NonTreeShakableModules
		},

		output:
		{
			path: path.join(dirname, "wwwroot", "dist", "vendor")
		},

		plugins: Shared.VendorBrowserPlugins(dirname)

			.concat
			([
				new MiniCssExtractPlugin
				({
					filename: "vendor.css",
				}),

				new webpack.DllPlugin
				({
					path: path.join(dirname, "wwwroot", "dist", "vendor", "[name]-manifest.json"),
					name: "[name]_[hash]"
				})
			])

			.concat(isDevelopment ?
			[
			] :
			[
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
		resolve: { mainFields: [ "main" ] },

		entry:
		{
			vendor: Shared.AllModules.concat([ "aspnet-prerendering" ])
		},

		output:
		{
			path: path.join(dirname, "Client", "dist", "vendor"),
			libraryTarget: "commonjs2",
		},

		module:
		{
			rules: Shared.VendorRules(isDevelopment),
		},

		plugins: Shared.VendorServerPlugins(dirname)

			.concat
			([
				new webpack.DllPlugin
				({
					path: path.join(dirname, "Client", "dist", "vendor", "[name]-manifest.json"),
					name: "[name]_[hash]"
				})
			])

			.concat(isDevelopment ?
			[
			] :
			[
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
