import { Module } from "@nestjs/common";
import { DateFormatValidator } from "./custom";
import { CustomValidationPipe } from "./validation.pipe";
import { MomentService } from "../moment/moment.service";

@Module( {
    providers: [ DateFormatValidator, MomentService, CustomValidationPipe ],
    exports: [ CustomValidationPipe, DateFormatValidator ],
} )
export class ValidationModule { }
