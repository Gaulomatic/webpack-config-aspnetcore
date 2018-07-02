const path = require("path");

const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const CleanWebpackPlugin = require("clean-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");

const ApplicationAlias = (dirname) =>
{
	return {
	}
};

const SharedRules = (isDevelopment) =>
{
	return [

		{
			test: /\.(woff|woff2|ttf|eot)$/,
			loader: "file-loader?name=assets/fonts/[name]-[hash:6].[ext]"
		},

		{
			test: /\.(png|jpg|gif|tif|tiff)$/,
			loader: "file-loader?name=assets/images/[name].[ext]"
		},

		{
			test: /\.(svg)$/,
			loader: "file-loader?name=assets/vector/[name].[ext]"
		},

	];
};

const ApplicationRules = (isDevelopment) =>
{
	return [

		{
			test: /\.(sa|sc|c)ss$/,
			use: [ "to-string-loader", "css-loader", "resolve-url-loader", "sass-loader?sourceMap" ]
		},

		{
			test: /\.less$/,
			use: [ "raw-loader", "css-loader", "resolve-url-loader", "less-loader?sourceMap" ]
		},

		{
			test: /\.ts$/,
			use: isDevelopment ? [ "awesome-typescript-loader?silent=true", "angular2-template-loader", "angular2-router-loader" ] : "@ngtools/webpack"
		},

		{
			test: /\.html$/,
			use: "html-loader?minimize=false"
		},

		{
			// Mark files inside `@angular/core` as using SystemJS style dynamic imports.
			// Removing this will cause deprecation warnings to appear.
			// https://github.com/angular/universal-starter/pull/593
			// https://github.com/angular/angular/issues/21560
			test: /[\/\\]@angular[\/\\]core[\/\\].+\.js$/,
			parser: { system: true }
		},

		...SharedRules(isDevelopment),

	];
};

const VendorRules = (isDevelopment) =>
{
	return [

		{
			test: /\.(sa|sc|c)ss$/,
			use: [ MiniCssExtractPlugin.loader, isDevelopment ? "css-loader" : "css-loader?minimize", "resolve-url-loader", "sass-loader?sourceMap" ]
		},

		{
			test: /\.less$/,
			use: [ MiniCssExtractPlugin.loader, isDevelopment ? "css-loader" : "css-loader?minimize", "resolve-url-loader", "less-loader", ]
		},

		...SharedRules(isDevelopment),

	];
};

const ApplicationBrowserPlugins = (dirname) =>
{
	return [

		new CleanWebpackPlugin
		(
			[
				path.join(dirname, "wwwroot/dist/application"),

				path.join(dirname, "wwwroot/configuration"),
				path.join(dirname, "wwwroot/assets"),
			],
			{ root: dirname }
		),

		new CopyWebpackPlugin
		(
			[
				{
					from: path.join(dirname, "Assets/Images"),
					to: path.join(dirname, "wwwroot/assets/images")
				},
			],
			{
				ignore:
				[
					".DS_Store"
				]
			}
		),

	]
};

const ApplicationServerPlugins = (dirname) =>
{
	return [

		new CleanWebpackPlugin
		(
			[
				path.join(dirname, "Client/dist/application"),

				path.join(dirname, "Client/dist/configuration"),
				path.join(dirname, "Client/dist/assets"),
				path.join(dirname, "Client/dist/styles"),
			],
			{ root: dirname }
		),

		new CopyWebpackPlugin
		(
			[
				{
					from: path.join(dirname, "Assets/Images"),
					to: path.join(dirname, "Client/dist/assets/images")
				},
			],
			{
				ignore:
				[
					".DS_Store"
				]
			}
		),

	]
};

const VendorBrowserPlugins = (dirname) =>
{
	return [

		new CleanWebpackPlugin
		(
			[
				path.join(dirname, "wwwroot/dist/vendor"),
			],
			{ root: dirname }
		),

	]
};

const VendorServerPlugins = (dirname) =>
{
	return [

		new CleanWebpackPlugin
		(
			[
				path.join(dirname, "./Client/dist/vendor"),
			],
			{ root: dirname }
		),

	]
};

const TreeShakableModules =
[

	/*------------------------------------------------------------------
		Angular
	--------------------------------------------------------------------*/

	"@angular/animations",
	"@angular/cdk",
	"@angular/common",
	"@angular/compiler",
	"@angular/core",
	"@angular/flex-layout",
	"@angular/forms",
	"@angular/http",
	"@angular/platform-browser",
	"@angular/platform-browser-dynamic",
	"@angular/router",

	/*------------------------------------------------------------------
		Angular-Abhängigkeiten
	--------------------------------------------------------------------*/

	"rxjs",
	"rxjs-compat",
	"zone.js",

	/*------------------------------------------------------------------
		Angular Universal
	--------------------------------------------------------------------*/

	// "@nguniversal/aspnetcore-engine",
    "@nguniversal/common",
    "@angular/platform-server",
    // "aspnet-prerendering",
    "preboot",

];

const NonTreeShakableModules =
[

	/*------------------------------------------------------------------
		Polyfills
	--------------------------------------------------------------------*/

	"core-js",
	// 'es6-promise',
	// 'es6-shim',
	"event-source-polyfill",
	// "reflect-metadata",
	// "web-animations-js",

];

const AllModules = TreeShakableModules.concat(NonTreeShakableModules);

module.exports =
{
	ApplicationAlias,
	ApplicationRules,
	VendorRules,
	TreeShakableModules,
	NonTreeShakableModules,
	AllModules,
	ApplicationBrowserPlugins,
	ApplicationServerPlugins,
	VendorBrowserPlugins,
	VendorServerPlugins,
};
