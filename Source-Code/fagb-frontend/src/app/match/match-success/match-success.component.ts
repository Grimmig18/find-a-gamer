import { Component, OnInit } from '@angular/core';

import { MatchService } from '../../_services';
import { MatchMakingResponse } from 'src/app/data_objects/matchmakingresponse';

@Component({
  selector: 'app-match-success',
  templateUrl: './match-success.component.html',
  styleUrls: ['./match-success.component.scss']
})
export class MatchSuccessComponent implements OnInit {
  public matchResponse: MatchMakingResponse;

  public constructor(private matchService: MatchService) { }

  public ngOnInit(): void {
    localStorage.removeItem('matchMakingResponse');
    this.matchService.currentMatchMakingResponse.subscribe(data => this.matchResponse = data);
  }
}
