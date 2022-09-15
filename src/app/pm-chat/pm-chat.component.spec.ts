import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PmChatComponent } from './pm-chat.component';

describe('PmChatComponent', () => {
  let component: PmChatComponent;
  let fixture: ComponentFixture<PmChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PmChatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PmChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
