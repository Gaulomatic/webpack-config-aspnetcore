using System;

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.SpaServices.Webpack;

using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

using Microsoft.Net.Http.Headers;

namespace Logixware.AspNet.Angular
{
	public class Startup
	{
		private readonly IHostingEnvironment _HostingEnvironment;

		public IConfigurationRoot Configuration { get; }

		public Startup (IHostingEnvironment env)
		{
			this._HostingEnvironment = env;

			var builder = new ConfigurationBuilder ()
				.SetBasePath (env.ContentRootPath)
				.AddJsonFile ("appsettings.json", optional : true, reloadOnChange : true)
				.AddJsonFile ($"appsettings.{env.EnvironmentName}.json", optional : true)
				.AddEnvironmentVariables ();

			if (env.IsDevelopment())
			{
				// For more details on using the user secret store see https://go.microsoft.com/fwlink/?LinkID=532709
				// builder.AddUserSecrets<Startup>();
			}

			this.Configuration = builder.Build();
		}

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices (IServiceCollection services)
		{
			// Add framework services.
			services.AddMvc();
			services.AddNodeServices();
			services.AddHttpContextAccessor();
			services.AddSingleton(this.Configuration);
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure (IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			loggerFactory.AddConsole(this.Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();

			app.UseStaticFiles();

//			// wwwroot
//			app.UseFileServer();
//
//			// node_modules
//			app.UseFileServer
//			(
//				new FileServerOptions()
//				{
//					FileProvider = new PhysicalFileProvider(Path.Combine(env.ContentRootPath, "node_modules")),
//					RequestPath = "/node_modules",
//					EnableDirectoryBrowsing = true,
//					EnableDefaultFiles = false
//				}
//			);

//			app.UseStaticFiles(new StaticFileOptions
//			{
//				OnPrepareResponse = c =>
//				{
//					//Do not add cache to json files. We need to have new versions when we add new translations.
//					if (!c.Context.Request.Path.Value.Contains(".json"))
//					{
//						c.Context.Response.GetTypedHeaders().CacheControl = new CacheControlHeaderValue()
//						{
//							MaxAge = TimeSpan.FromDays(30) // Cache everything except json for 30 days
//						};
//					}
//					else
//					{
//						c.Context.Response.GetTypedHeaders().CacheControl = new CacheControlHeaderValue()
//						{
//							MaxAge = TimeSpan.FromMinutes(15) // Cache json for 15 minutes
//						};
//					}
//				}
//			});

			if (env.IsDevelopment())
			{
				app.UseDeveloperExceptionPage();

				app.UseWebpackDevMiddleware(new WebpackDevMiddlewareOptions
				{
					HotModuleReplacement = true,
					HotModuleReplacementEndpoint = "/dist/"
//					HotModuleReplacementEndpoint = "/dist/__webpack_hmr",
//					ProjectPath = this._HostingEnvironment.ContentRootPath,
//					ConfigFile = Path.Combine(this._HostingEnvironment.ContentRootPath, "webpack.config.js")
				});

				app.MapWhen (x => !x.Request.Path.Value.StartsWith("/fhlsdkjfhsldkjfhlsdk", StringComparison.OrdinalIgnoreCase), builder =>
				{
					builder.UseMvc
					(
						routes =>
						{
							routes.MapSpaFallbackRoute
							(
								// ReSharper disable once ArgumentsStyleStringLiteral
								name: "spa-fallback",
								// ReSharper disable once ArgumentsStyleOther
								defaults : new { controller = "Home", action = "Index" }
							);
						}
					);
				});
			}
			else
			{
				app.UseDeveloperExceptionPage();

				app.UseMvc(routes =>
				{
					routes.MapRoute(
						// ReSharper disable once ArgumentsStyleStringLiteral
						name: "default",
						// ReSharper disable once ArgumentsStyleStringLiteral
						template: "{controller=Home}/{action=Index}/{id?}");

					routes.MapRoute(
						"Sitemap",
						"sitemap.xml",
						new { controller = "Home", action = "SitemapXml" });

					routes.MapSpaFallbackRoute(
						// ReSharper disable once ArgumentsStyleStringLiteral
						name: "spa-fallback",
						// ReSharper disable once ArgumentsStyleOther
						defaults : new { controller = "Home", action = "Index" });
				});

				app.UseExceptionHandler ("/Home/Error");
			}
		}
	}
}
