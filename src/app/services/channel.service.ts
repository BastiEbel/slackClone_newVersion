import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChannelService {
  public data$: BehaviorSubject<any> = new BehaviorSubject({
    channelTitle: 'Developer Akademie',
    channelId: 'UKux5OqbjK90J4llvTAj',
  });

  constructor() {}
}
