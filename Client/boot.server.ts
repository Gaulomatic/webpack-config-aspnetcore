import "zone.js/dist/zone-node";
import "./polyfills/polyfills.server";

import { enableProdMode }                                           from "@angular/core";
import { createServerRenderer }                                     from "aspnet-prerendering";
import { ngAspnetCoreEngine, IEngineOptions, createTransferScript } from "@nguniversal/aspnetcore-engine";

import { RootModule }                                               from "../Application/Root.module.server";

enableProdMode();

export default createServerRenderer((params) =>
{
	// Platform-server provider configuration
	const setupOptions: IEngineOptions =
	{
		appSelector: "<app-root></app-root>",
		ngModule: RootModule,
		request: params,
		providers:
		[
			// Optional - Any other Server providers you want to pass
			// (remember you"ll have to provide them for the Browser as well)
		]
	};

	return ngAspnetCoreEngine(setupOptions).then(response =>
	{
		// Apply your transferData to response.globals
		response.globals.transferData = createTransferScript({
			someData: "Transfer this to the client on the window.TRANSFER_CACHE {} object",
			fromDotnet: params.data.thisCameFromDotNET // example of data coming from dotnet, in HomeController
		});

		return ({
			html: response.html, // our <app-root> serialized
			globals: response.globals // all of our styles/scripts/meta-tags/link-tags for aspnet to serve up
		});
	});
});
