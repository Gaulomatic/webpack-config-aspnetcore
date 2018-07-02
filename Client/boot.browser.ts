import "./polyfills/polyfills.browser";

import { enableProdMode }         from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { RootModule }             from "../Application/Root.module.browser";

console.log("boot.browser is here");

// // Enable either Hot Module Reloading or production mode
if (module["hot"])
{
	module["hot"].accept();
	module["hot"].dispose(() =>
	{
		// modulePromise.then(appModule => appModule.destroy());

		// Fuse hack
		const __RootElementTagName = "app";
		const __OldRootElement = document.querySelector(__RootElementTagName);

		if (__OldRootElement != null && __OldRootElement.parentElement != null)
		{
			__OldRootElement.parentElement.removeChild(__OldRootElement);
		}

		// Reload
		modulePromise.then(appModule => appModule.destroy());

	});
}
else
{
	enableProdMode();
}

// const modulePromise = platformBrowserDynamic().bootstrapModule(AppModule);
const modulePromise = platformBrowserDynamic().bootstrapModule(RootModule);
