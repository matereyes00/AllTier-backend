import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const CurrentUser = createParamDecorator(
    (data: never, ctx:ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        // console.log("Request in CurrentUser:", request); // Check the request
        // console.log("Request User in CurrentUser:", request.currentUser); // Check request.user
        return request.user;
    }
)