import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { GameService, AuthenticationService } from '../_services';
import { GameResponse } from '../data_objects/gameresponse';

import { GameSelectStatus } from '../_classes/game-select-status';
import { Game } from '../data_objects/game';
import { PublicUser } from '../data_objects/publicuser';

@Component({
  selector: 'app-add-game',
  templateUrl: './add-game.component.html',
  styleUrls: ['./add-game.component.scss']
})
export class AddGameComponent implements OnInit {
  @Input() public gameForm: FormGroup;
  public searchedGameList: Array<GameResponse> = [];
  public isSelected: Array<boolean> = [];
  public formGroupString: string;

  private gamer: PublicUser;
  private gameList: Array<GameResponse> = [];
  private selectedGames: Array<number> = [];
  private selectedGamesString: string;
  private searchTerm: string = '';

  public constructor(
    private authenticationService: AuthenticationService,
    private gameService: GameService) { }

  public ngOnInit(): void {
    this.gameService.getGame()
      .subscribe(g => this.gameList = g);

    this.gameService.getGame()
      .subscribe(g => this.searchedGameList = g);

    this.formGroupString = this.gameService.getFormState();

    if (this.gameService.getCompState() === GameSelectStatus.COMP_PROFILE) {
      this.authenticationService.currentGamer.subscribe(gamer => this.gamer = gamer);
      this.selectChoosenGame(this.gamer.games);
    }
  }

  public onKey(event: any): void { // without type info @https://angular.io/guide/user-input
    this.searchTerm = event.target.value;
    this.searchedGameList = this.searchGame(this.searchTerm);
  }

  public searchGame(searchString: string): Array<GameResponse> {
    return this.gameList.filter(g =>
      g.game.name.toLowerCase().indexOf(searchString.toLowerCase()) !== -1);
  }

  public addGame(id: number, name: string): void {
    if (this.gameService.getCompState() === GameSelectStatus.COMP_REGISTER || this.gameService.getCompState() === GameSelectStatus.COMP_PROFILE) {
      this.isSelected[id] = !this.isSelected[id];
      this.createTag(id, name);
    } else if (this.gameService.getCompState() === GameSelectStatus.COMP_MATCH) {
      if (this.selectedGames.length === 0) {
        this.isSelected[id] = !this.isSelected[id];
        this.createTag(id, name);
      } else if (this.isSelected[id]) {
        this.isSelected[id] = !this.isSelected[id];
        this.createTag(id, name);
      }
    }
  }

  public selectChoosenGame(games: Array<Game>): void {
    for (const game of games) {
      this.isSelected[game.game_id] = !this.isSelected[game.game_id];
      this.createTag(game.game_id, game.name);
    }
  }

  private createTag(id: number, name: string): void {
    const index: number = this.selectedGames.indexOf(id);
    if (index === -1) {
      // Add game id to array
      this.selectedGames.push(id);

      // Create tag-component
      const control: HTMLElement = document.createElement('DIV');
      control.classList.add('control');
      control.id = 'gametag' + id;

      const tags: HTMLElement = document.createElement('DIV');
      tags.classList.add('tags', 'are-small', 'has-addons');

      const span: HTMLElement = document.createElement('SPAN');
      span.classList.add('tag', 'is-link');
      const text: Text = document.createTextNode(name);

      const adelete: HTMLElement = document.createElement('A');
      adelete.classList.add('tag', 'is-delete');
      adelete.addEventListener('click', (e: Event) => this.addGame(id, name));

      span.appendChild(text);
      tags.appendChild(span);
      tags.appendChild(adelete);
      control.appendChild(tags);

      document.getElementById('gametags').appendChild(control);

      if (this.selectedGames.length === 1) {
        document.getElementById('gametag').style.display = 'none';
      }
    } else {
      // Remove game id from array
      this.selectedGames.splice(index, 1);
      document.getElementById('gametag' + id).remove();
      if (this.selectedGames.length === 0) {
        document.getElementById('gametag').style.display = 'inherit';
      }
    }
    this.selectedGamesString = JSON.stringify(this.selectedGames);
    this.gameForm.get('game').setValue(this.selectedGamesString);
  }
}
