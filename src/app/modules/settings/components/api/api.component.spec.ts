/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ApiComponent } from './api.component';

describe('ApiComponent', () => {
    let component: ApiComponent;
    let fixture: ComponentFixture<ApiComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ApiComponent],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ApiComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
