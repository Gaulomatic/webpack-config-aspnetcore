using System;
using System.IO;
using System.Reflection;
using System.Diagnostics;

using Microsoft.AspNetCore.Hosting;

namespace Logixware.AspNet.Angular
{
	public class Program
	{
		public static void Main(String[] args)
		{
			var __Assembly = Assembly.GetExecutingAssembly();
			var __FileVersionInfo = FileVersionInfo.GetVersionInfo(__Assembly.Location);
			var __Version = __FileVersionInfo.FileVersion;
			var __CopyRight = __FileVersionInfo.LegalCopyright;
			var __ProductName = __FileVersionInfo.FileDescription;

			Console.Title = __FileVersionInfo.FileDescription;

			Console.WriteLine($"{__ProductName}, Version {__Version}");
			Console.WriteLine(__CopyRight);
			Console.WriteLine(String.Empty);
			Console.WriteLine($"Staring with PID {Process.GetCurrentProcess().Id}...");
			Console.WriteLine(String.Empty);

			var host = new WebHostBuilder()
				.UseKestrel()
				.UseUrls("http://*:8002")
				.UseContentRoot(Directory.GetCurrentDirectory())
				.UseIISIntegration()
				.UseStartup<Startup>()
				.Build();

			host.Run();
		}
	}
}
