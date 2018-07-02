using System;
using System.Threading.Tasks;

using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.NodeServices;
using Microsoft.AspNetCore.SpaServices.Prerendering;
using Microsoft.Extensions.DependencyInjection;

namespace Logixware.AspNet.Angular.Prerendering
{
	public static class HttpRequestExtensions
	{
		public static async Task<RenderToStringResult> BuildPrerenderAsync(this HttpRequest target, String entryPoint)
		{
			var __NodeServices = target.HttpContext.RequestServices.GetRequiredService<INodeServices>();
			var __HostingEnvironment = target.HttpContext.RequestServices.GetRequiredService<IHostingEnvironment>();

			var __ApplicationBasePath = __HostingEnvironment.ContentRootPath;
			var __RequestFeature = target.HttpContext.Features.Get<IHttpRequestFeature>();
			var __UnencodedPathAndQuery = __RequestFeature.RawTarget;
			var __UnencodedAbsoluteUrl = $"{target.Scheme}://{target.Host}{__UnencodedPathAndQuery}";

			// ** TransferData concept **
			// Here we can pass any Custom Data we want !

			// By default we're passing down Cookies, Headers, Host from the Request object here
			// Add more customData here, add it to the TransferData class
			var __TransferData = new TransferData
			{
				request = target.AbstractRequestInfo(),
				thisCameFromDotNET = "Hi Angular it's asp.net :)"
			};

			//Prerender now needs CancellationToken
			var __CancelSource = new System.Threading.CancellationTokenSource();
			var __CancellationToken = __CancelSource.Token;

			// Prerender / Serialize application (with Universal)
			return await Prerenderer.RenderToString
			(
				"/",
				__NodeServices,
				__CancellationToken,
				new JavaScriptModuleExport(__ApplicationBasePath + entryPoint),
				__UnencodedAbsoluteUrl,
				__UnencodedPathAndQuery,
				__TransferData, // Our simplified Request object & any other CustommData you want to send!
				30000,
				target.PathBase.ToString()
			).ConfigureAwait(false);
		}

		private static ServerRequest AbstractRequestInfo(this HttpRequest target)
		{
			return new ServerRequest
			{
				cookies = target.Cookies,
				headers = target.Headers,
				host = target.Host
			};
		}
	}
}

