import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
    providers: [],
    template: `<div id="offline-container">
                    <div class="title">Offline mode</div>
                    <i class="fa fa-wifi offline-icon"></i>
                    <p>Please check your network connection</p>
                </div>`
})

export class OfflineComponent {
    /**
     * Creates an instance of OfflineComponent.
     * @param {Router} router angular router
     * @memberof OfflineComponent
     */
    constructor(private router: Router) {
        console.log('Offline mode');
    }
}
