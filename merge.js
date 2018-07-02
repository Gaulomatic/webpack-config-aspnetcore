var exec = require("child_process").exec, child;

const __Command = "package-json-merge " +
	"./package.project.json " +
	"./package.angular.json " +
	"./package.angular.universal.json " +
	"./package.app.json " +
	"./package.aspnet.json " +
	"./package.dev.json " +
	"./package.dev.tests.json " +
	"./package.dev.webpack.json " +
	"./package.polyfills.json " +
	"> package.json";

child = exec(__Command,
	function (error, stdout, stderr)
	{
		console.log("stdout: " + stdout);
		console.log("stderr: " + stderr);

		if (error !== null)
		{
		console.log("exec error: " + error);
	}
});