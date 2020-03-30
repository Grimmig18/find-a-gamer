import { MatchMakingRequest } from "src/data_objects/matchmakingrequest";
import { QueryBuilder } from "src/connecttodatabase/querybuilder";
import { ConnectToDatabaseService } from "src/connecttodatabase/connecttodatabase.service";

export class MatchFactory {
    public static async createMatchMakingRequest(matchMakingRequest: MatchMakingRequest) {
        return new Promise(async function (reject, resolve) {
            let query = QueryBuilder.createMatchMakingRequest(matchMakingRequest);
            let successful;
            await ConnectToDatabaseService.getPromise(query).then(function (callbackValue) {
                successful = true;
            }, function (callbackValue) {
                console.error("MatchFactory createMatchMakingRequest(): Couldn't create MatchMakingRequest");
                console.error(callbackValue);
            });

            if(!successful) {
                reject(false);
                return;
            }

            resolve(true)

            // Successfully created MatchMakingRequest
            // Now try to create a Match for that Game
            MatchFactory.createMatch(matchMakingRequest.game_id);
        });
    }

    private static async createMatch(game_id: number) {
        // Get Open MatchMakingRequests for Game
        let query = QueryBuilder.getMatchMakingRequestsByGame(game_id);
        let result;
        await ConnectToDatabaseService.getPromise(query).then(function(callbackValue) {
            result = callbackValue;
        }, function(callbackValue) {
           console.error("MatchFactory createMatch(): Couldn't get MatchMakingRequests");
           console.error(callbackValue); 
        });

        if(!result || !result[0]) {
            console.error("MatchFactory createMatch(): Result null or no MatchMakingRequests for Game: " + game_id);
        }
    }
}