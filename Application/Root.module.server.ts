import { NgModule }                  from "@angular/core";
import { ServerModule }              from "@angular/platform-server";
import { NoopAnimationsModule }      from "@angular/platform-browser/animations";
import { ServerTransferStateModule } from "@angular/platform-server";

import { PrebootModule } from "preboot";

import { RootModuleShared } from "./Root.module";
import { RootComponent }    from "./Root.component";

@NgModule
({
	imports:
	[
		// Our Common AppModule
		RootModuleShared,

		ServerModule,
		PrebootModule.withConfig({appRoot: "app-root"}),
		NoopAnimationsModule,

		// HttpTransferCacheModule still needs fixes for 5.0
		//   Leave this commented out for now, as it breaks Server-renders
		//   Looking into fixes for this! - @MarkPieszak
		// ServerTransferStateModule // <-- broken for the time-being with ASP.NET
	],

	bootstrap:
	[
		RootComponent
	],
})
export class RootModule
{
}
