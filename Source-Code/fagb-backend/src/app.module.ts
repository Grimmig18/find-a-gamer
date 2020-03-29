import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotifymatchendpointController } from './endpoints/notifymatchendpoint/notifymatchendpoint.controller';
import { ConnectToDatabaseService } from './connecttodatabase/connecttodatabase.service';
import { RegistrationendpointController } from './endpoints/registrationendpoint/registrationendpoint.controller';
import { LoginendpointController } from './endpoints/loginendpoint/loginendpoint.controller';
import { ProfileUpdateEndpointController } from './endpoints/profileupdateendpoint/profileupdateendpoint.controller';
import { ProfileDeleteEndpointController } from './endpoints/profiledeleteendpoint/profiledeleteendpoint.controller';
import { RegionEndpointController } from './endpoints/region-endpoint/region-endpoint.controller';
import { GamesEndpointController } from './endpoints/games-endpoint/games-endpoint.controller';
import { LanguagesEndpointController } from './endpoints/languages-endpoint/languages-endpoint.controller';
import { MatchMakingRequestEndpointController } from './endpoints/match-making-request-endpoint/match-making-request-endpoint.controller';

@Module({
  imports: [],
  controllers: [AppController, NotifymatchendpointController, RegistrationendpointController, LoginendpointController, ProfileUpdateEndpointController, ProfileDeleteEndpointController, RegionEndpointController, GamesEndpointController, LanguagesEndpointController, MatchMakingRequestEndpointController],
  providers: [AppService, ConnectToDatabaseService],
})
export class AppModule {}
