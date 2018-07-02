import { NgModule }                                  from "@angular/core";
import { CommonModule }                              from "@angular/common";
import { BrowserModule, BrowserTransferStateModule } from "@angular/platform-browser";
import { BrowserAnimationsModule }                   from "@angular/platform-browser/animations";

import { TransferHttpCacheModule } from "@nguniversal/common";

import { RootComponent }           from "./Root.component";

// import "style-loader!./../Styles/Styles.scss";

@NgModule
({
	imports:
	[
		/*------------------------------------------------------------------
			Angular
		--------------------------------------------------------------------*/

		CommonModule,

		/*------------------------------------------------------------------
			Server Rendering
		--------------------------------------------------------------------*/

		BrowserModule.withServerTransition({
			appId: "angular-template" // make sure this matches with your Server NgModule
		}),
		TransferHttpCacheModule,
		BrowserTransferStateModule,
	],

	declarations:
	[
		RootComponent
	],

	providers:
	[
	],

	exports:
	[
	],

	bootstrap:
	[
		RootComponent
	]
})
export class RootModuleShared
{
	constructor()
	{
	}
}
