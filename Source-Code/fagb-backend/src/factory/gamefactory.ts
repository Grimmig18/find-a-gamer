import { Game } from "src/data_objects/game";
import { User } from "src/data_objects/user";
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { UserGamePairFactory } from "./usergamepairfactory";
import { QueryObject } from "src/data_objects/queryobject";
export class GameFactory {
    // public static async getGamesForUser(user: User): Game[] {
    //     let c = new ConnectToDatabaseService();
    //     //let result = c.getResult(QueryBuilder.getGamesByUser(user));
    //     let Games: Game[];

    //     // for(let r of result) {
    //     //     //Games.push(new Game(result.Game_id, result.name, result.Game_code));
    //     // }

    //     return Games;
    // }


    public static async getGamesForUser(user: User): Promise<Game[]> {
        return new Promise(async function (resolve, reject) {
            let result;
            let games: Game[] = [];
            let query = QueryBuilder.getGamesByUser(user);
            // query = new QueryObject("SELECT * From User_Game_Pair WHere user_id = ?;", [2]);
            console.log(query);
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                // console.log("Callback value in getGamesForUser");
                // console.log(callbackValue);
                result = callbackValue;
            }, function (callbackValue) {
                console.error("ConnectToDatabaseService getPromise(): Promise rejected");
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!result || !result[0]) {
                console.log(result);
                console.error("No Games for User");
                reject(false);
                return;
            }

            result.forEach(game => {
                games.push(new Game(game.game_id, game.name, game.cover_link, game.game_description, game.publisher, game.published));
            });
            resolve(games);
        });
    }

    public static async updateGamesForUser(user: User, newGames: Game[]) {
        return new Promise(async function (resolve, reject) {
            // Update UserGamePairs
            let successful;
            let games;
            
            await UserGamePairFactory.deleteUserGamePairsByUser(user).then(async function (callbackValue) {
                successful = callbackValue;
            }, function (callbackValue) {
                console.error("UserGamePairFactory updateUserGamePairs(): Couldn't delete UserGamePairs")
                console.error(callbackValue);
                reject(callbackValue);
            });

            if (!successful) {
                return;
            }

            // create new User Game Pairs
            successful = null;
            await UserGamePairFactory.createUserGamePairs(user, newGames).then(async function (callbackValue) {
                successful = callbackValue;
            }, function (callbackValue) {
                console.error("UserGamePairFactory updateUserGamePairs(): Couldn't create UserGamePairs")
                console.error(callbackValue);
                reject(callbackValue);
            });

            if(!successful) {
                return;
            }

             // Get Updated Games for User
            await GameFactory.getGamesForUser(user).then(async function (callbackValue2) {
                games = callbackValue2;
                console.log(games);
            }, function (callbackValue2) {
                console.error("GameFactory updateGamesForUser(): Couldn't get updated Games for User");
                console.error(callbackValue2);
                reject(callbackValue2);
            });

            if (!games) {
                return;
            }

            resolve(games);
        });
    }


    // public static async updateGamesForUser(user: User, newGames: Game[]) {
    //     // Delete old User game Pairs

    // }

    public static delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }
}