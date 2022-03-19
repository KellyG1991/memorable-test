import helmet from 'helmet';
import compression from 'compression';
import { AppModule } from './app.module';
import rateLimit from 'express-rate-limit';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { INestApplication } from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MomentService } from './utils/moment/moment.service';
import { CustomValidationPipe } from './utils/validation/validation.pipe';

/**
 * Configure application
 * @param {INestApplication} app INestApplication
 */
export async function configure<T extends INestApplication> ( app: T )
{
  app.useLogger( app.get( WINSTON_MODULE_NEST_PROVIDER ) );

  // Validation conatainer
  useContainer( app.select( AppModule ), { fallbackOnErrors: true } );

  // Config service to setup other global dependencies...
  const configService: ConfigService = app.get<ConfigService>( ConfigService );

  // CORS configuration
  app.enableCors( configService.get( 'app.cors' ) );

  // Setup app timezone...
  const momentService: MomentService = await app.resolve( MomentService );

  momentService.moment.tz.setDefault( configService.get( 'app.timezone' ) );

  // Custom Validation Filter
  const validationPipe = app.get<CustomValidationPipe>( CustomValidationPipe );

  // Global validation pipe
  app.useGlobalPipes( validationPipe );

  /** Global prefix. */
  app.setGlobalPrefix( configService.get( 'app.apiPrefix' ) );

  // Well-known threats protection and solves bootloop for graphql
  app.use(
    helmet( {
      contentSecurityPolicy:
        process.env.NODE_ENV === 'production' ? undefined : false,
    } ),
  );
  // Gzip compression configuration
  app.use( compression() );

  ( app as any ).set( 'trust proxy', true );

  ( app as any ).set( 'env', configService.get( 'app.env' ) );

  ( app as any ).set( 'name', configService.get( 'app.name' ) );

  // Rate limiter
  app.use( rateLimit( configService.get( 'app.rateLimiter' ) ) );
}
