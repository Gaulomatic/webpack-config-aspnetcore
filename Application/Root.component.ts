import { Component } from "@angular/core";

@Component
({
	selector: "app-root",
	templateUrl: "./Root.Component.html",
	styleUrls: [ "./Root.Component.scss" ]
})
export class RootComponent
{
	public Text: string = "Hello from Angular";

	public OnButtonClick(e): void
	{
		this.Text = "Make it so, Number One!";
	}
}

