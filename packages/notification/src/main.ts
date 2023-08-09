import { NestFactory } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { defaultNatsServerUrl, kNatsServerUrl } from '@server-octopus/shared'
import { NotificationModule } from './notification.module'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'

async function bootstrap() {
    const app = await NestFactory.create(NotificationModule)

    const microservice = app.connectMicroservice<MicroserviceOptions>({
        transport: Transport.NATS,
        options: {
            servers:
                app.get(ConfigService).get<string>(kNatsServerUrl) ??
                defaultNatsServerUrl
        }
    })
    await microservice.listen()
}
bootstrap()
