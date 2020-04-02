import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

import { AuthenticationService } from '../_services';
import { CookieService } from 'ngx-cookie-service';

import { MatchMakingRequest } from '../data_objects/matchmakingrequest';
import { PublicUser } from '../data_objects/publicuser';
import { Game } from '../data_objects/game';

import { NotifyMatch } from '../data_objects/notifymatch';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private urlS: string = 'http://localhost:3000/matchmakingrequestendpoint';
  private urlN: string = 'http://localhost:3000/notifymatchendpoint';
  private currentGamer: PublicUser;

  // Users
  private currentMatchUsersSubject: BehaviorSubject<PublicUser[]>;
  public currentMatchUsers: Observable<PublicUser[]>;

  // Game
  private currentMatchGameSubject: BehaviorSubject<Game>;
  public currentMatchGame: Observable<Game>;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
    private authenticationService: AuthenticationService
  ) {
    this.currentMatchUsersSubject = new BehaviorSubject<PublicUser[]>(null);
    this.currentMatchUsers = this.currentMatchUsersSubject.asObservable();

    this.currentMatchGameSubject = new BehaviorSubject<Game>(null);
    this.currentMatchGame = this.currentMatchGameSubject.asObservable();

    this.authenticationService.currentGamer.subscribe(gamer => this.currentGamer = gamer);
  }

  searchMatch(gameData, filterData): Observable<any> {
    let sessionId = this.cookieService.get('gamer');
    let requestMatch = new MatchMakingRequest(
      sessionId,
      this.currentGamer.user_id,
      //first game_id of string array as num
      +gameData.game.value[1],
      filterData.playerParty.value,
      filterData.playerSearch.value,
      // String to bool
      filterData.playstyle.value == "true" ? true : false
    );
    console.log(requestMatch);
    return this.http.post<any>(this.urlS, requestMatch);
  }

  notifyMatch(request_id): Observable<any> {
    let notifyMatch = new NotifyMatch(request_id);
    return this.http.post<any>(this.urlN, notifyMatch)
      .pipe(map(data => {
        if (data && !!data.users) {
          let matchUseres: PublicUser[] = [];
          for (let i = 0; i < data.users.length; i++) {
            matchUseres.push(new PublicUser(
              data.users[i].user_id,
              data.users[i].nickname,
              data.users[i].discord_tag,
              data.users[i].cake_day,
              data.users[i].region,
              null,
              null)
            )
          }
          this.currentMatchUsersSubject.next(matchUseres);

          this.currentMatchGameSubject.next(
            new Game(
              data.game[0].game_id,
              data.game[0].name,
              data.game[0].cover_link,
              data.game[0].game_description,
              data.game[0].publisher,
              data.game[0].published
            )
          );
        }
        return data;
      }))
  }

}
