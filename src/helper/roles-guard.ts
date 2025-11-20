import { CanActivate, ExecutionContext, Injectable, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}
    canActivate(context: ExecutionContext): boolean{
        const roles = this.reflector.get<string[]>(`roles`,context.getHandler())
        if (!roles) return true

        const request = context.switchToHttp().getRequest()
        const user = request.user
        return roles.includes(user?.role)
    }
}
export const Roles = (...roles: string []) => {
    return SetMetadata(`role`,roles)
}