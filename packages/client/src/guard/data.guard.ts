import {
    CanActivate,
    ExecutionContext,
    Inject,
    Injectable,
    Logger,
    UnauthorizedException
} from '@nestjs/common'
import { Request } from 'express'
import {
    kAuthService,
    kStorageService,
    kTokenVerify
} from '@server-octopus/shared'
import { ClientProxy } from '@nestjs/microservices'
import { firstValueFrom } from 'rxjs'
import { ClientPayload, Result } from '@server-octopus/types'

@Injectable()
export class ClientDataGuard implements CanActivate {
    private logger = new Logger(ClientDataGuard.name)

    constructor(
        @Inject(kStorageService) private client: ClientProxy,
        @Inject(kAuthService) private authService: ClientProxy
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest()
        const token = this.extractTokenFromHeader(request)
        if (!token) {
            this.logger.error(`token not found`)
            throw new UnauthorizedException(`token not found`)
        }
        try {
            const { success, message, data } = await firstValueFrom(
                this.client.send<Result<ClientPayload>>(kTokenVerify, { token })
            )
            if (!success || !data.clientId) {
                this.logger.error(
                    `Token: ${token} verify failed error: ${message}`
                )
                return false
            }
            request['clientId'] = data.clientId
            this.logger.verbose(
                `token: ${token} verify success, clientId: ${data.clientId}`
            )
        } catch (e) {
            this.logger.error(`token: ${token} verify failed`)
            throw new UnauthorizedException(e)
        }
        return true
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? []
        return type === 'Bearer' ? token : undefined
    }
}
