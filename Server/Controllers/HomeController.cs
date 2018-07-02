using System;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

using Microsoft.Extensions.Configuration;

using Logixware.AspNet.Angular.ViewModels;
using Logixware.AspNet.Angular.Prerendering;

namespace Logixware.AspNet.Angular.Controllers
{
	public class HomeController : Controller
	{
		private readonly IHostingEnvironment _HostingEnvironment;
		private readonly IConfigurationRoot _ConfigurationRoot;

		public HomeController
		(
			IHostingEnvironment environment,
			IConfigurationRoot configuration
		)
		{
			this._HostingEnvironment = environment;
			this._ConfigurationRoot = configuration;
		}

		[HttpGet]
		public IActionResult IndexWithoutPrerendering()
		{
			var __ViewModel = new HomeViewModel
			{
				WebRoot = this._HostingEnvironment.WebRootPath
			};

			return base.View("Index", __ViewModel);
		}

		[HttpGet]
		public async Task<IActionResult> Index()
		{
			var __PrerenderResult = await base.Request

				.BuildPrerenderAsync(this._ConfigurationRoot["Angular:Prerendering:EntryPoint"])
				.ConfigureAwait(false);

			base.ViewData["SpaHtml"] = __PrerenderResult.Html; // our <app-root /> from Angular
			base.ViewData["Title"] = __PrerenderResult.Globals["title"]; // set our <title> from Angular
			base.ViewData["Styles"] = __PrerenderResult.Globals["styles"]; // put styles in the correct place
			base.ViewData["Scripts"] = __PrerenderResult.Globals["scripts"]; // scripts (that were in our header)
			base.ViewData["Meta"] = __PrerenderResult.Globals["meta"]; // set our <meta> SEO tags
			base.ViewData["Links"] = __PrerenderResult.Globals["links"]; // set our <link rel="canonical"> etc SEO tags
			base.ViewData["TransferData"] = __PrerenderResult.Globals["transferData"]; // our transfer data set to window.TRANSFER_CACHE = {};

//			if (!this._HostingEnvironment.IsDevelopment())
//			{
//				base.ViewData["ServiceWorker"] = "<script>'serviceWorker'in navigator&&navigator.serviceWorker.register('/serviceworker')</script>";
//			}

			var __ViewModel = new HomeViewModel
			{
				WebRoot = this._HostingEnvironment.WebRootPath
			};

			return base.View("Index", __ViewModel);
		}

		[HttpGet]
		[Route ("sitemap.xml")]
		public IActionResult SitemapXml ()
		{
			var xml = "<?xml version=\"1.0\" encoding=\"utf-8\"?>";

			xml += "<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\">";
			xml += "<url>";
			xml += "<loc>http://localhost:4251/home</loc>";
			xml += "<lastmod>" + DateTime.Now.ToString ("yyyy-MM-dd") + "</lastmod>";
			xml += "</url>";
			xml += "<url>";
			xml += "<loc>http://localhost:4251/counter</loc>";
			xml += "<lastmod>" + DateTime.Now.ToString ("yyyy-MM-dd") + "</lastmod>";
			xml += "</url>";
			xml += "</urlset>";

			return base.Content(xml, "text/xml");
		}

		public IActionResult Error ()
		{
			return base.View();
		}
	}
}
